export async function importWalletData(jwt, accessToken) {
  const characterName = jwt['name'];
  const corporationId = 98399918;

  for (let walletDivision = 1; walletDivision <= 6; walletDivision++) {
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const walletPath = `https://esi.evetech.net/latest/corporations/${corporationId}/wallets/${walletDivision}/journal/?page=${page}`;

      console.log(
        `\nFetching data for wallet division ${walletDivision}, page ${page}...`,
      );

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      try {
        const res = await fetch(walletPath, { headers: headers });
        console.log(
          `\nMade request to ${walletPath} with headers: ${JSON.stringify(
            res.headers.raw(),
          )}`,
        );

        if (res.status === 500) {
          console.error(
            `Received 500 error for wallet division ${walletDivision}, page ${page}. Moving to next division.`,
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
          });
          console.log(
            `\n${characterName} has ${data.length} wallet journal entries in division ${walletDivision}, page ${page}`,
          );
          await sendToTinybird(data);
          page++;
        }
      } catch (error) {
        console.error(
          `Error fetching data for wallet division ${walletDivision}, page ${page}: ${error.message}`,
        );
        hasMorePages = false;
      }
    }
  }
}
