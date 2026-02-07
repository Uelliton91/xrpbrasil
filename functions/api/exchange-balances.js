const XRPL_ENDPOINTS = [
  'https://s1.ripple.com:51234',
  'https://s2.ripple.com:51234'
];
const XRPSCAN_WELLKNOWN = 'https://api.xrpscan.com/api/v1/names/well-known';
const CACHE_SECONDS = 3600;
const MAX_SUBREQUESTS = 45;
const MAX_PER_EXCHANGE = 8;
const PRIORITY_EXCHANGES = [
  'binance', 'coinbase', 'bitstamp', 'kraken', 'bitfinex', 'bybit', 'okx',
  'kucoin', 'gate.io', 'gateio', 'crypto.com', 'bitget', 'bitbank', 'bithumb',
  'upbit', 'bitso', 'coincheck'
];
const DEFAULT_KEYWORDS = [
  'binance', 'coinbase', 'bitstamp', 'kraken', 'bitfinex', 'upbit', 'bithumb',
  'okx', 'okex', 'bybit', 'kucoin', 'gate.io', 'gateio', 'huobi', 'htx',
  'bitbank', 'bitget', 'mexc', 'crypto.com', 'poloniex', 'bitmart', 'luno',
  'coincheck', 'bitkub', 'phemex', 'whitebit', 'bitso', 'gemini', 'bittrex',
  'indodax', 'bitflyer', 'zaif', 'ndax', 'coinsbit', 'liquid'
];
const LIQUIDITY_HINTS = [
  'hot', 'deposit', 'operational', 'main', 'withdraw', 'trading'
];
const EXCLUDE_HINTS = [
  'cold', 'reserve', 'treasury', 'vault', 'escrow', 'custody', 'storage'
];

export async function onRequestGet({ request, env }) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  const cached = await cache.match(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const config = await loadConfig(request);
    const keywordSet = buildKeywordSet(config.keywords);
    const ignoreSet = new Set((config.ignore || []).map((addr) => String(addr).trim()));
    const mode = (config.mode || 'liquidity').toLowerCase();

    const xrpscanList = await fetchWellKnown();
    const grouped = groupExchangeAccounts(xrpscanList, keywordSet, ignoreSet, mode);
    applyManualAddresses(grouped, config.manual, ignoreSet);

    const exchangeEntries = Array.from(grouped.entries()).map(([key, entry]) => ({
      key,
      name: entry.name,
      addresses: Array.from(entry.addresses)
    }));
    exchangeEntries.sort((a, b) => {
      const aPriority = PRIORITY_EXCHANGES.findIndex((term) => a.key.includes(term));
      const bPriority = PRIORITY_EXCHANGES.findIndex((term) => b.key.includes(term));
      if (aPriority !== -1 || bPriority !== -1) {
        if (aPriority === -1) return 1;
        if (bPriority === -1) return -1;
        if (aPriority !== bPriority) return aPriority - bPriority;
      }
      return b.addresses.length - a.addresses.length;
    });

    const tasks = [];
    const exchangeMeta = [];
    const totalAccounts = exchangeEntries.reduce((sum, entry) => sum + entry.addresses.length, 0);
    for (const entry of exchangeEntries) {
      exchangeMeta.push({ key: entry.key, name: entry.name, addresses: entry.addresses.length });
      const limitedAddresses = entry.addresses.slice(0, MAX_PER_EXCHANGE);
      for (const address of limitedAddresses) {
        if (tasks.length >= MAX_SUBREQUESTS) break;
        tasks.push({ key: entry.key, address });
      }
      if (tasks.length >= MAX_SUBREQUESTS) break;
    }

    const truncated = tasks.length < totalAccounts;
    const limitedTasks = tasks;

    const totals = {};
    await mapLimit(limitedTasks, 8, async (task) => {
      const balance = await fetchAccountBalance(task.address);
      totals[task.key] = (totals[task.key] || 0) + balance;
    });

    const results = exchangeMeta.map((meta) => ({
      name: meta.name,
      xrp: roundXrp(totals[meta.key] || 0),
      addresses: meta.addresses
    })).sort((a, b) => b.xrp - a.xrp);

    const totalXrp = results.reduce((sum, item) => sum + item.xrp, 0);
    const history = await updateHistory(env && env.EXCHANGE_HISTORY, totalXrp);
    const payload = {
      updatedAt: new Date().toISOString(),
      totalXrp: roundXrp(totalXrp),
      exchanges: results,
      sampledAccounts: limitedTasks.length,
      totalAccounts,
      truncated,
      mode,
      history
    };

    const response = new Response(JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=0, s-maxage=${CACHE_SECONDS}`
      }
    });
    await cache.put(cacheKey, response.clone());
    return response;
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Falha ao obter saldos.', details: String(err) }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function loadConfig(request) {
  try {
    const listUrl = new URL('/data/exchanges.json', request.url);
    const listResp = await fetch(listUrl);
    if (!listResp.ok) {
      return { mode: 'liquidity', keywords: [], manual: [], ignore: [] };
    }
    const listData = await listResp.json();
    return {
      mode: typeof listData.mode === 'string' ? listData.mode : 'liquidity',
      keywords: Array.isArray(listData.keywords) ? listData.keywords : [],
      manual: Array.isArray(listData.manual) ? listData.manual : [],
      ignore: Array.isArray(listData.ignore) ? listData.ignore : []
    };
  } catch (err) {
    return { mode: 'liquidity', keywords: [], manual: [], ignore: [] };
  }
}

function buildKeywordSet(extra) {
  const set = new Set(DEFAULT_KEYWORDS.map((k) => k.toLowerCase()));
  (extra || []).forEach((k) => set.add(String(k).toLowerCase()));
  return set;
}

async function fetchWellKnown() {
  const response = await fetch(XRPSCAN_WELLKNOWN);
  if (!response.ok) {
    throw new Error('Falha ao obter lista XRPSCAN.');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

function groupExchangeAccounts(list, keywordSet, ignoreSet, mode) {
  const map = new Map();
  list.forEach((entry) => {
    if (!entry || !entry.account) {
      return;
    }
    if (ignoreSet.has(entry.account)) {
      return;
    }
    const haystack = [
      entry.name || '',
      entry.domain || '',
      entry.twitter || '',
      entry.desc || ''
    ].join(' ').toLowerCase();
    const matches = Array.from(keywordSet).some((keyword) => haystack.includes(keyword));
    if (!matches) {
      return;
    }
    if (mode === 'liquidity' && !isLiquidityAccount(entry, haystack)) {
      return;
    }
    const displayName = entry.name || entry.domain || 'Exchange';
    const key = displayName.toLowerCase();
    if (!map.has(key)) {
      map.set(key, { name: displayName, addresses: new Set() });
    }
    map.get(key).addresses.add(entry.account);
  });
  return map;
}

function isLiquidityAccount(entry, haystack) {
  const hasExclude = EXCLUDE_HINTS.some((hint) => haystack.includes(hint));
  if (hasExclude) {
    return false;
  }
  if (LIQUIDITY_HINTS.some((hint) => haystack.includes(hint))) {
    return true;
  }
  const desc = entry && entry.desc ? String(entry.desc).trim() : '';
  if (desc) {
    const number = Number(desc);
    if (Number.isFinite(number) && number > 0 && number <= 3) {
      return true;
    }
  }
  return false;
}

function applyManualAddresses(map, manual, ignoreSet) {
  (manual || []).forEach((entry) => {
    if (!entry) {
      return;
    }
    const name = entry.name || 'Exchange';
    const key = String(name).toLowerCase();
    if (!map.has(key)) {
      map.set(key, { name, addresses: new Set() });
    }
    const addresses = [];
    if (Array.isArray(entry.addresses)) {
      addresses.push(...entry.addresses);
    }
    if (entry.address) {
      addresses.push(entry.address);
    }
    addresses.forEach((addr) => {
      if (!addr || ignoreSet.has(addr)) {
        return;
      }
      map.get(key).addresses.add(addr);
    });
  });
}

async function fetchAccountBalance(account) {
  if (!account) {
    return 0;
  }
  const payload = {
    method: 'account_info',
    params: [{ account, ledger_index: 'validated' }]
  };
  const result = await fetchRpc(payload);
  const balance = result && result.account_data && result.account_data.Balance;
  if (!balance) {
    return 0;
  }
  const drops = Number(balance);
  return Number.isFinite(drops) ? drops / 1000000 : 0;
}

async function fetchRpc(body) {
  let lastError = null;
  for (const endpoint of XRPL_ENDPOINTS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }
      const payload = await response.json();
      if (payload && payload.result) {
        return payload.result;
      }
      lastError = new Error('Resposta invalida do XRPL');
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
    }
  }
  throw lastError || new Error('Falha ao conectar ao XRPL');
}

async function mapLimit(items, limit, iterator) {
  let index = 0;
  const workers = new Array(limit).fill(0).map(async () => {
    while (index < items.length) {
      const current = items[index];
      index += 1;
      try {
        await iterator(current);
      } catch (err) {
        // ignore individual errors to keep totals flowing
      }
    }
  });
  await Promise.all(workers);
}

function roundXrp(value) {
  return Math.round(value * 1000) / 1000;
}

async function updateHistory(kv, totalXrp) {
  if (!kv) {
    return null;
  }
  const now = Date.now();
  const todayKey = getBrtDateKey(now);
  const raw = await kv.get('exchange_history', 'json');
  const history = raw && Array.isArray(raw.series) ? raw : { series: [] };
  const series = history.series.slice();
  const last = series[series.length - 1];

  if (!last || last.date !== todayKey) {
    series.push({ date: todayKey, totalXrp: roundXrp(totalXrp) });
  }

  while (series.length > 60) {
    series.shift();
  }

  await kv.put('exchange_history', JSON.stringify({ series }));

  const historyPayload = {};
  const delta7 = computeDelta(series, totalXrp, 7);
  if (delta7) {
    historyPayload.baseline7Date = delta7.baselineDate;
    historyPayload.baseline7Xrp = delta7.baselineXrp;
    historyPayload.delta7Xrp = delta7.deltaXrp;
    historyPayload.delta7Pct = delta7.deltaPct;
  }
  const delta30 = computeDelta(series, totalXrp, 30);
  if (delta30) {
    historyPayload.baseline30Date = delta30.baselineDate;
    historyPayload.baseline30Xrp = delta30.baselineXrp;
    historyPayload.delta30Xrp = delta30.deltaXrp;
    historyPayload.delta30Pct = delta30.deltaPct;
  }
  return Object.keys(historyPayload).length ? historyPayload : null;
}

function getBrtDateKey(timestampMs) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return fmt.format(new Date(timestampMs));
}

function computeDelta(series, totalXrp, days) {
  const targetDate = getBrtDateKey(Date.now() - days * 24 * 60 * 60 * 1000);
  const baseline = series.find((item) => item.date === targetDate);
  if (!baseline || !baseline.totalXrp) {
    return null;
  }
  const deltaXrp = roundXrp(totalXrp - baseline.totalXrp);
  const deltaPct = baseline.totalXrp ? (deltaXrp / baseline.totalXrp) * 100 : null;
  return {
    baselineDate: baseline.date,
    baselineXrp: baseline.totalXrp,
    deltaXrp,
    deltaPct: deltaPct === null ? null : Math.round(deltaPct * 10) / 10
  };
}
