import { sheets } from "@googleapis/sheets";
import { JWT } from "google-auth-library";

export function getEventName(column: string[]) {
  for (let i = 3; i >= 0; i--) {
    if (column[i] !== "") {
      return column[i];
    }
  }

  return undefined;
}

export async function getData(range: string, name: string) {
  const values: { event: string; value: string }[] = [];

  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = sheets({ version: "v4", auth });

  const spreadsheetId = process.env.OPEN_ROSZTI_SHEET_ID;

  const rows = await client.spreadsheets.values.get({
    auth,
    spreadsheetId,
    majorDimension: "COLUMNS",
    range,
  });

  const data = rows.data.values;

  if (!data) {
    throw new Error("No data found");
  }

  const userIndex = data[0].indexOf(name);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  data
    .filter((column) => column[userIndex] !== "0")
    .slice(1)
    .forEach((column) => {
      values.push({
        event: getEventName(column) || "N/A",
        value: column[userIndex],
      });
    });

  return values.filter((value) => value.event).filter((value) => value.value);
}

export async function getNameByCode(code: string) {
  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = sheets({ version: "v4", auth });

  const spreadsheetId = process.env.OPEN_ROSZTI_SHEET_ID;

  const rows = await client.spreadsheets.values.get({
    auth,
    spreadsheetId,
    majorDimension: "COLUMNS",
    range: "RÖszTI Kódok!A:B",
  });

  const codeIndex = rows.data.values?.[1].indexOf(code);

  if (codeIndex === undefined || codeIndex === -1) {
    return null;
  }

  return rows.data.values?.[0][codeIndex] || null;
}

export function generateNewCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let code = "";

  for (let i = 0; i < 4; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const randomNumber = Math.floor(Math.random() * 90) + 10;
  code += randomNumber;

  return code;
}

export async function generateNewCodes(count: number) {
  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = sheets({ version: "v4", auth });

  const spreadsheetId = process.env.OPEN_ROSZTI_SHEET_ID;

  const rows = await client.spreadsheets.values.get({
    auth,
    spreadsheetId,
    majorDimension: "COLUMNS",
    range: "RÖszTI Kódok!B:B",
  });

  const codes = rows.data.values?.[0] || [];

  const newCodes: string[] = Array.from({ length: count }, () => {
    let newCode: string;

    do {
      newCode = generateNewCode();
    } while (codes.includes(newCode));

    return newCode;
  });

  return newCodes;
}
