'use strict';

const fs = require('fs/promises');
const path = require('path');
const vm = require('vm');

const BASE_URL = 'https://xrpterminal.xpm.studio';
const TOKEN_PRICE_URL = 'https://api.xrpscan.com/api/v1/price/xrp';
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'xp-etf-feed.json');

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'XPMarketFetcher/1.0 (+https://github.com/xrpbrasil)'
    }
  });
  if (!response.ok) {
    throw new Error(`Falha ao buscar "${url}": ${response.status} ${response.statusText}`);
  }
  return await response.text();
}

function resolveBundlePath(html) {
  const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  if (!match) {
    throw new Error('Não foi possível encontrar o bundle principal do XRP Terminal.');
  }
  return `${BASE_URL}${match[1]}`;
}

function extractDataset(bundleSource) {
  const dataMatch = bundleSource.match(/B8=(\[[\s\S]*?\]),X8=(\{[\s\S]*?\}),V8=(\{[\s\S]*?\}),In=/);
  if (!dataMatch) {
    throw new Error('Estrutura de dados do bundle mudou: não encontrei B8/X8/V8.');
  }

  const [_, b8, x8, v8] = dataMatch;
  const sandbox = { result: null };
  vm.createContext(sandbox);
  const script = new vm.Script(`const B8=${b8};const X8=${x8};const V8=${v8};result={B8,X8,V8};`);
  script.runInContext(sandbox);
  return sandbox.result;
}

async function fetchXrpPrice() {
  try {
    const res = await fetch(TOKEN_PRICE_URL, {
      headers: { 'user-agent': 'XPMarketFetcher/1.0 (+https://github.com/xrpbrasil)' }
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    const price = Number(json['XRP/USD']);
    return Number.isFinite(price) ? price : null;
  } catch (error) {
    console.warn('Aviso: não consegui obter o preço do XRP via XRPSCAN:', error.message);
    return null;
  }
}

async function main() {
  console.log('Baixando HTML do XRP Terminal...');
  const html = await fetchText(BASE_URL);
  const bundleUrl = resolveBundlePath(html);
  console.log('Bundle localizado:', bundleUrl);

  console.log('Baixando bundle...');
  const bundleSource = await fetchText(bundleUrl);
  const payload = extractDataset(bundleSource);

  const xrpPriceUsd = await fetchXrpPrice();

  const output = {
    fetched_at: new Date().toISOString(),
    source: 'XPMarket ETF Terminal',
    xrp_price_usd: xrpPriceUsd,
    etfs: payload.B8,
    volume_history: payload.X8,
    comparison_history: payload.V8
  };

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`Arquivo salvo em ${OUTPUT_FILE}`);
}

main().catch(error => {
  console.error('Erro crítico ao atualizar o feed dos ETFs:', error);
  process.exitCode = 1;
});
