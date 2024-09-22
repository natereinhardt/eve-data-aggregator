/**
 * Contains all shared OAuth 2.0 flow functions for examples
 *
 * This module contains all shared functions between the two different OAuth 2.0
 * flows recommended for web based and mobile/desktop applications. The functions
 * found here are used by the OAuth 2.0 examples contained in this project.
 */

import fetch from "node-fetch";



export function sanitizeEntry(entry) {
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

export async function sendToTinybird(data) {
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
