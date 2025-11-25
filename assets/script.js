document.getElementById('year').textContent = new Date().getFullYear();
// Espaco para scripts de anuncios (AdSense/Ezoic) quando for ativar.
// Exemplo AdSense (substitua pelo seu ID e remova os comentarios):
// (function(){ var s=document.createElement('script'); s.async=true; s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX'; s.crossOrigin='anonymous'; document.head.appendChild(s); })();

// Utilitario simples de copiar para a area de transferencia
function copyText(text){
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback para contextos nao seguros
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

// Inicializacoes de metricas (apenas ambiente local/dev)
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
      priceEl.textContent = '-';
      changeEl.textContent = '-';
    });
}

function initNetworkMetrics(){
  var txEl = document.getElementById('metric-tx-recent');
  var tpsEl = document.getElementById('metric-tps-recent');
  var statusTextEl = document.getElementById('metric-network-text');
  var statusDotEl = document.getElementById('metric-network-dot');
  if(!txEl || !tpsEl){ return; }

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

  setStatus('Verificando rede...', null);

  if(typeof WebSocket === 'undefined'){
    setStatus('Browser sem WebSocket', 'down');
    return;
  }

  var ws;
  try{
    ws = new WebSocket('wss://s1.ripple.com');
  }catch(e){
    setStatus('Falha ao conectar', 'down');
    return;
  }

  var samples = [];
  var WINDOW_SECONDS = 300; // ~5 minutos

  ws.onopen = function(){
    setStatus('Conectando ao node XRPL...', null);
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
    if(typeof count !== 'number'){ return; }

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
    setStatus('Erro ao ler rede', 'down');
  };

  ws.onclose = function(){
    setStatus('Conexao encerrada', 'down');
  };

  window.addEventListener('beforeunload', function(){
    try{
      if(ws && ws.readyState === WebSocket.OPEN){
        ws.close();
      }
    }catch(e){}
  });
}
