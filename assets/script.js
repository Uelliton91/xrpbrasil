document.getElementById('year').textContent = new Date().getFullYear();
// Espaco para scripts de anuncios (AdSense/Ezoic) quando for ativar.
// Exemplo AdSense (substitua pelo seu ID e remova os comentarios):
// (function(){ var s=document.createElement('script'); s.async=true; s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX'; s.crossOrigin='anonymous'; document.head.appendChild(s); })();

function copyText(text){
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
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

function setField(key, value){
  var el = document.querySelector('[data-etf="'+key+'"]');
  if (el) el.textContent = value;
}

function setStatus(text, isError){
  var status = document.querySelector('[data-etf-status]');
  if(!status) return;
  status.textContent = text;
  status.classList.toggle('is-error', !!isError);
}

function formatCurrency(value){
  if (!Number.isFinite(value)) return '—';
  var abs = Math.abs(value);
  var divider = 1;
  var suffix = '';
  if (abs >= 1e9){
    divider = 1e9;
    suffix = ' bi';
  } else if (abs >= 1e6){
    divider = 1e6;
    suffix = ' mi';
  } else if (abs >= 1e3){
    divider = 1e3;
    suffix = ' mil';
  }
  var scaled = value / divider;
  var decimals = 2;
  if (divider !== 1) {
    decimals = 1;
  } else if (abs >= 100) {
    decimals = 0;
  } else if (abs >= 10) {
    decimals = 1;
  }
  var formatted = scaled.toFixed(decimals).replace('.', ',');
  return 'US$ ' + formatted + suffix;
}

var xrpFormatter = new Intl.NumberFormat('pt-BR',{maximumFractionDigits:0});
function formatXrp(value){
  if (!Number.isFinite(value)) return '—';
  return xrpFormatter.format(Math.round(value)) + ' XRP';
}

function sumValues(entries, key){
  return entries.reduce(function(total, item){
    var value = Number(item && item[key]);
    return total + (Number.isFinite(value) ? value : 0);
  }, 0);
}

function computeEtfMetrics(data){
  var aggregated = data && data.volume_history && Array.isArray(data.volume_history.aggregated) ? data.volume_history.aggregated.slice() : [];
  if (!aggregated.length) return null;

  aggregated.sort(function(a,b){
    return new Date(a.date) - new Date(b.date);
  });

  var lastEntry = aggregated[aggregated.length - 1];
  var last7 = aggregated.slice(-7);
  var lastWindow = aggregated.slice(-Math.min(30, aggregated.length));

  var totals = {
    dailyTotal: Number(lastEntry.total_volume) || 0,
    dailySpot: Number(lastEntry.spot_volume) || 0,
    weeklyTotal: sumValues(last7, 'total_volume'),
    weeklySpot: sumValues(last7, 'spot_volume'),
    avgDailyTotal: sumValues(lastWindow, 'total_volume') / lastWindow.length,
    avgDailySpot: sumValues(lastWindow, 'spot_volume') / lastWindow.length
  };

  var metrics = {
    total: {
      daily: totals.dailyTotal,
      weekly: totals.weeklyTotal,
      monthly: totals.avgDailyTotal * 30,
      yearly: totals.avgDailyTotal * 365
    },
    spot: {
      daily: totals.dailySpot,
      weekly: totals.weeklySpot,
      monthly: totals.avgDailySpot * 30,
      yearly: totals.avgDailySpot * 365
    },
    xrpPrice: Number(data && data.xrp_price_usd),
    fetchedAt: data && data.fetched_at ? new Date(data.fetched_at) : null,
    lastDate: lastEntry.date
  };

  if (!Number.isFinite(metrics.xrpPrice)) {
    metrics.xrpPrice = null;
  }

  if (metrics.xrpPrice) {
    metrics.xrp = {
      daily: metrics.spot.daily / metrics.xrpPrice,
      weekly: metrics.spot.weekly / metrics.xrpPrice,
      monthly: metrics.spot.monthly / metrics.xrpPrice,
      yearly: metrics.spot.yearly / metrics.xrpPrice
    };
  }

  return metrics;
}

function renderEtfMetrics(metrics){
  setField('daily-spot', formatCurrency(metrics.spot.daily));
  setField('weekly-spot', formatCurrency(metrics.spot.weekly));
  setField('monthly-spot', formatCurrency(metrics.spot.monthly));
  setField('yearly-spot', formatCurrency(metrics.spot.yearly));

  if (metrics.xrpPrice) {
    setField('xrp-price', 'US$ ' + metrics.xrpPrice.toFixed(4).replace('.', ','));
    setField('daily-xrp', formatXrp(metrics.xrp.daily));
    setField('weekly-xrp', formatXrp(metrics.xrp.weekly));
    setField('monthly-xrp', formatXrp(metrics.xrp.monthly));
    setField('yearly-xrp', formatXrp(metrics.xrp.yearly));
  } else {
    setField('xrp-price', '—');
    setField('daily-xrp', '—');
    setField('weekly-xrp', '—');
    setField('monthly-xrp', '—');
    setField('yearly-xrp', '—');
  }

  var labelDate = metrics.fetchedAt && !isNaN(metrics.fetchedAt)
    ? metrics.fetchedAt.toLocaleString('pt-BR',{dateStyle:'short', timeStyle:'short'})
    : metrics.lastDate;
  setField('updated-at', labelDate || '—');
  setStatus('Atualizado automaticamente nas últimas 24h.', false);
}

function initEtfCard(){
  var card = document.querySelector('[data-etf-card]');
  if(!card) return;
  fetch('/data/xp-etf-feed.json', { cache: 'no-store' })
    .then(function(response){
      if(!response.ok) throw new Error('HTTP '+response.status);
      return response.json();
    })
    .then(function(payload){
      var metrics = computeEtfMetrics(payload);
      if(!metrics) throw new Error('Dados insuficientes');
      renderEtfMetrics(metrics);
    })
    .catch(function(error){
      console.error('Falha ao carregar os dados dos ETFs', error);
      setStatus('Não foi possível carregar os dados agora.', true);
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
  initEtfCard();
});
