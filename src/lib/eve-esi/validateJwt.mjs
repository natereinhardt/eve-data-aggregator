import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import readline from 'readline';
import jwkToPem from 'jwk-to-pem';

const SSO_META_DATA_URL = "https://login.eveonline.com/.well-known/oauth-authorization-server";
const JWK_ALGORITHM = "RS256";
const JWK_ISSUERS = ["login.eveonline.com", "https://login.eveonline.com"];
const JWK_AUDIENCE = "EVE Online";

export async function validateEveJwt(token) {
  // Fetch JWKs URL from metadata endpoint
  const resMeta = await fetch(SSO_META_DATA_URL);
  if (!resMeta.ok) {
    throw new Error(`Failed to fetch metadata: ${resMeta.statusText}`);
  }
  const metaData = await resMeta.json();
  const jwksUri = metaData.jwks_uri;

  // Fetch JWKs from endpoint
  const resJwks = await fetch(jwksUri);
  if (!resJwks.ok) {
    throw new Error(`Failed to fetch JWKs: ${resJwks.statusText}`);
  }
  const jwksData = await resJwks.json();
  const jwkSets = jwksData.keys;

  // Pick the JWK with the requested algorithm
  const jwkSet = jwkSets.find(item => item.alg === JWK_ALGORITHM);
  if (!jwkSet) {
    throw new Error(`No JWK found with algorithm ${JWK_ALGORITHM}`);
  }

  // Convert JWK to PEM format
  const pem = jwkToPem(jwkSet);

  // Decode the token and validate it against expected values
  const tokenContents = jwt.verify(token, pem, {
    algorithms: [JWK_ALGORITHM],
    issuer: JWK_ISSUERS,
    audience: JWK_AUDIENCE,
  });

  return tokenContents;
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter an access token to validate: ', async (token) => {
    rl.close();

    try {
      const tokenContents = await validateEveJwt(token);
      console.log(`\nThe contents of the access token are:\n${JSON.stringify(tokenContents, null, 2)}`);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.error('The JWT token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        console.error(`The JWT token was invalid: ${error.message}`);
      } else {
        console.error(`Error validating token: ${error.message}`);
      }
      process.exit(1);
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}