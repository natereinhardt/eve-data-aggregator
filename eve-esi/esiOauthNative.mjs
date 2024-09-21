import crypto from "crypto";
import readline from "readline";
import fetch from "node-fetch";
import { validateEveJwt } from "./validateJwt.mjs";
import { URLSearchParams } from "url";
import { sendToTinybird } from "../tinybird/tinyBirdService.mjs";

export async function runOAuthFlow() {
  console.log("Takes you through a local example of the OAuth 2.0 native flow.");

  const { codeVerifier, codeChallenge } = generateCodeVerifierAndChallenge();

  const clientId = "7e42742a49e449c190b57ee5ba4d1a3b"; // Replace with your actual client ID
  printAuthUrl(clientId, codeChallenge);

  const authCode = await promptAuthorizationCode();

  await requestAuthorizationToken(authCode, clientId, codeVerifier);
}

function generateCodeVerifierAndChallenge() {
  const codeVerifier = crypto.randomBytes(32).toString("hex");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  return { codeVerifier, codeChallenge };
}

function promptAuthorizationCode() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter the authorization code: ", (authCode) => {
      rl.close();
      resolve(authCode);
    });
  });
}

async function requestAuthorizationToken(authCode, clientId, codeVerifier) {
  const formValues = {
    grant_type: "authorization_code",
    code: authCode,
    client_id: clientId,
    code_verifier: codeVerifier,
    redirect_uri: "https://localhost/callback/", // Replace with your actual redirect URI
  };

  try {
    const ssoResponse = await sendTokenRequest(formValues);
    await handleSsoTokenResponse(ssoResponse);
  } catch (error) {
    console.error("Error during the OAuth 2.0 flow:", error);
  }
}
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
    state: "unique-state",
  };

  if (codeChallenge) {
    params.code_challenge = codeChallenge;
    params.code_challenge_method = "S256";
  }

  const stringParams = new URLSearchParams(params).toString();
  const fullAuthUrl = `${baseAuthUrl}?${stringParams}`;

  console.log(
    `\nOpen the following link in your browser:\n\n ${fullAuthUrl} \n\n Once you have logged in as a character you will get redirected to https://localhost/callback/.`
  );
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
    Host: "login.eveonline.com",
    ...addHeaders,
  };

  const res = await fetch("https://login.eveonline.com/v2/oauth/token", {
    method: "POST",
    body: new URLSearchParams(formValues),
    headers: headers,
  });

  console.log(
    `Request sent to URL ${res.url} with headers ${JSON.stringify(
      headers
    )} and form values: ${JSON.stringify(formValues)}`
  );

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res;
}

export async function handleSsoTokenResponse(ssoResponse) {
  if (ssoResponse.ok) {
    const data = await ssoResponse.json();
    const accessToken = data["access_token"];

    console.log("\nVerifying access token JWT...");

    const jwt = await validateEveJwt(accessToken);
    console.log(jwt);
    const characterName = jwt["name"];

    const corporationId = 98399918;

    for (let walletDivision = 1; walletDivision <= 6; walletDivision++) {
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const walletPath = `https://esi.evetech.net/latest/corporations/${corporationId}/wallets/${walletDivision}/journal/?page=${page}`;

        console.log(
          `\nFetching data for wallet division ${walletDivision}, page ${page}...`
        );

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        try {
          const res = await fetch(walletPath, { headers: headers });
          console.log(
            `\nMade request to ${walletPath} with headers: ${JSON.stringify(
              res.headers.raw()
            )}`
          );

          if (res.status === 500) {
            console.error(
              `Received 500 error for wallet division ${walletDivision}, page ${page}. Moving to next division.`
            );
            hasMorePages = false;
            continue;
          }

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          if (data.length === 0) {
            hasMorePages = false;
          } else {
            data.forEach((entry) => {
              entry.wallet_division = walletDivision;
              entry.amount = parseFloat(entry.amount).toFixed(2);
              entry.balance = parseFloat(entry.balance).toFixed(2);
              sanitizeEntry(entry);
            });
            console.log(
              `\n${characterName} has ${data.length} wallet journal entries in division ${walletDivision}, page ${page}`
            );
            console.log(data);
            await sendToTinybird(data);
            page++;
          }
        } catch (error) {
          console.error(
            `Error fetching data for wallet division ${walletDivision}, page ${page}: ${error.message}`
          );
          hasMorePages = false;
        }
      }
    }
  } else {
    console.log(
      "\nSomething went wrong! Re read the comment at the top of this file and make sure you completed all the prerequisites then try again. Here's some debug info to help you out:"
    );
    console.log(
      `\nSent request with url: ${ssoResponse.url} \nbody: ${
        ssoResponse.body
      } \nheaders: ${JSON.stringify(res.headers.raw())}`
    );
    console.log(`\nSSO response code is: ${ssoResponse.status}`);
    console.log(`\nSSO response JSON is: ${await ssoResponse.json()}`);
  }
}

function sanitizeEntry(entry) {
  const schema = {
    amount: "string",
    balance: "string",
    context_id: "int",
    context_id_type: "string",
    date: "string",
    description: "string",
    first_party_id: "int",
    id: "int",
    reason: "string",
    ref_type: "string",
    second_party_id: "int",
    wallet_division: "int",
  };

  for (const key in schema) {
    if (schema[key] === "int") {
      entry[key] = entry[key] == null ? 0 : entry[key];
    } else if (schema[key] === "string") {
      entry[key] = entry[key] == null ? "" : entry[key];
    }
  }
}

runOAuthFlow().catch(console.error);
