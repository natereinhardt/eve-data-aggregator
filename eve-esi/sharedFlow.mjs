/**
 * Contains all shared OAuth 2.0 flow functions for examples
 *
 * This module contains all shared functions between the two different OAuth 2.0
 * flows recommended for web based and mobile/desktop applications. The functions
 * found here are used by the OAuth 2.0 examples contained in this project.
 */

import fetch from 'node-fetch';
import { validateEveJwt } from './validateJwt.mjs';
import { URLSearchParams } from 'url';

export function printAuthUrl(clientId, codeChallenge = null) {
  /**
   * Prints the URL to redirect users to.
   *
   * @param {string} clientId - The client ID of an EVE SSO application
   * @param {string} [codeChallenge] - A PKCE code challenge
   */
  const baseAuthUrl = "https://login.eveonline.com/v2/oauth/authorize/";
  const params = {
    response_type: "code",
    redirect_uri: "https://localhost/callback/",
    client_id: clientId,
    scope: "esi-wallet.read_corporation_wallets.v1",
    state: "unique-state"
  };

  if (codeChallenge) {
    params.code_challenge = codeChallenge;
    params.code_challenge_method = "S256";
  }

  const stringParams = new URLSearchParams(params).toString();
  const fullAuthUrl = `${baseAuthUrl}?${stringParams}`;

  console.log(`\nOpen the following link in your browser:\n\n ${fullAuthUrl} \n\n Once you have logged in as a character you will get redirected to https://localhost/callback/.`);
}

export async function sendTokenRequest(formValues, addHeaders = {}) {
  /**
   * Sends a request for an authorization token to the EVE SSO.
   *
   * @param {Object} formValues - A dict containing the form encoded values that should be sent with the request
   * @param {Object} [addHeaders={}] - A dict containing additional headers to send
   * @returns {Promise<Response>} - A fetch Response object
   */
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Host": "login.eveonline.com",
    ...addHeaders
  };

  const res = await fetch("https://login.eveonline.com/v2/oauth/token", {
    method: 'POST',
    body: new URLSearchParams(formValues),
    headers: headers
  });

  console.log(`Request sent to URL ${res.url} with headers ${JSON.stringify(headers)} and form values: ${JSON.stringify(formValues)}`);
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res;
}

export async function handleSsoTokenResponse(ssoResponse) {
  /**
   * Handles the authorization code response from the EVE SSO.
   *
   * @param {Response} ssoResponse - A fetch Response object gotten by calling the EVE SSO /v2/oauth/token endpoint
   */
  if (ssoResponse.ok) {
    const data = await ssoResponse.json();
    const accessToken = data["access_token"];

    console.log("\nVerifying access token JWT...");

    const jwt = await validateEveJwt(accessToken);
    console.log(jwt);
    const characterId = jwt["sub"].split(":")[2];
    const characterName = jwt["name"];

    const corporationId = 98399918;
    const walletDivision = 5;
    const walletPath = `https://esi.evetech.net/latest/corporations/${corporationId}/wallets/${walletDivision}/journal/`;

    console.log(`\nSuccess! Here is the payload received from the EVE SSO: ${JSON.stringify(data)}\nYou can use the access_token to make an authenticated request to ${walletPath}`);

    console.log("\nPress any key to have this program make the request for you:");
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', async () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();

      const headers = {
        "Authorization": `Bearer ${accessToken}`
      };

      const res = await fetch(walletPath, { headers: headers });
      console.log(`\nMade request to ${walletPath} with headers: ${JSON.stringify(res.headers.raw())}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(`\n${characterName} has ${data.length} wallet journal entries in division ${walletDivision}`);
    });
  } else {
    console.log("\nSomething went wrong! Re read the comment at the top of this file and make sure you completed all the prerequisites then try again. Here's some debug info to help you out:");
    console.log(`\nSent request with url: ${ssoResponse.url} \nbody: ${ssoResponse.body} \nheaders: ${JSON.stringify(ssoResponse.headers.raw())}`);
    console.log(`\nSSO response code is: ${ssoResponse.status}`);
    console.log(`\nSSO response JSON is: ${await ssoResponse.json()}`);
  }
}