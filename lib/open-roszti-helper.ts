import { sheets } from "@googleapis/sheets";
import { JWT } from "google-auth-library";

function getSheetsClient() {
  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return sheets({ version: "v4", auth });
}

const spreadsheetId = process.env.OPEN_ROSZTI_SHEET_ID;

export function getEventName(column: string[]): string | undefined {
  for (let i = 3; i >= 0; i--) {
    if (column[i] !== "") return column[i];
  }
  return undefined;
}

export async function getData(range: string, name: string) {
  const client = getSheetsClient();
  const rows = await client.spreadsheets.values.get({
    spreadsheetId,
    majorDimension: "COLUMNS",
    range,
  });

  const data = rows.data.values;
  if (!data) throw new Error("No data found");

  const userIndex = data[0].indexOf(name);
  if (userIndex === -1) throw new Error("User not found");

  return data
    .slice(1)
    .filter((column) => column[userIndex] !== "0")
    .map((column) => ({
      event: getEventName(column) || "N/A",
      value: column[userIndex],
    }))
    .filter((v) => v.event && v.value);
}

export async function getNameByCode(code: string) {
  const client = getSheetsClient();
  const rows = await client.spreadsheets.values.get({
    spreadsheetId,
    majorDimension: "COLUMNS",
    range: "RÖszTI Kódok!A:B",
  });

  const codeIndex = rows.data.values?.[1].indexOf(code);
  if (codeIndex === undefined || codeIndex === -1) return null;
  return rows.data.values?.[0][codeIndex] || null;
}

export function generateNewCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letters = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  const num = Math.floor(Math.random() * 90) + 10;
  return `${letters}${num}`;
}

export async function generateNewCodes(count: number) {
  const client = getSheetsClient();
  const rows = await client.spreadsheets.values.get({
    spreadsheetId,
    majorDimension: "COLUMNS",
    range: "RÖszTI Kódok!B:B",
  });

  const existing = rows.data.values?.[0] || [];
  return Array.from({ length: count }, () => {
    let code: string;
    do {
      code = generateNewCode();
    } while (existing.includes(code));
    return code;
  });
}
