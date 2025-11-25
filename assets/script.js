document.getElementById('year').textContent = new Date().getFullYear();
// Espaço para scripts de anúncios (AdSense/Ezoic) quando for ativar.
// Exemplo AdSense (substitua pelo seu ID e remova os comentários):
// (function(){ var s=document.createElement('script'); s.async=true; s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX'; s.crossOrigin='anonymous'; document.head.appendChild(s); })();

// Utilitário simples de copiar para a área de transferência
function copyText(text){
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback para contextos não seguros
  return new Promise(function(resolve, reject){
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    } catch(e){ reject(e); }
  });
}

document.addEventListener('click', function(e){
  var btn = e.target.closest('[data-copy]');
  if(btn){
    var value = btn.getAttribute('data-copy');
    copyText(value).then(function(){
      var original = btn.textContent;
      btn.textContent = 'Copiado!';
      setTimeout(function(){ btn.textContent = original; }, 1200);
    }).catch(function(){
      var original = btn.textContent;
      btn.textContent = 'Falhou';
      setTimeout(function(){ btn.textContent = original; }, 1200);
    });
    return;
  }
});

document.addEventListener('DOMContentLoaded', function(){
  initMarketMetrics();
  initNetworkMetrics();
});

function initMarketMetrics(){
  var priceEl = document.getElementById('metric-price-usd');
  var changeEl = document.getElementById('metric-change-24h');
  if(!priceEl || !changeEl || typeof fetch !== 'function'){ return; }

  var url = 'https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd,brl&include_24hr_change=true';

  fetch(url)
    .then(function(res){
      if(!res.ok){ throw new Error('network'); }
      return res.json();
    })
    .then(function(data){
      if(!data || !data.ripple){ return; }
      var info = data.ripple;
      var usd = info.usd;
      var brl = info.brl;
      var change = info.usd_24h_change;

      if(typeof usd === 'number'){
        var text = 'US$ ' + usd.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
        if(typeof brl === 'number'){
          text += ' (~R$ ' + brl.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2}) + ')';
        }
        priceEl.textContent = text;
      }

      if(typeof change === 'number'){
        var sign = change >= 0 ? '+' : '';
        var formatted = sign + change.toFixed(2).replace('.', ',') + '%';
        changeEl.textContent = formatted;
        changeEl.classList.remove('metric-change-positive', 'metric-change-negative');
        changeEl.classList.add(change >= 0 ? 'metric-change-positive' : 'metric-change-negative');
      }
    })
    .catch(function(){
      priceEl.title = 'Não foi possível carregar os dados de mercado agora.';
      changeEl.title = 'Não foi possível carregar os dados de mercado agora.';
    });
}

function initNetworkMetrics(){
  var txEl = document.getElementById('metric-tx-recent');
  var tpsEl = document.getElementById('metric-tps-recent');
  var ledgerEl = document.getElementById('metric-ledger-index');
  var feeEl = document.getElementById('metric-fee-base');
  var statusTextEl = document.getElementById('metric-network-text');
  var statusDotEl = document.getElementById('metric-network-dot');
  if(!txEl || !tpsEl){ return; }

  // Esconde linhas antigas que n�o queremos mais exibir
  if(ledgerEl && ledgerEl.parentElement){
    ledgerEl.parentElement.style.display = 'none';
  }
  if(feeEl && feeEl.parentElement){
    feeEl.parentElement.style.display = 'none';
  }

  function setStatus(text, state){
    if(statusTextEl){
      statusTextEl.textContent = text;
    }
    if(statusDotEl){
      statusDotEl.classList.remove('is-up','is-down');
      if(state === 'up'){ statusDotEl.classList.add('is-up'); }
      else if(state === 'down'){ statusDotEl.classList.add('is-down'); }
    }
  }

  setStatus('Rede ativa', 'up');

  if(typeof WebSocket === 'undefined'){
    setStatus('Rede nao suportada neste navegador', 'down');
    return;
  }

  var ws;
  try{
    ws = new WebSocket('wss://s1.ripple.com');
  }catch(e){
    return;
  }

  var samples = [];
  var WINDOW_SECONDS = 300; // ~5 minutos

  ws.onopen = function(){
    try{
      ws.send(JSON.stringify({
        id: 'xrpbrasil-metrics',
        command: 'subscribe',
        streams: ['ledger']
      }));
    }catch(e){}
  };

  ws.onmessage = function(event){
    var data;
    try{
      data = JSON.parse(event.data);
    }catch(e){
      return;
    }
    if(!data || data.type !== 'ledgerClosed'){ return; }

    var count = data.txn_count;
    var ledgerTime = data.ledger_time;
    var ledgerIndex = data.ledger_index;
    var feeBaseDrops = data.fee_base;
    if(typeof count !== 'number'){ return; }

    if(typeof ledgerIndex === 'number' && ledgerEl){
      try{
        ledgerEl.textContent = ledgerIndex.toLocaleString('pt-BR');
      }catch(e){
        ledgerEl.textContent = String(ledgerIndex);
      }
    }

    if(typeof feeBaseDrops === 'number' && feeEl){
      var feeXrp = feeBaseDrops / 1000000;
      var feeText;
      try{
        feeText = feeXrp.toLocaleString('pt-BR', {minimumFractionDigits:6, maximumFractionDigits:6});
      }catch(e){
        feeText = feeXrp.toFixed(6).replace('.', ',');
      }
      feeEl.textContent = feeText;
    }

    var now = typeof ledgerTime === 'number' ? ledgerTime : (Date.now() / 1000);
    samples.push({ t: now, tx: count });

    var cutoff = now - WINDOW_SECONDS;
    var filtered = [];
    for(var i = 0; i < samples.length; i++){
      if(samples[i].t >= cutoff){ filtered.push(samples[i]); }
    }
    samples = filtered;
    if(samples.length === 0){ return; }

    var totalTx = 0;
    for(var j = 0; j < samples.length; j++){
      totalTx += samples[j].tx;
    }
    var duration = samples[samples.length - 1].t - samples[0].t;
    if(duration <= 0){ return; }

    var tps = totalTx / duration;
    try{
      txEl.textContent = totalTx.toLocaleString('pt-BR');
    }catch(e){
      txEl.textContent = String(totalTx);
    }
    tpsEl.textContent = tps.toFixed(1).replace('.', ',');

    setStatus('Rede ativa', 'up');
  };

  ws.onerror = function(){
    txEl.title = 'Não foi possível carregar a atividade recente da rede.';
    tpsEl.title = 'Não foi possível carregar a atividade recente da rede.';
  };

  window.addEventListener('beforeunload', function(){
    try{
      if(ws && ws.readyState === WebSocket.OPEN){
        ws.close();
      }
    }catch(e){}
  });
}
