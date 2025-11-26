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

(function(){
  var priceEl=document.getElementById('xrp-price');
  if(!priceEl){return;}
  var changeEl=document.getElementById('xrp-change');
  var statusEl=document.getElementById('xrp-price-status');
  var brlEl=document.getElementById('xrp-price-brl');
  var highEl=document.getElementById('xrp-high');
  var lowEl=document.getElementById('xrp-low');
  var API_URL='https://www.bitstamp.net/api/v2/ticker/xrpusd/';
  var FX_URL='https://open.er-api.com/v6/latest/USD';
  var SOURCE_LABEL='Bitstamp';
  var FX_LABEL='ExchangeRate-API';
  var currencyFormatter=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'USD',minimumFractionDigits:2});
  var brlFormatter=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:2});
  var percentFormatter=new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  var lastFxRate=null;
  var lastPrice=null;

  function setStatus(message,isError){
    if(!statusEl){return;}
    statusEl.textContent=message;
    statusEl.classList.toggle('is-error',Boolean(isError));
  }

  function toNumber(value){
    var parsed=parseFloat(value);
    return Number.isFinite(parsed)?parsed:null;
  }

  function applyQuote(data,fxRate){
    if(!data){
      throw new Error('Resposta vazia');
    }
    var price=toNumber(data.last);
    if(price===null){
      throw new Error('Preco invalido');
    }
    lastPrice=price;
    var change=toNumber(data.percent_change_24);
    if(change===null){
      var open=toNumber(data.open);
      if(open!==null && open!==0){
        change=((price-open)/open)*100;
      }
    }

    priceEl.textContent=currencyFormatter.format(price);
    updateBrl(price,fxRate);
    changeEl.classList.remove('is-positive','is-negative');

    if(change===null){
      changeEl.textContent='--';
    }else{
      var formatted=percentFormatter.format(Math.abs(change))+'%';
      if(change>0){
        formatted='+'+formatted;
        changeEl.classList.add('is-positive');
      }else if(change<0){
        formatted='-'+formatted;
        changeEl.classList.add('is-negative');
      }
      changeEl.textContent=formatted;
    }

    updateHighLow(toNumber(data.high),toNumber(data.low));
  }

  function updateBrl(price,fxRate){
    if(!brlEl){return;}
    var rate=fxRate!=null?fxRate:lastFxRate;
    if(rate==null){
      brlEl.textContent='≈ R$ --';
      return;
    }
    lastFxRate=rate;
    brlEl.textContent='≈ '+brlFormatter.format(price*rate);
  }

  function updateHighLow(high,low){
    if(highEl){
      highEl.textContent=high==null?'--':currencyFormatter.format(high);
    }
    if(lowEl){
      lowEl.textContent=low==null?'--':currencyFormatter.format(low);
    }
  }

  function fetchTicker(){
    return fetch(API_URL,{cache:'no-store'}).then(function(res){
      if(!res.ok){throw new Error('HTTP '+res.status);}
      return res.json();
    });
  }

  function fetchFxRate(){
    return fetch(FX_URL,{cache:'no-store'}).then(function(res){
      if(!res.ok){throw new Error('HTTP '+res.status);}
      return res.json();
    }).then(function(payload){
      var rate=toNumber(payload && payload.rates && payload.rates.BRL);
      if(rate==null){throw new Error('Taxa invalida');}
      return rate;
    });
  }

  function fetchQuote(){
    setStatus('Atualizando cotacao...');
    Promise.allSettled([fetchTicker(),fetchFxRate()])
      .then(function(results){
        var tickerResult=results[0];
        if(!tickerResult || tickerResult.status!=='fulfilled'){
          throw (tickerResult && tickerResult.reason) || new Error('Ticker indisponivel');
        }
        var fxResult=results[1];
        var fxRate=null;
        if(fxResult && fxResult.status==='fulfilled'){
          fxRate=fxResult.value;
          lastFxRate=fxRate;
        }else if(fxResult && fxResult.status==='rejected'){
          console.warn('Falha ao obter USD/BRL:',fxResult.reason);
          fxRate=lastFxRate;
        }else{
          fxRate=lastFxRate;
        }
        applyQuote(tickerResult.value,fxRate);
        var labelSuffix=lastFxRate?' + '+FX_LABEL:'';
        var ts=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
        setStatus('Atualizado as '+ts+' via '+SOURCE_LABEL+labelSuffix);
      })
      .catch(function(err){
        console.error('Falha ao atualizar ticker/FX:',err);
        setStatus('Falha ao carregar agora. Fontes: '+SOURCE_LABEL+' / '+FX_LABEL,true);
      });
  }

  fetchQuote();
  setInterval(fetchQuote,60000);
})();

