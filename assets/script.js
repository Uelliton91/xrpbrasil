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
  renderStaticEtfs();
});

function renderStaticEtfs(){
  var container = document.getElementById('etf-list');
  if(!container){ return; }
  fetch('/data/etf-xrp.json')
    .then(function(res){ return res.json(); })
    .then(function(data){
      container.innerHTML = data.map(function(item){
        return '<li><strong>' + item.name + ':</strong> ' + formatVolume(item.volume_usd) + ' USD</li>';
      }).join('');
    })
    .catch(function(){
      container.innerHTML = '<li>Não foi possível carregar os dados.</li>';
    });
}

function formatVolume(value){
  if(!isFinite(value)){ return '-'; }
  return value.toLocaleString('pt-BR', {maximumFractionDigits:0});
}
