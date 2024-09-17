/**
 * JavaScript native (desktop/mobile) OAuth 2.0 example.
 *
 * This example can be run from the command line and will show you how the
 * OAuth 2.0 flow should be handled if you are a web based application.
 *
 * Prerequisites:
 *     * Create an SSO application at developers.eveonline.com with the scope
 *       "esi-characters.read_blueprints.v1" and the callback URL
 *       "https://localhost/callback/". Note: never use localhost as a callback
 *       in released applications.
 *     * Have a Node.js environment available to you.
 *     * Run npm install with this directory as your root.
 *
 * To run this example, make sure you have completed the prerequisites and then
 * run the following command from this directory as the root:
 *
 * >>> node esiOauthNative.mjs
 *
 * then follow the prompts.
 */

import crypto from 'crypto'
import { printAuthUrl, sendTokenRequest, handleSsoTokenResponse } from './sharedFlow.mjs'

async function main() {
  console.log("Takes you through a local example of the OAuth 2.0 native flow.")

  // Generate a code verifier and code challenge for PKCE
  const codeVerifier = crypto.randomBytes(32).toString('hex')
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url')

  // Print the authorization URL
  const clientId = 'your-client-id' // Replace with your actual client ID
  printAuthUrl(clientId, codeChallenge)

  // Prompt the user to enter the authorization code
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

  readline.question('Enter the authorization code: ', async (authCode) => {
    readline.close()

    // Send a request for an authorization token
    const formValues = {
      grant_type: 'authorization_code',
      code: authCode,
      client_id: clientId,
      code_verifier: codeVerifier,
      redirect_uri: 'https://localhost/callback/' // Replace with your actual redirect URI
    }

    try {
      const ssoResponse = await sendTokenRequest(formValues)
      await handleSsoTokenResponse(ssoResponse)
    } catch (error) {
      console.error('Error during the OAuth 2.0 flow:', error)
    }
  })
}

main().catch(console.error)