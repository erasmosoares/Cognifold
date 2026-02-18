/**
 * generate-synthetic-data.js
 *
 * Reads a JSON data file and writes a synthetic copy that:
 * - preserves structure, arrays and object keys
 * - keeps market / ticker symbols unchanged
 * - replaces identifying values (ids, personal/company names, timestamps) with realistic, fictitious values
 * - randomizes counts and numeric values so output differs from input
 *
 * Usage:
 *   node ./scripts/generate-synthetic-data.js /path/to/coinfac-data-sample.json
 *
 * Output:
 *   same-folder/coinfac-data-sample-synthetic.json
 */
const fs = require('fs');
const path = require('path');

(async () => {
  // Import faker (ESM) robustly
  const mod = await import('@faker-js/faker');
  const faker = (mod && (mod.faker ?? mod.default ?? mod)) || {};

  // --- Helpers (uuid, random, jitter, dates) ---
  const uuid = () => {
    try {
      if (typeof globalThis?.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID();
      const { randomUUID } = require('crypto');
      if (typeof randomUUID === 'function') return randomUUID();
    } catch {}
    if (faker && typeof faker.string?.uuid === 'function') return faker.string.uuid();
    if (faker && typeof faker.datatype?.uuid === 'function') return faker.datatype.uuid();
    return 'id_' + Math.random().toString(36).slice(2, 12);
  };

  const rand = (min, max) => Math.random() * (max - min) + min;
  const randomNumericString = (len = 8) => {
    if (faker && typeof faker.string?.numeric === 'function') return faker.string.numeric(len);
    if (faker && typeof faker.random?.numeric === 'function') return faker.random.numeric(len);
    let s = '';
    while (s.length < len) s += Math.floor(Math.random() * 10).toString();
    return s.slice(0, len);
  };

  const safeCompanyName = () => (faker && typeof faker.company?.name === 'function') ? faker.company.name() : 'Acme Corporation';
  const safeCatchPhrase = () => (faker && typeof faker.company?.catchPhrase === 'function') ? faker.company.catchPhrase() : 'Premium Service Plan';
  const safeEmail = () => (faker && typeof faker.internet?.email === 'function') ? faker.internet.email() : `user${randomNumericString(4)}@example.com`;
  const safeAccountName = () => (faker && typeof faker.finance?.accountName === 'function') ? faker.finance.accountName() : 'Personal Account';
  const safeWordNoun = () => (faker && typeof faker.word?.noun === 'function') ? faker.word.noun() : 'item';
  const replaceFreeText = () => `Text ${safeWordNoun()} ${randomNumericString(2)}`;

  function jitterNumber(n, rangePercent = 0.3) {
    if (typeof n !== 'number' || isNaN(n)) return n;
    const factor = 1 + rand(-rangePercent, rangePercent);
    if (Number.isInteger(n)) return Math.max(0, Math.round(n * factor));
    return parseFloat((n * factor).toFixed(2));
  }

  function shiftDate(dateStr, deltaDays = 14) {
    if (!dateStr) return null;
    const dt = new Date(dateStr);
    if (isNaN(dt.getTime())) return dateStr;
    const shift = Math.floor(rand(-deltaDays, deltaDays + 1));
    dt.setDate(dt.getDate() + shift);
    return dt.toISOString().split('T')[0];
  }

  function randomizeArray(origArr, deltaPercent = 0.3) {
    if (!Array.isArray(origArr)) return origArr;
    if (origArr.length === 0) return [];
    const factor = 1 + rand(-deltaPercent, deltaPercent);
    const newLen = Math.max(1, Math.round(origArr.length * factor));
    const result = [];
    if (newLen <= origArr.length) {
      const indices = new Set();
      while (indices.size < newLen) indices.add(Math.floor(rand(0, origArr.length)));
      for (const i of indices) result.push(JSON.parse(JSON.stringify(origArr[i])));
      return result;
    }
    for (const it of origArr) result.push(JSON.parse(JSON.stringify(it)));
    while (result.length < newLen) {
      const pick = JSON.parse(JSON.stringify(origArr[Math.floor(rand(0, origArr.length))]));
      if (pick && typeof pick === 'object') {
        if ('id' in pick) pick.id = uuid();
        for (const k of Object.keys(pick)) {
          if (typeof pick[k] === 'number') pick[k] = jitterNumber(pick[k]);
          if (typeof pick[k] === 'string' && k.toLowerCase().includes('date')) pick[k] = shiftDate(pick[k]);
        }
      }
      result.push(pick);
    }
    return result;
  }

  // --- Load project typed value sets (models/types) and expose to synthesizer ---
  const typesDir = path.join(__dirname, '..', 'src', 'renderer', 'src', 'models', 'types');
  const typeSets = {}; // key -> array of values
  try {
    if (fs.existsSync(typesDir)) {
      const files = fs.readdirSync(typesDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
      for (const file of files) {
        const full = path.join(typesDir, file);
        const content = fs.readFileSync(full, 'utf8');
        // try to extract exported const arrays of string literals: const name = ["A","B"] as const;
        const constMatch = content.match(/const\s+([A-Za-z0-9_]+)\s*=\s*\[([\s\S]*?)\]\s*as\s*const/);
        if (constMatch) {
          const name = constMatch[1];
          const inner = constMatch[2];
          const vals = [];
          const re = /['"`]([^'"`]+?)['"`]/g;
          let m;
          while ((m = re.exec(inner)) !== null) vals.push(m[1]);
          if (vals.length) {
            typeSets[name] = vals;
            typeSets[name.toLowerCase()] = vals;
          }
        } else {
          // fallback: simple export default array or const assignment: const status = ["Active","Canceled"];
          const arrMatch = content.match(/(export\s+default|const)\s+([A-Za-z0-9_]+)?\s*.*=\s*\[([\s\S]*?)\]/);
          if (arrMatch) {
            const name = arrMatch[2] || path.basename(file, path.extname(file));
            const inner = arrMatch[3];
            const vals = [];
            const re = /['"`]([^'"`]+?)['"`]/g;
            let m;
            while ((m = re.exec(inner)) !== null) vals.push(m[1]);
            if (vals.length) {
              typeSets[name] = vals;
              typeSets[name.toLowerCase()] = vals;
            }
          }
        }
      }
    }
  } catch (err) {
    // Non-fatal: continue without typed sets
  }

  // Ensure the script uses the specific typed lists you requested as fallbacks
  const explicitTypeSets = {
    account_owner: ["Individual","Joint","Corporate","Trust","Government","Non-profit","Partnership","Other entities"],
    accounts: ["TFSA","Non-Registered","Other"],
    bank_accounts: ["Checking","Savings","TFSA","RRSP","RESP","Business","Non-Registered","Other"],
    billing: ["Monthly","Yearly"],
    borrower: ["Personal Loan","Mortgage","Auto Loan","Student Load","Others"],
    categories: ["Stock","Option","ETF","Fund","Bonds","Fixed-Income","REIT","Cryptocurrencies","Others"],
    status: ["Active","Canceled","OnHold"],
    tiers: [
      "Tier 1 - Core Foundation (broad-market ETFs, e.g. S&P 500, TSX 60)",
      "Tier 2 - Strategic Anchors (sector ETFs, defensive stocks)",
      "Tier 3 - Growth Drivers (tech, healthcare, mid-cap ETFs)",
      "Tier 4 - Opportunistic Plays (trends, emerging markets, niche ETFs)",
      "Tier 5 - High-Risk Satellites (speculative single stocks, leveraged ETFs)"
    ]
  };

  // merge explicit sets only when a set with same name isn't already loaded from models/types
  for (const [k, v] of Object.entries(explicitTypeSets)) {
    if (!typeSets[k] && !typeSets[k.toLowerCase()]) {
      typeSets[k] = v;
      typeSets[k.toLowerCase()] = v;
    }
  }

  const getTypeSetForKey = (key) => {
    if (!key) return null;
    // direct matches
    if (typeSets[key]) return typeSets[key];
    if (typeSets[key.toLowerCase()]) return typeSets[key.toLowerCase()];
    // map common key variants to type sets
    const mapping = {
      owner: 'account_owner',
      ownername: 'account_owner',
      accountowner: 'account_owner',
      account_owner: 'account_owner',
      account_owner_type: 'account_owner',
      accounttype: 'bank_accounts',
      account_type: 'bank_accounts',
      type: 'categories',
      category: 'categories',
      categories: 'categories',
      billing: 'billing',
      borrower: 'borrower',
      status: 'status',
      tier: 'tiers',
      tiers: 'tiers',
      accounts: 'accounts',
      bank_accounts: 'bank_accounts'
    };
    const normalized = key.toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (mapping[normalized] && typeSets[mapping[normalized]]) return typeSets[mapping[normalized]];
    // fallback: try to find any typeSet containing the original value (no-op)
    return null;
  };

  // --- CLI args / load input JSON ---
  if (process.argv.length < 3) {
    console.error('Usage: node generate-synthetic-data.js <input-json-path>');
    process.exit(1);
  }
  const inputPath = process.argv[2];
  if (!fs.existsSync(inputPath)) {
    console.error('Input file not found:', inputPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(inputPath, 'utf8');
  let data;
  try { data = JSON.parse(raw); } catch (e) { console.error('Failed to parse JSON:', e); process.exit(1); }

  // map original account ids -> new ids
  const accountIdMap = new Map();
  if (Array.isArray(data.accounts)) {
    const origAccounts = data.accounts;
    const newAccountsArr = randomizeArray(origAccounts, 0.25);
    const newAccounts = newAccountsArr.map((acct, idx) => {
      const oldId = acct.id ?? `orig-${idx}`;
      const newId = uuid();
      accountIdMap.set(String(oldId), newId);
      return {
        ...acct,
        id: newId,
        name: safeCompanyName() + (Math.random() < 0.25 ? ' (Managed)' : ''),
        last_update: shiftDate(acct.last_update ?? acct.lastUpdate ?? new Date().toISOString()),
        current_value: typeof acct.current_value === 'number' ? jitterNumber(acct.current_value) : acct.current_value
      };
    });
    data.accounts = newAccounts;
  }

  // --- Synthesize function that uses typed sets when available ---
  function synthesize(obj, ctx = {}) {
    if (Array.isArray(obj)) {
      const arr = randomizeArray(obj, 0.2);
      return arr.map((item, idx) => synthesize(item, { ...ctx, idx }));
    }
    if (obj && typeof obj === 'object') {
      const out = {};
      for (const [k, v] of Object.entries(obj)) {
        // If a typed set exists for this key, pick a random value from it
        const typeSet = getTypeSetForKey(k);
        if (typeSet && typeSet.length) {
          // preserve original if it is already in set (but we randomize to be safe)
          out[k] = typeSet[Math.floor(rand(0, typeSet.length))];
          continue;
        }

        // ticker symbols preserved
        if (k.toLowerCase().includes('symbol') && typeof v === 'string') {
          out[k] = v;
          continue;
        }

        if (k === 'id') { out[k] = uuid(); continue; }
        if (k === 'account_id') {
          const mapped = accountIdMap.get(String(v));
          if (mapped) out[k] = mapped;
          else {
            const vals = Array.from(accountIdMap.values());
            out[k] = vals.length ? vals[Math.floor(rand(0, vals.length))] : uuid();
          }
          continue;
        }

        if (typeof v === 'number') { out[k] = jitterNumber(v); continue; }

        const dateKeys = ['last_update','lastUpdate','update_date','updateDate','date','transaction_date','created_at','timestamp'];
        if (dateKeys.includes(k)) { out[k] = shiftDate(String(v || ''), 14); continue; }

        if (k.toLowerCase() === 'name' && ctx.parent === 'subscriptions') { out[k] = safeCatchPhrase(); continue; }
        if (k.toLowerCase() === 'name' && ctx.parent === 'liabilities') { out[k] = safeAccountName(); continue; }
        if (k.toLowerCase() === 'account_name') { out[k] = safeCompanyName(); continue; }

        if (typeof v === 'string' && v.includes('@')) { out[k] = safeEmail(); continue; }
        if (typeof v === 'string') {
          if (/^[A-Z0-9_\-]{2,10}$/.test(v) && v.toUpperCase() === v) { out[k] = v; continue; }
          if (/\d{7,}/.test(v) && v.length > 6) { out[k] = randomNumericString(Math.min(12, v.length)); continue; }
          out[k] = replaceFreeText();
          continue;
        }

        out[k] = synthesize(v, { parent: ctx.parent || null, key: k });
      }
      return out;
    }
    return obj;
  }

  // --- Apply targeted top-level transformations while using synthesize for nested pieces ---
  const synthetic = { ...data };

  if (Array.isArray(synthetic.marketPurchases)) {
    synthetic.marketPurchases = randomizeArray(synthetic.marketPurchases, 0.25).map(row => {
      const r = synthesize(row, { parent: 'marketPurchases' });
      r.id = uuid();
      if ('date' in r) r.date = shiftDate(r.date);
      if ('symbol' in r) r.symbol = row.symbol;
      return r;
    });
  }
  if (Array.isArray(synthetic.marketSales)) {
    synthetic.marketSales = randomizeArray(synthetic.marketSales, 0.25).map(row => {
      const r = synthesize(row, { parent: 'marketSales' });
      r.id = uuid();
      if ('date' in r) r.date = shiftDate(r.date);
      return r;
    });
  }
  if (Array.isArray(synthetic.subscriptions)) {
    synthetic.subscriptions = randomizeArray(synthetic.subscriptions, 0.25).map(s => {
      const r = synthesize(s, { parent: 'subscriptions' });
      r.id = uuid();
      r.name = safeCatchPhrase();
      if ('renewal' in r) r.renewal = shiftDate(r.renewal);
      return r;
    });
  }

  ['topSymbols','topGains','topLosses'].forEach(key => {
    if (Array.isArray(synthetic[key])) synthetic[key] = randomizeArray(synthetic[key], 0.3).map(t => ({ ...synthesize(t, { parent: key }), id: uuid() }));
  });

  if (Array.isArray(synthetic.accountTransactions)) {
    synthetic.accountTransactions = randomizeArray(synthetic.accountTransactions, 0.2).map(tx => {
      const newTx = synthesize(tx, { parent: 'accountTransactions' });
      newTx.id = uuid();
      const mapped = accountIdMap.get(String(tx.account_id));
      if (mapped) newTx.account_id = mapped;
      else {
        const vals = Array.from(accountIdMap.values());
        newTx.account_id = vals.length ? vals[Math.floor(rand(0, vals.length))] : uuid();
      }
      if ('update_date' in newTx) newTx.update_date = shiftDate(newTx.update_date);
      return newTx;
    });
  }

  if (Array.isArray(synthetic.assets)) synthetic.assets = randomizeArray(synthetic.assets, 0.25).map(a => { const r = synthesize(a, { parent: 'assets' }); r.id = uuid(); if ('date' in r) r.date = shiftDate(r.date); return r; });
  if (Array.isArray(synthetic.assetsTransactions)) synthetic.assetsTransactions = randomizeArray(synthetic.assetsTransactions, 0.2).map(a => { const r = synthesize(a, { parent: 'assetsTransactions' }); r.id = uuid(); if ('update_date' in r) r.update_date = shiftDate(r.update_date); return r; });

  if (Array.isArray(synthetic.liabilities)) synthetic.liabilities = randomizeArray(synthetic.liabilities, 0.25).map(l => { const r = synthesize(l, { parent: 'liabilities' }); r.id = uuid(); r.name = safeAccountName(); if ('last_update' in r) r.last_update = shiftDate(r.last_update); return r; });
  if (Array.isArray(synthetic.liabilitiesTransactions)) synthetic.liabilitiesTransactions = randomizeArray(synthetic.liabilitiesTransactions, 0.2).map(t => { const r = synthesize(t, { parent: 'liabilitiesTransactions' }); r.id = uuid(); r.liabilitie_id = uuid(); if ('update_date' in r) r.update_date = shiftDate(r.update_date); return r; });

  ['ownersChartData','accountsChartData','balanceChartData'].forEach(key => {
    if (Array.isArray(synthetic[key])) {
      synthetic[key] = randomizeArray(synthetic[key], 0.15).map(entry => {
        const e = { ...entry };
        if (e.update_date) e.update_date = shiftDate(e.update_date, 7);
        for (const k of Object.keys(e)) {
          if (typeof e[k] === 'number') e[k] = jitterNumber(e[k], 0.15);
        }
        return e;
      });
    }
  });

  // Final generic pass for any remaining fields
  for (const [k, v] of Object.entries(synthetic)) {
    if (['marketPurchases','marketSales','subscriptions','topSymbols','topGains','topLosses','accounts','accountTransactions','assets','assetsTransactions','liabilities','liabilitiesTransactions','ownersChartData','accountsChartData','balanceChartData'].includes(k)) continue;
    synthetic[k] = synthesize(v, { parent: k });
  }

  // Ensure account_id refs exist
  const mappedVals = Array.from(accountIdMap.values());
  if (Array.isArray(synthetic.accountTransactions)) {
    synthetic.accountTransactions.forEach(tx => { if (!tx.account_id) tx.account_id = mappedVals.length ? mappedVals[Math.floor(rand(0, mappedVals.length))] : uuid(); });
  }

  const outPath = path.join(path.dirname(inputPath), path.basename(inputPath, path.extname(inputPath)) + '-synthetic.json');
  fs.writeFileSync(outPath, JSON.stringify(synthetic, null, 2), 'utf8');
  console.log('Synthetic file written to', outPath);
})().catch(err => { console.error('Failed to generate synthetic file:', err); process.exit(1); });