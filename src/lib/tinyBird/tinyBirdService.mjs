
import fetch from "node-fetch";
import { sanitizeEntry } from "../../utils/helpers.mjs";

export async function sendToTinybird(data) {

  // Assuming `data` is an array of entries
  data.forEach((entry) => {
    sanitizeEntry(entry);
  });

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

