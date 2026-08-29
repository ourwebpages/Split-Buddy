import { calculateBalances, settleTransactions } from '../lib/calculations.js';
import fs from 'fs';

// Usage:
//  node examples/run-calculation.mjs data.json
//  cat data.json | node examples/run-calculation.mjs
// Where data.json is: { "members": [...], "expenses": [...] }

function printUsageAndExit() {
  console.error('Usage: node examples/run-calculation.mjs [data.json]');
  process.exit(1);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

(async function main() {
  try {
    let raw;

    if (process.argv[2]) {
      // Read from file path argument
      raw = await fs.promises.readFile(process.argv[2], 'utf8');
    } else if (!process.stdin.isTTY) {
      // Read from stdin when piped
      raw = await readStdin();
    } else {
      printUsageAndExit();
    }

    const data = JSON.parse(raw);
    const { members, expenses } = data;

    if (!Array.isArray(members) || !Array.isArray(expenses)) {
      console.error('Input JSON must have `members` and `expenses` arrays.');
      printUsageAndExit();
    }

    const balances = calculateBalances(expenses, members);
    const settlements = settleTransactions(balances);

    console.log(JSON.stringify({ balances, settlements }, null, 2));
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();
