import chalk from 'chalk';
import { upsertContracts } from '../service/contractService.mjs';

/**
 * Import corporation contracts, including issuer character info and contract items.
 * Fetches contracts from the past month by paginating until contracts older than 1 month are found.
 * @param {string} jwt - JWT token (for logging character name)
 * @param {string} accessToken - ESI access token (Bearer)
 * @param {number} corporationId - Corporation ID
 * @param {object} sequelizeInstance - Sequelize instance for upserting
 */
export async function importCorporationContracts(jwt, accessToken, corporationId, sequelizeInstance) {
  const characterName = jwt['name'];
  const contractsToUpsert = [];
  let page = 1;
  let hasMorePages = true;

  // Calculate the date 1 month ago
  const now = new Date();
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  while (hasMorePages) {
    const contractsUrl = `https://esi.evetech.net/latest/corporations/${corporationId}/contracts/?datasource=tranquility&page=${page}`;
    console.log(
      chalk.blue(
        `\nFetching contracts for corporation ${corporationId}, page ${page}...`
      )
    );

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const res = await fetchWithRetry(contractsUrl, { headers });
      console.log(
        chalk.cyan(
          `\nMade request to ${contractsUrl} with headers: ${JSON.stringify(
            [...res.headers.entries()].reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {})
          )}`
        )
      );

      if (res.status === 500) {
        const errorText = await res.text();
        console.error(
          chalk.red(
            `Received 500 error for contracts page ${page}. Error: ${errorText}`
          )
        );
        hasMorePages = false;
        continue;
      }

      if (res.status === 404) {
        console.log(
          chalk.yellow(
            `Page ${page} does not exist for contracts. Stopping pagination.`
          )
        );
        hasMorePages = false;
        break;
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `HTTP error! status: ${res.status}, body: ${errorText}`
        );
      }

      const contracts = await res.json();
      if (contracts.length === 0) {
        hasMorePages = false;
        break;
      }

      // Check if any contract is older than 1 month
      let foundOldContract = false;
      for (const contract of contracts) {
        const issuedDate = new Date(contract.date_issued);
        if (issuedDate < oneMonthAgo) {
          foundOldContract = true;
          break;
        }
      }

      for (const contract of contracts) {
        const issuedDate = new Date(contract.date_issued);
        if (issuedDate < oneMonthAgo) {
          // Skip contracts older than 1 month
          continue;
        }

        // Fetch issuer character info
        const characterUrl = `https://esi.evetech.net/latest/characters/${contract.issuer_id}/?datasource=tranquility`;
        const characterRes = await fetchWithRetry(characterUrl, { headers });
        let characterInfo = {};
        if (characterRes.ok) {
          characterInfo = await characterRes.json();
        }

        // Fetch contract items
        const itemsUrl = `https://esi.evetech.net/latest/corporations/${corporationId}/contracts/${contract.contract_id}/items/?datasource=tranquility`;
        const itemsRes = await fetchWithRetry(itemsUrl, { headers });
        let items = [];
        if (itemsRes.ok) {
          items = await itemsRes.json();
        }

        // Determine contract type label
        let contractType = contract.type;
        if (items.some(item => item.type_id === 81143 || item.type_id === 81144)) {
          contractType = 'Skyhook';
        }

        // Prepare contract for upsert
        contractsToUpsert.push({
          ...contract,
          contract_type: contractType,
          character_name: characterInfo.name || null,
        });

        // You can process items here if needed
        console.log(
          chalk.green(
            `\n${characterName} processed contract ${contract.contract_id} (type: ${contractType}) with ${items.length} items.`
          )
        );
      }

      // If any contract was older than 1 month, stop paginating
      if (foundOldContract) {
        hasMorePages = false;
      } else {
        page++;
      }
    } catch (error) {
      console.error(
        chalk.red(
          `Error fetching contracts for corporation ${corporationId}, page ${page}: ${error.message}`
        )
      );
      hasMorePages = false;
    }
  }

  // Upsert all contracts at once
  if (contractsToUpsert.length > 0 && sequelizeInstance) {
    await upsertContracts(contractsToUpsert, sequelizeInstance);
  }
}

const fetchWithRetry = async (url, options, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 504) {
        const body = await res.json();
        if (
          body.error === 'Timeout contacting tranquility' &&
          body.timeout === 10
        ) {
          if (attempt < retries) {
            console.log(`Retrying... Attempt ${attempt} of ${retries}`);
            continue;
          } else {
            throw new Error(`Failed after ${retries} attempts`);
          }
        }
      }
      return res;
    } catch (error) {
      if (attempt >= retries) {
        throw error;
      }
    }
  }
};