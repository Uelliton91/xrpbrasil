(function(){
  var yearEl=document.getElementById('year');
  if(yearEl){yearEl.textContent=new Date().getFullYear();}

  function copyText(text){
    if(navigator.clipboard&&window.isSecureContext){
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
      return;
    }
    var trigger=e.target.closest('[data-search-trigger]');
    if(trigger){
      e.preventDefault();
      openSearch();
    }
  });

  document.addEventListener('DOMContentLoaded',function(){
    fixEncodingArtifacts();
    ensureMetricsLink();
    ensureActivityLink();
    enhanceHeader();
    setupSearch();
    loadSearchIndex();
    initConsent();
    buildBreadcrumbs();
    injectSharePrompt();
    initHomeDexCard();
    initInsightShare();
    initActivityTracker();
    initExchangeTracker();
  });

  function ensureMetricsLink(){
    var nav=document.querySelector('.site-header .nav');
    if(!nav){return;}
    var target='/metricas/';
    if(nav.querySelector('a[href="'+target+'"]')){return;}
    var link=document.createElement('a');
    link.href=target;
    link.textContent='Métricas';
    var tools=nav.querySelector('a[href="/ferramentas/index.html"]');
    if(tools){
      if(tools.nextSibling){
        nav.insertBefore(link,tools.nextSibling);
      }else{
        nav.appendChild(link);
      }
    }else{
      nav.appendChild(link);
    }
  }

  function ensureActivityLink(){
    var nav=document.querySelector('.site-header .nav');
    if(!nav){return;}
    var target='/pages/rastreador-xrpl.html';
    if(nav.querySelector('a[href=\"'+target+'\"]')){return;}
    var link=document.createElement('a');
    link.href=target;
    link.textContent='Rastreador';
    var metrics=nav.querySelector('a[href=\"/metricas/\"]');
    if(metrics){
      if(metrics.nextSibling){
        nav.insertBefore(link,metrics.nextSibling);
      }else{
        nav.appendChild(link);
      }
    }else{
      nav.appendChild(link);
    }
  }

  function fixEncodingArtifacts(){
    if(!document.body){return;}
    var map={
      '\xC3\xA1':'\xE1','\xC3\xA0':'\xE0','\xC3\xA3':'\xE3','\xC3\xA2':'\xE2','\xC3\xA4':'\xE4',
      '\xC3\xA9':'\xE9','\xC3\xA8':'\xE8','\xC3\xAA':'\xEA','\xC3\xAB':'\xEB',
      '\xC3\xAD':'\xED','\xC3\xAC':'\xEC','\xC3\xAE':'\xEE','\xC3\xAF':'\xEF',
      '\xC3\xB3':'\xF3','\xC3\xB2':'\xF2','\xC3\xB4':'\xF4','\xC3\xB5':'\xF5','\xC3\xB6':'\xF6',
      '\xC3\xBA':'\xFA','\xC3\xB9':'\xF9','\xC3\xBB':'\xFB','\xC3\xBC':'\xFC',
      '\xC3\xA7':'\xE7','\u00C3\u2021':'\xC7',
      '\u00C3\u201C':'\u00D3','\u00C3\u201D':'\u00D4','\u00C3\u2022':'\u00D5','\u00C3\u2030':'\u00C9','\u00C3\u0160':'\u00CA','\u00C3\u0161':'\u00DA','\u00C3\u0153':'\u00DC',
      '\u00C3\u0081':'\u00C1','\u00C3\u0093':'\u00D3','\u00C3\u0094':'\u00D4','\u00C3\u0095':'\u00D5','\u00C3\u009A':'\u00DA','\u00C3\u009C':'\u00DC','\u00C3\u008D':'\u00CD',
      '\u00C3\u20AC':'\u00C0','\u00C3\u0080':'\u00C0','\u00C3\u201A':'\u00C2','\u00C3\u0082':'\u00C2','\u00C3\u0192':'\u00C3','\u00C3\u0083':'\u00C3',
      '\u00C3\u0089':'\u00C9','\u00C3\u008A':'\u00CA','\u00C3\u0087':'\xC7',
      '\xC2\xA9':'\xA9','\xC2\xAE':'\xAE','\xC2\xBA':'\xBA','\xC2\xAA':'\xAA','\xC2\xB7':'\xB7','\xC2\xA0':' ',
      '\xE2\x80\x93':'\u2013','\xE2\x80\x94':'\u2014','\xE2\x80\x98':'\u2018','\xE2\x80\x99':'\u2019','\xE2\x80\x9C':'\u201C','\xE2\x80\x9D':'\u201D','\xE2\x80\xA2':'\u2022','\xE2\x80\xA6':'\u2026'
    };
    var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    var node;
    while((node=walker.nextNode())){
      var parent=node.parentNode;
      if(parent){
        var tag=parent.tagName;
        if(tag==='SCRIPT'||tag==='STYLE'){continue;}
      }
      var value=node.nodeValue;
      var updated=value;
      for(var bad in map){
        if(Object.prototype.hasOwnProperty.call(map,bad) && updated.indexOf(bad)>-1){
          updated=updated.split(bad).join(map[bad]);
        }
      }
      if(updated!==value){
        node.nodeValue=updated;
      }
    }
  }

  function enhanceHeader(){
    var header=document.querySelector('.site-header');
    if(!header){return;}
    var nav=header.querySelector('.nav');
    if(!nav){return;}
    if(!nav.id){nav.id='primary-navigation';}

    var toggle=document.createElement('button');
    toggle.type='button';
    toggle.className='nav-toggle';
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-controls',nav.id);
    toggle.innerHTML='<span>Menu</span>';
    header.insertBefore(toggle,nav);
    toggle.addEventListener('click',function(){
      var isOpen=nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded',isOpen);
    });
    nav.addEventListener('click',function(evt){
      if(evt.target.tagName==='A' && nav.classList.contains('is-open')){
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded','false');
      }
    });

    var actions=document.createElement('div');
    actions.className='header-actions';
    header.appendChild(actions);

    var searchBtn=document.createElement('button');
    searchBtn.type='button';
    searchBtn.className='search-trigger';
    searchBtn.setAttribute('data-search-trigger','');
    searchBtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><span>Buscar</span>';
    actions.appendChild(searchBtn);
    searchBtn.addEventListener('click',function(){openSearch();});
  }

  var searchOverlay;var searchInput;var searchResults;var searchIndex=[];var searchLoaded=false;var searchLoadPromise=null;var closeBtn;var searchHint;
  var consentKey='xrp_terms_v1';
  var consentOverlayEl=null;

  function setupSearch(){
    document.addEventListener('keydown',function(e){
      if(e.key==='/' && !isTyping(e.target)){
        e.preventDefault();
        openSearch();
      }
      if(e.key==='Escape' && searchOverlay && searchOverlay.classList.contains('is-open')){
        closeSearch();
      }
    });
  }

  function loadSearchIndex(){
    if(searchLoaded){return Promise.resolve(searchIndex);}
    if(searchLoadPromise){return searchLoadPromise;}
    searchLoadPromise=fetch('/data/search-index.json').then(function(resp){
      if(!resp.ok){throw new Error('Falha ao carregar indice');}
      return resp.json();
    }).then(function(data){
      searchIndex=Array.isArray(data)?data:[];
      searchLoaded=true;
      renderSearchResults();
      return searchIndex;
    }).catch(function(err){
      console.warn('Busca interna',err);
      if(searchResults){
        searchResults.innerHTML='<p class=\"search-empty\">Nao foi possivel carregar o indice agora.</p>';
      }
      return [];
    });
    return searchLoadPromise;
  }

  function ensureSearchOverlay(){
    if(searchOverlay){return;}
    searchOverlay=document.createElement('div');
    searchOverlay.className='search-overlay';
    searchOverlay.setAttribute('role','dialog');
    searchOverlay.setAttribute('aria-modal','true');
    searchOverlay.setAttribute('aria-label','Buscar no site');
    searchOverlay.innerHTML='\
      <div class="search-panel" role="document">\
        <header>\
          <strong>Buscar no site</strong>\
          <button type="button" class="search-close" data-close-search>Fechar</button>\
        </header>\
        <form role="search">\
          <label for="site-search-input" class="visually-hidden">Buscar por conteudo</label>\
          <div class="search-input-wrap">\
            <input id="site-search-input" class="search-input" type="search" placeholder="Digite um termo (ex: AMM, carteiras, ISO 20022)" autocomplete="off" />\
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>\
          </div>\
          <p class="search-hint">Pressione Enter para abrir o primeiro resultado ou Esc para fechar.</p>\
        </form>\
        <div class="search-results" data-results>\
          <p class="search-empty">Digite um termo para buscar em artigos, guias e ferramentas.</p>\
        </div>\
      </div>';
    document.body.appendChild(searchOverlay);
    searchInput=searchOverlay.querySelector('#site-search-input');
    searchResults=searchOverlay.querySelector('[data-results]');
    closeBtn=searchOverlay.querySelector('[data-close-search]');
    searchOverlay.addEventListener('click',function(e){
      if(e.target===searchOverlay){closeSearch();}
    });
    closeBtn.addEventListener('click',function(){closeSearch();});
    searchInput.addEventListener('input',renderSearchResults);
    searchOverlay.querySelector('form').addEventListener('submit',function(e){
      e.preventDefault();
      var first=searchResults.querySelector('a');
      if(first){window.location.href=first.href;}
    });
  }

  function initActivityTracker(){
    var root=document.querySelector('[data-activity-tracker]');
    if(!root){return;}
    var els={
      status:root.querySelector('[data-activity-status]'),
      statusSub:root.querySelector('[data-activity-status-sub]'),
      index:root.querySelector('[data-activity-index]'),
      indexBar:root.querySelector('[data-activity-index-bar]'),
      gaugeFill:root.querySelector('[data-activity-gauge-fill]'),
      gaugeNeedle:root.querySelector('[data-activity-gauge-needle]'),
      delta:root.querySelector('[data-activity-delta]'),
      interpretation:root.querySelector('[data-activity-interpretation]'),
      dex:root.querySelector('[data-activity-dex]'),
      vol7d:root.querySelector('[data-activity-7d]'),
      vol7dDelta:root.querySelector('[data-activity-7d-delta]'),
      vol30d:root.querySelector('[data-activity-30d]'),
      trend:root.querySelector('[data-activity-trend]'),
      updated:root.querySelector('[data-activity-updated]'),
      avg30:root.querySelector('[data-activity-avg30]'),
      chart:root.querySelector('[data-activity-chart]'),
      insight:root.querySelector('[data-activity-insight]'),
      delta24:root.querySelector('[data-activity-delta-24]'),
      delta7:root.querySelector('[data-activity-delta-7]'),
      delta30:root.querySelector('[data-activity-delta-30]'),
      badge:root.querySelector('[data-status-badge]')
    };

    function formatNumber(value){
      if(value===null||value===undefined||Number.isNaN(value)){return '--';}
      return value.toLocaleString('pt-BR');
    }

    function formatCurrency(value){
      if(value===null||value===undefined||Number.isNaN(value)){return '--';}
      return value.toLocaleString('pt-BR',{style:'currency',currency:'USD',maximumFractionDigits:0});
    }

    function formatCompactCurrency(value){
      if(value===null||value===undefined||Number.isNaN(value)){return '--';}
      return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:1}).format(value);
    }

    function formatXrp(value){
      if(value===null||value===undefined||Number.isNaN(value)){return '--';}
      return 'XRP '+new Intl.NumberFormat('pt-BR',{notation:'compact',maximumFractionDigits:2}).format(value);
    }

    function clamp(num,min,max){return Math.max(min,Math.min(max,num));}

    function average(list){
      if(!list.length){return 0;}
      var sum=0;
      list.forEach(function(item){sum+=item;});
      return sum/list.length;
    }

    function buildStatus(ratio){
      if(ratio>1.15){return {label:'Rede em alta',tone:'var(--brand-green)'};}
      if(ratio<0.85){return {label:'Rede em baixa',tone:'#ff6b6b'};}
      return {label:'Rede estavel',tone:'var(--primary)'};}

    function setText(node,text){
      if(node){node.textContent=text;}
    }

    function fetchJson(url){
      return fetch(url).then(function(resp){
        if(!resp.ok){throw new Error('Falha ao carregar '+url);}
        return resp.json();
      });
    }

    function computeTrend(values){
      if(values.length<14){return 'Sem dados suficientes';}
      var last7=values.slice(-7);
      var prev7=values.slice(-14,-7);
      var avgLast=average(last7);
      var avgPrev=average(prev7);
      if(avgPrev===0){return 'Estavel';}
      var ratio=avgLast/avgPrev;
      if(ratio>1.05){return 'Subindo';}
      if(ratio<0.95){return 'Caindo';}
      return 'Estavel';
    }

    function computeDelta(current,avg){
      if(avg===0){return null;}
      return ((current-avg)/avg)*100;
    }

    var lastSnapshot=null;

    function updateUI(dex){
      if(!dex || !dex.series.length){return;}
      lastSnapshot=dex;
      var series=dex.series;
      var last=series[series.length-1];
      var last30=series.slice(-30);
      var last7=series.slice(-7);
      var prev7=series.slice(-14,-7);
      var prev30=series.slice(-60,-30);
      var avg30=average(last30.map(function(p){return p.value;}));
      var avg7=average(last7.map(function(p){return p.value;}));
      var ratio=avg30?last.value/avg30:1;
      var status=buildStatus(ratio);
      var score=clamp(Math.round((clamp(ratio,0,2)/2)*100),0,100);
      var ratioLabel=ratio.toFixed(2).replace('.',',')+'x';
      var deltaPct=Math.round((ratio-1)*100);
      var sentimentText='Estavel';
      if(ratio>3){sentimentText='🔥 Alta Extraordinaria';}
      else if(ratio>1.2){sentimentText='📈 Em Crescimento';}
      else if(ratio<1){sentimentText='⚠️ Em Retracao';}

      setText(els.status,sentimentText);
      if(els.badge){
        els.badge.textContent='Online';
        els.badge.classList.remove('offline');
      }
      var statusColor='var(--primary)';
      if(ratio>1.2){statusColor='var(--brand-green)';}
      if(ratio<1){statusColor='#ff6b6b';}
      if(els.status){els.status.style.color=statusColor;}
      if(els.status){els.status.style.color=status.tone;}
      setText(els.statusSub,'Comparado a media de 30 dias');
      setText(els.index,ratioLabel);
      if(els.delta){els.delta.textContent='('+(deltaPct>=0?'+':'')+deltaPct+'%)';}
      if(els.interpretation){
        els.interpretation.textContent='Hoje negociou o equivalente a '+ratioLabel+' dias de volume medio.';
      }
      if(els.indexBar){els.indexBar.style.setProperty('--marker',score);}
      if(els.gaugeFill){
        var dash=252;
        var offset=dash-(dash*(score/100));
        els.gaugeFill.style.strokeDashoffset=offset;
        if(ratio>1.2){els.gaugeFill.style.stroke='var(--brand-green)';}
        else if(ratio<1){els.gaugeFill.style.stroke='#ff6b6b';}
        else{els.gaugeFill.style.stroke='var(--primary)';}
      }
      if(els.gaugeNeedle){
        var angle=-90 + (score*1.8);
        els.gaugeNeedle.style.transform='rotate('+angle+'deg)';
      }

      setText(els.dex,formatCurrency(last.value));
      setText(els.vol7d,formatCurrency(last7.reduce(function(a,b){return a+b.value;},0)));
      setText(els.vol30d,formatCurrency(last30.reduce(function(a,b){return a+b.value;},0)));
      setText(els.avg30,formatCurrency(avg30));
      var vol7Delta=computeDelta(avg7,avg30);
      setText(els.vol7dDelta,vol7Delta===null?'Sem comparacao':'%s vs media 30d'.replace('%s',vol7Delta.toFixed(1)+'%'));
      var trend=computeTrend(series.map(function(p){return p.value;}));
      setText(els.trend,trend);
      if(els.trend){
        els.trend.classList.remove('trend-up','trend-down','trend-flat');
        if(trend==='Subindo'){els.trend.classList.add('trend-up');}
        else if(trend==='Caindo'){els.trend.classList.add('trend-down');}
        else{els.trend.classList.add('trend-flat');}
        var arrow=trend==='Subindo'?' ↑':(trend==='Caindo'?' ↓':' →');
        els.trend.textContent=trend+arrow;
      }
      setText(els.updated,new Date().toLocaleString('pt-BR'));

      var sum7=last7.reduce(function(a,b){return a+b.value;},0);
      var sumPrev7=prev7.reduce(function(a,b){return a+b.value;},0);
      var sum30=last30.reduce(function(a,b){return a+b.value;},0);
      var sumPrev30=prev30.reduce(function(a,b){return a+b.value;},0);

      if(els.delta24){
        var delta24=Math.round((ratio-1)*100);
        els.delta24.textContent=(delta24>=0?'▲ ':'▼ ')+Math.abs(delta24)+'% vs media 30d';
        els.delta24.classList.toggle('up',delta24>=0);
        els.delta24.classList.toggle('down',delta24<0);
      }
      if(els.delta7){
        var delta7=sumPrev7?Math.round(((sum7/sumPrev7)-1)*100):0;
        els.delta7.textContent=sumPrev7?((delta7>=0?'▲ ':'▼ ')+Math.abs(delta7)+'% vs 7d anterior'):'--';
        els.delta7.classList.toggle('up',delta7>=0);
        els.delta7.classList.toggle('down',delta7<0);
      }
      if(els.delta30){
        var delta30=sumPrev30?Math.round(((sum30/sumPrev30)-1)*100):0;
        els.delta30.textContent=sumPrev30?((delta30>=0?'▲ ':'▼ ')+Math.abs(delta30)+'% vs 30d anterior'):'--';
        els.delta30.classList.toggle('up',delta30>=0);
        els.delta30.classList.toggle('down',delta30<0);
      }


      if(els.chart){
        renderDexChart(last30,chartRange);
        bindChartControls(last30);
      }

      if(els.insight){
        var tone='estavel';
        if(ratio>3){tone='muito_alto';}
        else if(ratio>1.2){tone='alto';}
        else if(ratio<1){tone='baixo';}

        var daysAbove=last30.filter(function(p){return p.value>=last.value;}).length;
        var topPct=Math.max(1,Math.round((daysAbove/last30.length)*100));
        var vol7Sum=last7.reduce(function(a,b){return a+b.value;},0);
        var vol30Sum=last30.reduce(function(a,b){return a+b.value;},0);
        var share7=vol30Sum?Math.round((vol7Sum/vol30Sum)*100):0;
        var avg7DeltaPct=Math.round((avg7/avg30-1)*100);

        var templatesByTone={
          muito_alto:[
            'Explosao de volume: 24h em {ratio} da media mensal — top {topPct}% do periodo. Semana soma {vol7} ({share7}% do 30d), com tendencia {trend}.',
            'Alta extraordinaria: {ratio} da media mensal em 24h. Dia entre os {topPct}% mais fortes. Nos ultimos 7 dias, {vol7} ({share7}% do mes), mantendo {trend}.',
            'Pico relevante: 24h bate {ratio} da media. Ranking diario: top {topPct}%. Semana acumula {vol7} ({share7}% do volume 30d), indicando {trend}.',
            'Movimento acima da curva: {ratio} da media de 30d em 24h. Top {topPct}% do periodo. Semana em {vol7} ({share7}% do 30d), ritmo {trend}.',
            'Sinal forte no DEX: {ratio} da media mensal em 24h e top {topPct}%. Nos ultimos 7 dias, {vol7} ({share7}% do mes), com tendencia {trend}.',
            'Dia muito forte: {ratio} da media mensal. Top {topPct}% dos ultimos 30 dias. Semana soma {vol7} ({share7}% do mes), mantendo {trend}.',
            'Resumo analitico: 24h em {ratio} da media de 30d (top {topPct}%). Semana totaliza {vol7} ({share7}% do mes), indicando {trend}.'
          ],
          alto:[
            'Atividade elevada: 24h em {ratio} da media mensal — top {topPct}% do periodo. Semana soma {vol7} ({share7}% do 30d), com tendencia {trend}.',
            'Volume acima da media: {ratio} em 24h. Dia entre os {topPct}% mais fortes. Nos ultimos 7 dias, {vol7} ({share7}% do mes), ritmo {trend}.',
            'Sinal de aquecimento: 24h em {ratio} da media mensal. Top {topPct}% do periodo. Semana acumula {vol7} ({share7}% do 30d), indicando {trend}.',
            'Dia acima da curva: {ratio} da media mensal. Top {topPct}%. Semana soma {vol7} ({share7}% do volume 30d), tendencia {trend}.',
            'Panorama: 24h em {ratio} da media mensal e desempenho top {topPct}%. Semana em {vol7} ({share7}% do mes), mantendo {trend}.',
            'Resumo: {ratio} da media mensal em 24h (top {topPct}%). Nos ultimos 7 dias, {vol7} ({share7}% do mes), com tendencia {trend}.',
            'Volume firme: 24h em {ratio} da media. Top {topPct}% do periodo. Semana totaliza {vol7} ({share7}% do 30d), ritmo {trend}.'
          ],
          estavel:[
            'Atividade dentro do normal: 24h em {ratio} da media mensal. Semana soma {vol7} ({share7}% do 30d), com tendencia {trend}.',
            'Leitura estavel: 24h em {ratio} da media. Semana acumula {vol7} ({share7}% do volume 30d), ritmo {trend}.',
            'Sem grandes desvios: 24h em {ratio} da media mensal. Nos ultimos 7 dias, {vol7} ({share7}% do mes), tendencia {trend}.',
            'Panorama neutro: {ratio} da media em 24h. Semana totaliza {vol7} ({share7}% do 30d), mantendo {trend}.',
            'Dia dentro da media: 24h em {ratio}. Semana soma {vol7} ({share7}% do 30d), ritmo {trend}.',
            'Resumo: 24h em {ratio} da media mensal. Semana em {vol7} ({share7}% do mes), com tendencia {trend}.',
            'Atividade estavel: {ratio} da media mensal em 24h. Semana acumula {vol7} ({share7}% do 30d), ritmo {trend}.'
          ],
          baixo:[
            'Atividade abaixo do normal: 24h em {ratio} da media mensal. Semana soma {vol7} ({share7}% do 30d), com tendencia {trend}.',
            'Volume recuado: 24h em {ratio} da media. Semana acumula {vol7} ({share7}% do mes), ritmo {trend}.',
            'Sinal de enfraquecimento: 24h em {ratio} da media mensal. Semana soma {vol7} ({share7}% do 30d), tendencia {trend}.',
            'Dia fraco: 24h em {ratio} da media. Semana totaliza {vol7} ({share7}% do mes), ritmo {trend}.',
            'Panorama de baixa: 24h em {ratio} da media mensal. Nos ultimos 7 dias, {vol7} ({share7}% do 30d), com tendencia {trend}.',
            'Resumo: 24h em {ratio} da media (abaixo do normal). Semana soma {vol7} ({share7}% do mes), indicando {trend}.',
            'Atividade retraida: 24h em {ratio} da media mensal. Semana em {vol7} ({share7}% do 30d), ritmo {trend}.'
          ]
        };

        var now=new Date();
        var seed=now.getFullYear()*10000+(now.getMonth()+1)*100+now.getDate();
        var bucket=templatesByTone[tone]||templatesByTone.estavel;
        var index=seed%bucket.length;
        var template=bucket[index];
        var text=template
          .replace('{ratio}',ratioLabel)
          .replace('{topPct}',topPct)
          .replace('{vol7}',formatCurrency(vol7Sum))
          .replace('{share7}',share7)
          .replace('{trend}',trend.toLowerCase());
        els.insight.textContent=text;
      }
    }

    var chartRange=7;

    function renderDexChart(series,rangeDays){
      if(!series.length){return;}
      if(typeof window.Chart!=='function'){return;}
      var range=rangeDays||30;
      var slice=series.slice(-range);
      var labels=slice.map(function(p){return new Date(p.ts*1000);});
      var data=slice.map(function(p){return p.value;});
      var ma7=data.map(function(_,i){
        var start=Math.max(0,i-6);
        var slice=data.slice(start,i+1);
        var sum=slice.reduce(function(a,b){return a+b;},0);
        return sum/slice.length;
      });
      var ma1=data.slice();
      var ma30=null;
      if(range>=30){
        ma30=data.map(function(_,i){
          var start=Math.max(0,i-29);
          var slice=data.slice(start,i+1);
          var sum=slice.reduce(function(a,b){return a+b;},0);
          return sum/slice.length;
        });
      }

      var canvas=els.chart.querySelector('canvas');
      if(!canvas){
        els.chart.innerHTML='<canvas></canvas>';
        canvas=els.chart.querySelector('canvas');
      }
      if(els.chart._chart){
        els.chart._chart.destroy();
      }

      var maxVal=Math.max.apply(null,data);
      var step=5000000;
      var yMax=Math.max(step,Math.ceil(maxVal/step)*step);

      els.chart._chart=new window.Chart(canvas.getContext('2d'),{
        type:'line',
        data:{
          labels:labels,
          datasets:[
            {
              label:'Volume diario ('+range+'d)',
              data:data,
              borderColor:'#00e6ff',
              backgroundColor:'rgba(0,230,255,0.12)',
              fill:true,
              tension:0.25,
              pointRadius:0
            },
            {
              label:'Media movel 7d',
              data:ma7,
              borderColor:'#2de56e',
              backgroundColor:'rgba(45,229,110,0.15)',
              fill:false,
              tension:0.25,
              pointRadius:0
            }
          ]
        },
        options:{
          responsive:true,
          maintainAspectRatio:false,
          interaction:{mode:'index',intersect:false},
          plugins:{
            legend:{labels:{color:'#c4d0dd'}},
            tooltip:{callbacks:{label:function(ctx){
              return ctx.dataset.label+': '+formatCurrency(ctx.parsed.y);
            }}}
          },
          scales:{
            x:{
              type:'time',
              time:{unit:'day',displayFormats:{day:'dd/MM'}},
              ticks:{color:'#c4d0dd',maxTicksLimit:6},
              grid:{color:'rgba(255,255,255,0.08)'}
            },
            y:{
              suggestedMax:yMax,
              ticks:{
                color:'#c4d0dd',
                stepSize:step,
                callback:function(value){
                  if(value===0){return 'US$ 0';}
                  return 'US$ '+(value/1000000).toFixed(0)+'M';
                }
              },
              grid:{color:'rgba(255,255,255,0.08)'}
            }
          }
        }
      });
      if(ma30){
        els.chart._chart.data.datasets.push({
          label:'Media movel 30d',
          data:ma30,
          borderColor:'rgba(255,255,255,0.5)',
          borderWidth:2,
          borderDash:[6,6],
          pointRadius:0,
          fill:false
        });
      }
      els.chart._chart.update();
    }

    function bindChartControls(series){
      var controls=document.querySelectorAll('[data-chart-range]');
      controls.forEach(function(btn){
        btn.onclick=function(){
          controls.forEach(function(b){b.classList.remove('is-active');});
          btn.classList.add('is-active');
          chartRange=Number(btn.getAttribute('data-chart-range'))||30;
          renderDexChart(series,chartRange);
        };
      });
    }

    function loadAll(){
      var dexUrl='https://api.llama.fi/overview/dexs/xrpl';
      return fetchJson(dexUrl).then(function(dexData){
        var dex={series:[],top:[],lastDate:null};
        if(dexData && Array.isArray(dexData.totalDataChart)){
          dex.series=dexData.totalDataChart.map(function(point){
            if(!Array.isArray(point)){return {ts:null,value:0};}
            return {ts:point[0],value:Number(point[1]||0)};
          });
          var lastPoint=dexData.totalDataChart[dexData.totalDataChart.length-1];
          if(Array.isArray(lastPoint) && lastPoint.length){
            var date=new Date(lastPoint[0]*1000);
            dex.lastDate=date.toLocaleDateString('pt-BR');
          }
        }
        updateUI(dex);
      }).catch(function(err){
        console.warn('Rastreador XRPL',err);
        setText(els.status,'Indisponivel');
        if(els.badge){
          els.badge.textContent='Offline';
          els.badge.classList.add('offline');
        }
        if(lastSnapshot){
          updateUI(lastSnapshot);
          setText(els.updated,'Ultima atualizacao valida: '+new Date().toLocaleString('pt-BR'));
        }
      });
    }

    loadAll();
    setInterval(loadAll,60000);
  }

  function initExchangeTracker(){
    var root=document.querySelector('[data-exchange-tracker]');
    if(!root){return;}
    var statusEl=root.querySelector('[data-exchange-status]');
    var totalEl=root.querySelector('[data-exchange-total]');
    var delta7El=root.querySelector('[data-exchange-delta-7]');
    var delta30El=root.querySelector('[data-exchange-delta-30]');
    var listEl=root.querySelector('[data-exchange-list]');
    var updatedEl=root.querySelector('[data-exchange-updated]');
    var shareBtn=root.querySelector('[data-exchange-share]');

    function formatXrp(value){
      if(value===null||value===undefined||Number.isNaN(value)){return '--';}
      return 'XRP '+new Intl.NumberFormat('pt-BR',{notation:'compact',maximumFractionDigits:2}).format(value);
    }

    function renderList(items){
      if(!listEl){return;}
      if(!items || !items.length){
        listEl.innerHTML='<span class="muted">Sem dados no momento.</span>';
        return;
      }
      var fixed=['binance','coinbase','bitstamp','kraken'];
      var selected=[];
      var used=new Set();
      fixed.forEach(function(name){
        var match=items.find(function(item){
          return item.name && item.name.toLowerCase().indexOf(name)>-1;
        });
        if(match && !used.has(match.name)){
          selected.push(match);
          used.add(match.name);
        }
      });
      items.forEach(function(item){
        if(selected.length>=4){return;}
        if(!used.has(item.name)){
          selected.push(item);
          used.add(item.name);
        }
      });
      var html=selected.slice(0,4).map(function(item){
        return '<article class="activity-kpi activity-kpi--compact">'+
          '<p class="label">'+item.name+'</p>'+
          '<h2>'+formatXrp(item.xrp)+'</h2>'+
          '<p class="muted">'+item.addresses+' carteiras</p>'+
        '</article>';
      }).join('');
      listEl.innerHTML=html;
    }

    var lastSnapshot=null;

    function updateUI(data){
      if(!data){return;}
      lastSnapshot=data;
      if(statusEl){
        statusEl.textContent='Online';
        statusEl.classList.remove('offline');
      }
      if(totalEl){totalEl.textContent=formatXrp(data.totalXrp||0);}
      if(delta7El){
        if(data.history && typeof data.history.delta7Pct === 'number' && typeof data.history.delta7Xrp === 'number'){
          var sign7=data.history.delta7Pct>=0?'+':'';
          delta7El.textContent='Variação 7d: '+sign7+data.history.delta7Pct.toFixed(1)+'% ('+formatXrp(data.history.delta7Xrp)+')';
          delta7El.classList.toggle('exchange-delta-up',data.history.delta7Pct>=0);
          delta7El.classList.toggle('exchange-delta-down',data.history.delta7Pct<0);
        }else{
          delta7El.textContent='Variação 7d: em construção (aguarde histórico).';
          delta7El.classList.remove('exchange-delta-up','exchange-delta-down');
        }
      }
      if(delta30El){
        if(data.history && typeof data.history.delta30Pct === 'number' && typeof data.history.delta30Xrp === 'number'){
          var sign30=data.history.delta30Pct>=0?'+':'';
          delta30El.textContent='Variação 30d: '+sign30+data.history.delta30Pct.toFixed(1)+'% ('+formatXrp(data.history.delta30Xrp)+')';
          delta30El.classList.toggle('exchange-delta-up',data.history.delta30Pct>=0);
          delta30El.classList.toggle('exchange-delta-down',data.history.delta30Pct<0);
        }else{
          delta30El.textContent='Variação 30d: em construção (aguarde histórico).';
          delta30El.classList.remove('exchange-delta-up','exchange-delta-down');
        }
      }
      renderList(data.exchanges||[]);
      if(updatedEl){
        updatedEl.textContent='Atualizado em '+new Date().toLocaleString('pt-BR');
      }
    }

    function load(){
      var isLocal=location.hostname==='localhost'||location.hostname==='127.0.0.1';
      var primary='/api/exchange-balances?v=4';
      var fallback='/data/exchange-balances-sample.json';
      var fetchJsonLocal=function(url){
        return fetch(url).then(function(resp){
          if(!resp.ok){throw new Error('Falha ao carregar '+url);}
          return resp.json();
        });
      };

      fetchJsonLocal(primary).then(function(data){
        updateUI(data);
      }).catch(function(err){
        if(isLocal){
          fetchJsonLocal(fallback).then(function(data){
            updateUI(data);
          }).catch(function(fallbackErr){
            console.warn('Exchange tracker',fallbackErr);
            if(statusEl){
              statusEl.textContent='Offline';
              statusEl.classList.add('offline');
            }
          });
          return;
        }
        console.warn('Exchange tracker',err);
        if(statusEl){
          statusEl.textContent='Offline';
          statusEl.classList.add('offline');
        }
      });
    }

    load();
    setInterval(load,3600000);

    if(shareBtn){
      shareBtn.addEventListener('click',function(){
        if(!lastSnapshot || typeof lastSnapshot.totalXrp!=='number'){return;}
        var base='Saldo em corretoras (hot): XRP '+new Intl.NumberFormat('pt-BR',{notation:'compact',maximumFractionDigits:2}).format(lastSnapshot.totalXrp);
        var parts=[base];
        if(lastSnapshot.history && typeof lastSnapshot.history.delta7Pct === 'number'){
          var sign7=lastSnapshot.history.delta7Pct>=0?'+':'';
          parts.push('Variação 7d: '+sign7+lastSnapshot.history.delta7Pct.toFixed(1)+'%');
        }
        if(lastSnapshot.history && typeof lastSnapshot.history.delta30Pct === 'number'){
          var sign30=lastSnapshot.history.delta30Pct>=0?'+':'';
          parts.push('Variação 30d: '+sign30+lastSnapshot.history.delta30Pct.toFixed(1)+'%');
        }
        var text=parts.join(' | ');
        var original=shareBtn.textContent;
        if(navigator.share){
          navigator.share({text:text}).then(function(){
            shareBtn.textContent='Compartilhado!';
            setTimeout(function(){shareBtn.textContent=original;},1200);
          }).catch(function(){
            copyText(text).then(function(){
              shareBtn.textContent='Copiado!';
              setTimeout(function(){shareBtn.textContent=original;},1200);
            }).catch(function(){
              shareBtn.textContent='Falhou';
              setTimeout(function(){shareBtn.textContent=original;},1200);
            });
          });
          return;
        }
        copyText(text).then(function(){
          shareBtn.textContent='Copiado!';
          setTimeout(function(){shareBtn.textContent=original;},1200);
        }).catch(function(){
          shareBtn.textContent='Falhou';
          setTimeout(function(){shareBtn.textContent=original;},1200);
        });
      });
    }
  }

  function initInsightShare(){
    var btn=document.querySelector('[data-insight-share]');
    var insight=document.querySelector('[data-activity-insight]');
    if(!btn || !insight){return;}

    btn.addEventListener('click',function(){
      var text=(insight.textContent||'').trim();
      if(!text || text.toLowerCase().indexOf('carregando')>-1){return;}

      var original=btn.textContent;
      if(navigator.share){
        navigator.share({text:text}).then(function(){
          btn.textContent='Compartilhado!';
          setTimeout(function(){btn.textContent=original;},1200);
        }).catch(function(){
          copyText(text).then(function(){
            btn.textContent='Copiado!';
            setTimeout(function(){btn.textContent=original;},1200);
          }).catch(function(){
            btn.textContent='Falhou';
            setTimeout(function(){btn.textContent=original;},1200);
          });
        });
        return;
      }

      copyText(text).then(function(){
        btn.textContent='Copiado!';
        setTimeout(function(){btn.textContent=original;},1200);
      }).catch(function(){
        btn.textContent='Falhou';
        setTimeout(function(){btn.textContent=original;},1200);
      });
    });
  }

  function initHomeDexCard(){
    var statusEl=document.querySelector('[data-home-dex-status]');
    if(!statusEl){return;}
    var badge=document.querySelector('[data-home-dex-badge]');
    var gaugeFill=document.querySelector('[data-home-dex-gauge-fill]');
    var gaugeNeedle=document.querySelector('[data-home-dex-gauge-needle]');

    function fetchJsonLocal(url){
      return fetch(url).then(function(resp){
        if(!resp.ok){throw new Error('Falha ao carregar '+url);}
        return resp.json();
      });
    }

    function average(list){
      if(!list.length){return 0;}
      var sum=0;
      list.forEach(function(item){sum+=item;});
      return sum/list.length;
    }

    function updateGauge(ratio){
      var score=Math.max(0,Math.min(100,Math.round((Math.min(ratio,2)/2)*100)));
      if(gaugeFill){
        var dash=252;
        var offset=dash-(dash*(score/100));
        gaugeFill.style.strokeDashoffset=offset;
        if(ratio>1.2){gaugeFill.style.stroke='var(--brand-green)';}
        else if(ratio<1){gaugeFill.style.stroke='#ff6b6b';}
        else{gaugeFill.style.stroke='var(--primary)';}
      }
      if(gaugeNeedle){
        var angle=-90 + (score*1.8);
        gaugeNeedle.style.transform='rotate('+angle+'deg)';
      }
    }

    function setStatus(ratio){
      var label='Estavel';
      if(ratio>3){label='Alta Extraordinaria';}
      else if(ratio>1.2){label='Em Crescimento';}
      else if(ratio<1){label='Em Retracao';}
      statusEl.textContent=label;
      if(badge){
        badge.textContent='Online';
        badge.classList.remove('offline');
      }
      updateGauge(ratio);
    }

    var dexUrl='https://api.llama.fi/overview/dexs/xrpl';
    fetchJsonLocal(dexUrl).then(function(dexData){
      if(!dexData || !Array.isArray(dexData.totalDataChart)){return;}
      var series=dexData.totalDataChart.map(function(point){
        return Array.isArray(point)?Number(point[1]||0):0;
      });
      if(series.length<2){return;}
      var last=series[series.length-1];
      var last30=series.slice(-30);
      var avg30=average(last30);
      var ratio=avg30?last/avg30:1;
      setStatus(ratio);
    }).catch(function(){
      statusEl.textContent='Indisponivel';
      if(badge){
        badge.textContent='Offline';
        badge.classList.add('offline');
      }
    });
  }

  function openSearch(){
    ensureSearchOverlay();
    searchOverlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
    searchInput.focus();
    if(!searchLoaded){
      loadSearchIndex();
    }
  }

  function closeSearch(){
    if(!searchOverlay){return;}
    searchOverlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    searchInput.value='';
    renderSearchResults();
  }

  function renderSearchResults(){
    if(!searchResults||!searchInput){return;}
    var query=(searchInput.value||'').trim().toLowerCase();
    if(!query){
      searchResults.innerHTML='<p class="search-empty">Digite um termo para buscar em artigos, guias e ferramentas.</p>';
      return;
    }
    if(!searchLoaded){
      searchResults.innerHTML='<p class="search-empty">Carregando indice...</p>';
      return;
    }
    var results=searchIndex.filter(function(item){
      var bag=(item.title+' '+item.description+' '+(item.category||'')+' '+(item.keywords||[]).join(' ')).toLowerCase();
      return bag.indexOf(query)>-1;
    }).slice(0,8);
    if(!results.length){
      searchResults.innerHTML='<p class="search-empty">Nenhum resultado encontrado para "'+query+'".</p>';
      return;
    }
    var html=results.map(function(item){
      return '<a class="search-result" href="'+item.url+'">'+
        '<strong>'+item.title+'</strong>'+
        '<span>'+item.description+'</span>'+
        '<span>'+item.category+'</span>'+
      '</a>';
    }).join('');
    searchResults.innerHTML=html;
  }

  function isTyping(el){
    if(!el){return false;}
    var tag=el.tagName;
    return tag==='INPUT'||tag==='TEXTAREA'||el.isContentEditable;
  }

  function initConsent(){
    try{
      if(localStorage.getItem(consentKey)==='accepted'){return;}
    }catch(err){
      console.warn('Consent storage',err);
    }
    consentOverlayEl=document.createElement('div');
    consentOverlayEl.className='consent-overlay';
    consentOverlayEl.setAttribute('role','dialog');
    consentOverlayEl.setAttribute('aria-modal','true');
    consentOverlayEl.innerHTML='\
      <div class="consent-box">\
        <p class="kicker">Aviso</p>\
        <h2>Conteudo educacional</h2>\
        <p>Ao continuar, voce reconhece que o site oferece apenas informacoes educativas sobre XRP/XRPL, sem recomendacoes financeiras.</p>\
        <p>Leia nossos <a href="/termos.html">Termos de Uso</a> e <a href="/privacidade.html">Politica de Privacidade</a>.</p>\
        <div class="consent-actions">\
          <button type="button" class="btn secondary" data-consent-cancel>Ver Termos</button>\
          <button type="button" class="btn primary" data-consent-accept>Aceito e desejo continuar</button>\
        </div>\
      </div>';
    document.body.appendChild(consentOverlayEl);
    document.body.classList.add('no-scroll');
    var acceptBtn=consentOverlayEl.querySelector('[data-consent-accept]');
    var cancelBtn=consentOverlayEl.querySelector('[data-consent-cancel]');
    if(cancelBtn){
      cancelBtn.addEventListener('click',function(){
        window.location.href='/termos.html';
      });
    }
    acceptBtn.addEventListener('click',function(){
      try{localStorage.setItem(consentKey,'accepted');}catch(err){console.warn('Consent storage set',err);}
      closeConsentOverlay();
    });
  }

  function closeConsentOverlay(){
    if(!consentOverlayEl){return;}
    consentOverlayEl.remove();
    consentOverlayEl=null;
    if(!searchOverlay || !searchOverlay.classList.contains('is-open')){
      document.body.classList.remove('no-scroll');
    }
  }

  function buildBreadcrumbs(){
    var main=document.querySelector('main');
    if(!main){return;}
    var path=window.location.pathname.replace(/index\.html$/,'');
    if(path==='/'||path===''){return;}
    var crumbs=[{label:'Inicio',url:'/'}];
    var overrideMap={
      '/pages/xrpl.html':[{label:'XRPL',url:'/pages/xrpl.html'}],
      '/pages/sobre.html':[{label:'Sobre',url:'/pages/sobre.html'}],
      '/termos.html':[{label:'Termos',url:'/termos.html'}],
      '/privacidade.html':[{label:'Privacidade',url:'/privacidade.html'}]
    };
    var override=overrideMap[window.location.pathname];
    if(override){
      crumbs=crumbs.concat(override);
    }else{
      var segments=path.split('/').filter(Boolean);
      if(segments.length){
        var first=segments[0];
        var map={
          'pages':{label:'Guias',url:'/pages/guia.html'},
          'artigos':{label:'Artigos',url:'/artigos/index.html'},
          'ebook':{label:'E-book',url:'/ebook/'},
          'glossario':{label:'Glossario',url:'/glossario/index.html'},
          'ferramentas':{label:'Ferramentas',url:'/ferramentas/index.html'},
          'newsletter':{label:'Newsletter',url:'/newsletter/index.html'}
        };
        if(map[first]){crumbs.push(map[first]);}
      }
    }
    var titleEl=main.querySelector('h1');
    var pageTitle=titleEl?titleEl.textContent.trim():document.title.replace('| XRP BRASIL','').trim();
    if(pageTitle && (!crumbs.length || crumbs[crumbs.length-1].label!==pageTitle)){
      crumbs.push({label:pageTitle});
    }
    var trail=document.createElement('nav');
    trail.className='breadcrumbs';
    trail.setAttribute('aria-label','Trilha de navegacao');
    trail.innerHTML=crumbs.map(function(crumb,index){
      if(crumb.url && index!==crumbs.length-1){
        return '<a href="'+crumb.url+'">'+crumb.label+'</a><span aria-hidden="true">›</span>';
      }
      return '<span class="breadcrumbs__current">'+crumb.label+'</span>';
    }).join(' ');
    main.insertBefore(trail,main.firstChild);
  }

  function injectSharePrompt(){
    var path=(window.location&&window.location.pathname)||'';
    if(path.indexOf('/artigos/')!==0){return;}
    if(path==='/artigos'||path==='/artigos/'){return;}
    if(path.endsWith('/index.html')){return;}
    var main=document.querySelector('main');
    if(!main){return;}
    if(main.querySelector('.share-cta')){return;}
    var shareSection=document.createElement('section');
    shareSection.className='share-cta';
    shareSection.innerHTML='\
      <h2>Compartilhe com algu&eacute;m que precisa saber disso</h2>\
      <p>Copie o link e envie por WhatsApp, Telegram ou email para continuar a conversa.</p>\
      <div class="share-cta__actions">\
        <button type="button" class="btn primary share-cta__button" data-share-copy>Copiar link</button>\
      </div>';
    var dateEl=main.querySelector('.article-date');
    if(dateEl){
      main.insertBefore(shareSection,dateEl);
    }else{
      main.appendChild(shareSection);
    }
    var button=shareSection.querySelector('[data-share-copy]');
    if(button){
      button.setAttribute('data-copy',computeShareUrl());
      button.removeAttribute('data-share-copy');
    }
  }

  function computeShareUrl(){
    if(!window||!window.location){return '';}
    var href=window.location.href||'';
    if(href && href.indexOf('file:')!==0){return href;}
    var origin=(window.location.origin && window.location.origin!=='null')?window.location.origin:'';
    if(origin){return origin+window.location.pathname+window.location.search;}
    if(window.location.protocol && window.location.host){
      return window.location.protocol+'//'+window.location.host+window.location.pathname+window.location.search;
    }
    return window.location.pathname+window.location.search;
  }
})();
