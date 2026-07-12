const fs = require('fs');
const path = require('path');

// Paths
const mdPath = path.join(__dirname, '..', 'sandi-bank-bi.md');
const distDir = path.join(__dirname, '..', 'dist');
const publicDir = path.join(__dirname, '..', 'public');
const apiDir = path.join(publicDir, 'api');
const codeDir = path.join(apiDir, 'banks', 'code');
const bicDir = path.join(apiDir, 'banks', 'bic');

// Short name starting prefixes
const shortNamePrefixes = [
  "BANK", "BPD", "BCA", "BI", "BRI", "BSI", "BTMU", "BTN", "BUKOPIN", 
  "CHINA", "CITIBANK", "CTBC", "DBS", "DEUTSCHE", "JPMORGAN", "MNC", 
  "PANIN", "STANDCHARD", "UOB", "KROM", "SUPER", "ANZ", "BAG", "ALLO", 
  "BOC", "BBA", "BOA"
];

// Manual overrides for specific bank names/short names
const overrides = {
  68: { name: "PT. BANK DIGITAL BCA", name_singkat: "BANK DIGITAL BCA" },
  77: { name: "PT. BANK KB BUKOPIN SYARIAH", name_singkat: "BANK KB BUKOPIN SYARIAH" },
  85: { name: "PT. BANK BNP PARIBAS INDONESIA", name_singkat: "BNP PARIBAS" },
  124: { name: "STANDARD CHARTERED BANK", name_singkat: "STANDCHARD" }
};

// Main Parsing Function
function parseBanks() {
  console.log('Reading bank codes from sandi-bank-bi.md...');
  if (!fs.existsSync(mdPath)) {
    console.error(`Error: Source file not found at ${mdPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(mdPath, 'utf-8');
  // Normalize line endings: replace <br> with newlines, then split by \n
  const normalizedContent = content.replace(/<br>/g, '\n');
  const lines = normalizedContent.split('\n');

  // Regex matches: NO, BIC, MIDDLE_TEXT, CODE, OFFICE_CODE
  const bankRegex = /^(\d+)\s+([A-Z0-9]{8})\s+(.+?)\s+(\d{3})\s+(\d{4})\r?$/;
  const parsedBanks = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (/^\d+/.test(trimmed)) {
      const match = trimmed.match(bankRegex);
      if (match) {
        const no = parseInt(match[1]);
        const bic = match[2];
        const middleText = match[3].trim();
        const code = match[4];
        const officeCode = match[5];

        let fullName = middleText;
        let shortName = middleText;

        if (overrides[no]) {
          fullName = overrides[no].name;
          shortName = overrides[no].name_singkat;
        } else {
          const words = middleText.split(/\s+/);
          let shortNameIndex = -1;

          // Scan from right to left to find the first prefix
          for (let i = words.length - 1; i >= 0; i--) {
            const cleanedWord = words[i].toUpperCase().replace(/[^A-Z]/g, '');
            if (shortNamePrefixes.includes(cleanedWord)) {
              shortNameIndex = i;
              // Continue left if the previous word is also a prefix
              while (i > 0) {
                const prevCleaned = words[i - 1].toUpperCase().replace(/[^A-Z]/g, '');
                if (shortNamePrefixes.includes(prevCleaned)) {
                  shortNameIndex = i - 1;
                  i--;
                } else {
                  break;
                }
              }
              break;
            }
          }

          if (shortNameIndex !== -1 && shortNameIndex > 0) {
            fullName = words.slice(0, shortNameIndex).join(' ');
            shortName = words.slice(shortNameIndex).join(' ');
          }
        }

        // Clean up leading "PT" (with optional dot/space)
        fullName = fullName.replace(/^PT\b\.?\s*/i, '').trim();
        shortName = shortName.replace(/^PT\b\.?\s*/i, '').trim();

        // Clean up trailing commas
        fullName = fullName.replace(/,$/, '').trim();

        parsedBanks.push({
          no,
          sandi_bic: bic,
          name: fullName,
          name_singkat: shortName,
          code,
          kode_kantor: officeCode
        });
      }
    }
  });

  return parsedBanks;
}

// Helper to ensure directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Copy public assets to dist
function copyPublicAssets() {
  console.log('Copying public assets to dist...');
  if (!fs.existsSync(publicDir)) {
    console.log('Public folder does not exist yet. Skipping asset copying.');
    return;
  }
  
  ensureDir(distDir);
  copyDirRecursive(publicDir, distDir);
}

function copyDirRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    ensureDir(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      copyDirRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Main Runner
function main() {
  const banks = parseBanks();
  console.log(`Successfully parsed ${banks.length} banks.`);

  // Create dirs
  ensureDir(distDir);
  ensureDir(apiDir);
  ensureDir(codeDir);
  ensureDir(bicDir);

  // Write all banks
  const allBanksPath = path.join(apiDir, 'banks.json');
  fs.writeFileSync(allBanksPath, JSON.stringify(banks, null, 2), 'utf-8');
  console.log(`Wrote all banks list to ${allBanksPath}`);

  // Write individual bank by code
  banks.forEach((bank) => {
    const singleCodePath = path.join(codeDir, `${bank.code}.json`);
    fs.writeFileSync(singleCodePath, JSON.stringify(bank, null, 2), 'utf-8');

    const singleBicPath = path.join(bicDir, `${bank.sandi_bic}.json`);
    fs.writeFileSync(singleBicPath, JSON.stringify(bank, null, 2), 'utf-8');
  });
  console.log(`Wrote ${banks.length} individual bank code and BIC files.`);

  // Copy frontend
  copyPublicAssets();
  console.log('Build completed successfully!');
}

main();
