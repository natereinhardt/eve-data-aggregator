/**
 * Validates a given JWT access token originating from the EVE SSO.
 *
 * Prerequisites:
 *     * Have a Node.js environment available to you.
 *     * Run npm install with this directory as your root.
 *
 * This can be run by doing
 *
 * >>> node validateJwt.mjs
 *
 * and passing in a JWT access token that you have retrieved from the EVE SSO.
 */

import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import readline from 'readline';

const SSO_META_DATA_URL = "https://login.eveonline.com/.well-known/oauth-authorization-server";
const JWK_ALGORITHM = "RS256";
const JWK_ISSUERS = ["login.eveonline.com", "https://login.eveonline.com"];
const JWK_AUDIENCE = "EVE Online";

export async function validateEveJwt(token) {
  /**
   * Validate a JWT access token retrieved from the EVE SSO.
   *
   * @param {string} token - A JWT access token originating from the EVE SSO
   * @returns {Object} - The contents of the validated JWT access token if there are no errors
   */
  // fetch JWKs URL from meta data endpoint
  const res = await fetch(SSO_META_DATA_URL);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  const jwksUri = data.jwks_uri;

  // fetch JWKs from endpoint
  const jwksRes = await fetch(jwksUri);
  if (!jwksRes.ok) {
    throw new Error(`HTTP error! status: ${jwksRes.status}`);
  }
  const jwksData = await jwksRes.json();
  const jwkSet = jwksData.keys.find(item => item.alg === JWK_ALGORITHM);

  if (!jwkSet) {
    throw new Error(`No JWK set found with algorithm ${JWK_ALGORITHM}`);
  }

  // try to decode the token and validate it against expected values
  // will raise JWT exceptions if decoding fails or expected values do not match
  const contents = jwt.verify(token, jwkSet, {
    algorithms: [JWK_ALGORITHM],
    issuer: JWK_ISSUERS,
    audience: JWK_AUDIENCE
  });

  return contents;
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

if (require.main === module) {
  main().catch(console.error);
}