import crypto from 'crypto';
import readline from 'readline';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { validateEveJwt } from './validateJwt.mjs';

export async function runOAuthFlow() {
  console.log('Takes you through a local example of the OAuth 2.0 native flow.');

  const { codeVerifier, codeChallenge } = generateCodeVerifierAndChallenge();
  const clientId = '7e42742a49e449c190b57ee5ba4d1a3b'; // Replace with your actual client ID

  printAuthUrl(clientId, codeChallenge);
  const authCode = await promptAuthorizationCode();

  return await requestAuthorizationToken(authCode, clientId, codeVerifier);
}

function generateCodeVerifierAndChallenge() {
  const codeVerifier = crypto.randomBytes(32).toString('hex');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  return { codeVerifier, codeChallenge };
}

function promptAuthorizationCode() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the authorization code: ', (authCode) => {
      rl.close();
      resolve(authCode);
    });
  });
}

async function requestAuthorizationToken(authCode, clientId, codeVerifier) {
  const formValues = {
    grant_type: 'authorization_code',
    code: authCode,
    client_id: clientId,
    code_verifier: codeVerifier,
    redirect_uri: 'https://localhost/callback/', // Replace with your actual redirect URI
  };

  try {
    const ssoResponse = await sendTokenRequest(formValues);
    return await handleSsoTokenResponse(ssoResponse);
  } catch (error) {
    console.error('Error during the OAuth 2.0 flow:', error);
    throw error; // Ensure the error is propagated
  }
}

export function printAuthUrl(clientId, codeChallenge = null) {
  const baseAuthUrl = 'https://login.eveonline.com/v2/oauth/authorize/';
  const params = {
    response_type: 'code',
    redirect_uri: 'https://localhost/callback/',
    client_id: clientId,
    scope: 'esi-wallet.read_corporation_wallets.v1',
    state: 'unique-state',
  };

  if (codeChallenge) {
    params.code_challenge = codeChallenge;
    params.code_challenge_method = 'S256';
  }

  const stringParams = new URLSearchParams(params).toString();
  const fullAuthUrl = `${baseAuthUrl}?${stringParams}`;

  console.log(
    `\nOpen the following link in your browser:\n\n ${fullAuthUrl} \n\n Once you have logged in as a character you will get redirected to https://localhost/callback/.`,
  );
}

export async function sendTokenRequest(formValues, addHeaders = {}) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Host: 'login.eveonline.com',
    ...addHeaders,
  };

  const res = await fetch('https://login.eveonline.com/v2/oauth/token', {
    method: 'POST',
    body: new URLSearchParams(formValues),
    headers: headers,
  });

  console.log(
    `Request sent to URL ${res.url} with headers ${JSON.stringify(headers)} and form values: ${JSON.stringify(formValues)}`,
  );

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res;
}

export async function handleSsoTokenResponse(ssoResponse) {
  if (ssoResponse.ok) {
    const data = await ssoResponse.json();
    const accessToken = data['access_token'];

    console.log('\nVerifying access token JWT...');

    const jwt = await validateEveJwt(accessToken);
    console.log(jwt);

    return { jwt, accessToken };
  } else {
    console.log(
      "\nSomething went wrong! Re read the comment at the top of this file and make sure you completed all the prerequisites then try again. Here's some debug info to help you out:",
    );
    console.log(
      `\nSent request with url: ${ssoResponse.url} \nbody: ${ssoResponse.body} \nheaders: ${JSON.stringify(ssoResponse.headers.raw())}`,
    );
    console.log(`\nSSO response code is: ${ssoResponse.status}`);
    console.log(`\nSSO response JSON is: ${await ssoResponse.json()}`);
    throw new Error('SSO token response error');
  }
}