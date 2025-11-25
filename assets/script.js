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

document.addEventListener('DOMContentLoaded', function(){
  fetchXpMarketEtfs();
});

function fetchXpMarketEtfs(){
  var container = document.getElementById('xp-etf-list');
  if(!container){ return; }
  fetch('https://api.xpmarket.com/api/v1/etf/top')
    .then(function(res){
      if(!res.ok){ throw new Error('network'); }
      return res.json();
    })
    .then(function(data){
      if(!Array.isArray(data)){ throw new Error('missing'); }
      var subset = data.filter(function(item){
        return item.name && /bitwise|franklin|canary|grayscale/i.test(item.name);
      });
      if(subset.length === 0){
        container.innerHTML = '<p style="margin:0;color:var(--muted)">Sem dados disponíveis.</p>';
        return;
      }
      container.innerHTML = subset.map(function(item){
        return '<article><h3>' + item.name + '</h3><p class="etf-volume">' + formatVolume(item.volume_usd || 0) + ' USD</p><p>Variação 24h: ' + formatChange(item.change_24h_pct) + '</p></article>';
      }).join('');
    })
    .catch(function(){
      container.innerHTML = '<p style="margin:0;color:var(--muted)">Não foi possível carregar os dados.</p>';
    });
}

function formatVolume(value){
  if(!isFinite(value)){ return '-'; }
  return value.toLocaleString('pt-BR', {maximumFractionDigits:0});
}

function formatChange(value){
  if(!isFinite(value)){ return '-'; }
  var formatted = (value >= 0 ? '+' : '') + value.toFixed(2).replace('.', ',') + '%';
  return formatted;
}
