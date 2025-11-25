document.getElementById('year').textContent = new Date().getFullYear();

function copyText(text){
  if(navigator.clipboard && window.isSecureContext){
    return navigator.clipboard.writeText(text);
  }
  return new Promise(function(resolve,reject){
    try{
      var ta=document.createElement('textarea');
      ta.value=text;
      ta.setAttribute('readonly','');
      ta.style.position='absolute';
      ta.style.left='-9999px';
      document.body.appendChild(ta);
      ta.select();
      var ok=document.execCommand('copy');
      document.body.removeChild(ta);
      ok?resolve():reject();
    }catch(e){reject(e);}
  });
}

document.addEventListener('click',function(e){
  var btn=e.target.closest('[data-copy]');
  if(btn){
    var value=btn.getAttribute('data-copy');
    var original=btn.textContent;
    copyText(value).then(function(){
      btn.textContent='Copiado!';
      setTimeout(function(){btn.textContent=original;},1200);
    }).catch(function(){
      btn.textContent='Falhou';
      setTimeout(function(){btn.textContent=original;},1200);
    });
  }
});
