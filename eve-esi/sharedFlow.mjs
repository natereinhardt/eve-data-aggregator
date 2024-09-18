/**
 * Contains all shared OAuth 2.0 flow functions for examples
 *
 * This module contains all shared functions between the two different OAuth 2.0
 * flows recommended for web based and mobile/desktop applications. The functions
 * found here are used by the OAuth 2.0 examples contained in this project.
 */

import fetch from "node-fetch";
import { validateEveJwt } from "./validateJwt.mjs";
import { URLSearchParams } from "url";

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

async function sendToTinybird(data) {
  const tinybirdUrl =
    "https://api.us-east.tinybird.co/v0/events?name=S0b_Wallet_ESI";
  const tinybirdToken =
    "Bearer p.eyJ1IjogIjdiYmRhODI4LTA4ZDItNGM0Yi04YmRkLTNkZjk4ZWZjM2JhOSIsICJpZCI6ICIwMjRmYWFmZC1lNjVhLTQ3MWQtYWNjMC0xNjUwODAyMGZkMjEiLCAiaG9zdCI6ICJ1c19lYXN0In0.K5FxrcUgU6f5XDLp9xo4bFfuQUofSz03wU33Tpa8tJE";

  // Convert data to NDJSON format
  const ndjsonData = data.map((entry) => JSON.stringify(entry)).join("\n");

  try {
    const res = await fetch(tinybirdUrl, {
      method: "POST",
      body: ndjsonData,
      headers: {
        "Content-Type": "application/x-ndjson",
        Authorization: tinybirdToken,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to send data to Tinybird: ${res.statusText}`);
    }

    const responseData = await res.json();
    console.info("Data sent to Tinybird:", responseData);
  } catch (error) {
    console.error("Error sending data to Tinybird:", error);
  }
}

async function initTinybird() {
  const tinybirdUrl =
    "https://api.us-east.tinybird.co/v0/events?name=S0b_Wallet_ESI";
  const tinybirdToken =
    "Bearer p.eyJ1IjogIjdiYmRhODI4LTA4ZDItNGM0Yi04YmRkLTNkZjk4ZWZjM2JhOSIsICJpZCI6ICIwMjRmYWFmZC1lNjVhLTQ3MWQtYWNjMC0xNjUwODAyMGZkMjEiLCAiaG9zdCI6ICJ1c19lYXN0In0.K5FxrcUgU6f5XDLp9xo4bFfuQUofSz03wU33Tpa8tJE";

  const data = {
    amount: parseFloat(58320).toFixed(2),
    balance: parseFloat(9798963512.8173).toFixed(2),
    context_id: 40154468,
    context_id_type: "planet_id",
    date: "2024-09-18T15:33:05Z",
    description:
      "Planetary Export Tax: SnookPP Zanjoahir exported from M-MD31 II",
    first_party_id: 2114715198,
    id: 23289030664,
    reason: "Export Duty for M-MD31 II",
    ref_type: "planetary_export_tax",
    second_party_id: 98399918,
    wallet_division: 1,
  };

  try {
    const res = await fetch(tinybirdUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: tinybirdToken,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to send data to Tinybird: ${res.statusText}`);
    }

    const responseData = await res.json();
    console.info("Data sent to Tinybird:", responseData);
  } catch (error) {
    console.error("Error sending data to Tinybird:", error);
  }
}
