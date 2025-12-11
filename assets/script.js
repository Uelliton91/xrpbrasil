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
    enhanceHeader();
    setupSearch();
    loadSearchIndex();
    initConsent();
    buildBreadcrumbs();
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
})();
