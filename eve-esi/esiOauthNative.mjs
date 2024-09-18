import crypto from 'crypto';
import readline from 'readline';
import { printAuthUrl, sendTokenRequest, handleSsoTokenResponse } from './sharedFlow.mjs';

export async function main() {
  console.log("Takes you through a local example of the OAuth 2.0 native flow.");

  // Generate a code verifier and code challenge for PKCE
  const codeVerifier = crypto.randomBytes(32).toString('hex');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

  // Print the authorization URL
  const clientId = '7e42742a49e449c190b57ee5ba4d1a3b'; // Replace with your actual client ID
  printAuthUrl(clientId, codeChallenge);

  // Prompt the user to enter the authorization code
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the authorization code: ', async (authCode) => {
    rl.close();

    // Send a request for an authorization token
    const formValues = {
      grant_type: 'authorization_code',
      code: authCode,
      client_id: clientId,
      code_verifier: codeVerifier,
      redirect_uri: 'https://localhost/callback/' // Replace with your actual redirect URI
    };

    try {
      const ssoResponse = await sendTokenRequest(formValues);
      await handleSsoTokenResponse(ssoResponse);
    } catch (error) {
      console.error('Error during the OAuth 2.0 flow:', error);
    }
  });
}

main().catch(console.error);