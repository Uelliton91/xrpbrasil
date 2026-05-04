(function(){
  var yearEl=document.getElementById('year');
  if(yearEl){yearEl.textContent=new Date().getFullYear();}
  var localeStorageKey='xrp_locale_v1';
  var currentLocale=getCurrentLocale();
  var localeMessages={
    pt:{
      copySuccess:'Copiado!',
      copyFailed:'Falhou',
      shared:'Compartilhado!',
      menu:'Menu',
      searchButton:'Buscar',
      searchDialogLabel:'Buscar no site',
      searchHeading:'Buscar no site',
      searchClose:'Fechar',
      searchFieldLabel:'Buscar por conteudo',
      searchPlaceholder:'Digite um termo (ex: AMM, carteiras, ISO 20022)',
      searchHint:'Pressione Enter para abrir o primeiro resultado ou Esc para fechar.',
      searchEmpty:'Digite um termo para buscar em artigos, guias e ferramentas.',
      searchLoading:'Carregando indice...',
      searchLoadError:'Nao foi possivel carregar o indice agora.',
      searchLoadFail:'Falha ao carregar indice',
      searchNoResults:'Nenhum resultado encontrado para ',
      consentKicker:'Aviso',
      consentTitle:'Conteudo educacional',
      consentBody:'Ao continuar, voce reconhece que o site oferece apenas informacoes educativas sobre XRP/XRPL, sem recomendacoes financeiras.',
      consentIntro:'Leia nossos',
      consentJoin:' e ',
      consentTerms:'Termos de Uso',
      consentPrivacy:'Politica de Privacidade',
      consentCancel:'Ver Termos',
      consentAccept:'Aceito e desejo continuar',
      breadcrumbs:'Trilha de navegacao',
      home:'Inicio',
      guides:'Guias',
      articles:'Artigos',
      ebook:'E-book',
      glossary:'Glossario',
      tools:'Ferramentas',
      newsletter:'Newsletter',
      about:'Sobre',
      terms:'Termos',
      privacy:'Privacidade',
      shareTitle:'Compartilhe com alguem que precisa saber disso',
      shareBody:'Copie o link e envie por WhatsApp, Telegram ou email para continuar a conversa.',
      shareButton:'Copiar link',
      metrics:'Metricas',
      tracker:'Rastreador',
      localeLabel:'Selecionar idioma',
      localePt:'PT',
      localeEn:'EN',
      online:'Online',
      offline:'Offline',
      unavailable:'Indisponivel',
      dexStable:'Estavel',
      dexGrowth:'Em Crescimento',
      dexRetraction:'Em Retracao',
      dexExceptional:'Alta Extraordinaria',
      trackerTrendUp:'Subindo',
      trackerTrendDown:'Caindo',
      trackerTrendStable:'Estavel',
      trackerTrendInsufficient:'Sem dados suficientes',
      trackerStatusSub:'Comparado a media de 30 dias',
      trackerInterpretationPrefix:'Hoje negociou o equivalente a ',
      trackerInterpretationSuffix:' dias de volume medio.',
      trackerNoComparison:'Sem comparacao',
      trackerDelta30Avg:'vs media 30d',
      trackerDelta7Prev:'vs 7d anterior',
      trackerDelta30Prev:'vs 30d anterior',
      trackerSentimentStable:'Estavel',
      trackerSentimentGrowth:'📈 Em Crescimento',
      trackerSentimentRetraction:'⚠️ Em Retracao',
      trackerSentimentExceptional:'🔥 Alta Extraordinaria',
      trackerChartVolume:'Volume diario',
      trackerChartMA7:'Media movel 7d',
      trackerChartMA30:'Media movel 30d',
      trackerLastValidUpdate:'Ultima atualizacao valida: ',
      exchangeNoData:'Sem dados no momento.',
      exchangeWallets:'carteiras',
      exchangeDelta7:'Variacao 7d: ',
      exchangeDelta30:'Variacao 30d: ',
      exchangeDeltaBuilding:'em construcao (aguarde historico).',
      exchangeUpdated:'Atualizado em ',
      exchangeShareBase:'Saldo em corretoras (hot): XRP ',
      exchangeShare7:'Variacao 7d: ',
      exchangeShare30:'Variacao 30d: '
    },
    en:{
      copySuccess:'Copied!',
      copyFailed:'Failed',
      shared:'Shared!',
      menu:'Menu',
      searchButton:'Search',
      searchDialogLabel:'Search the site',
      searchHeading:'Search the site',
      searchClose:'Close',
      searchFieldLabel:'Search content',
      searchPlaceholder:'Type a term (e.g. AMM, wallets, ISO 20022)',
      searchHint:'Press Enter to open the first result or Esc to close.',
      searchEmpty:'Type a term to search articles, guides, and tools.',
      searchLoading:'Loading index...',
      searchLoadError:'Unable to load the search index right now.',
      searchLoadFail:'Failed to load index',
      searchNoResults:'No results found for ',
      consentKicker:'Notice',
      consentTitle:'Educational content',
      consentBody:'By continuing, you acknowledge that this site provides educational information about XRP/XRPL only, without financial recommendations.',
      consentIntro:'Read our',
      consentJoin:' and ',
      consentTerms:'Terms of Use',
      consentPrivacy:'Privacy Policy',
      consentCancel:'View terms',
      consentAccept:'I understand and wish to continue',
      breadcrumbs:'Breadcrumb',
      home:'Home',
      guides:'Guides',
      articles:'Articles',
      ebook:'E-book',
      glossary:'Glossary',
      tools:'Tools',
      newsletter:'Newsletter',
      about:'About',
      terms:'Terms',
      privacy:'Privacy',
      shareTitle:'Share this with someone who needs to see it',
      shareBody:'Copy the link and send it via WhatsApp, Telegram, or email to keep the conversation going.',
      shareButton:'Copy link',
      metrics:'Metrics',
      tracker:'Tracker',
      localeLabel:'Select language',
      localePt:'PT',
      localeEn:'EN',
      online:'Online',
      offline:'Offline',
      unavailable:'Unavailable',
      dexStable:'Stable',
      dexGrowth:'Growing',
      dexRetraction:'Cooling Off',
      dexExceptional:'Exceptional Spike',
      trackerTrendUp:'Rising',
      trackerTrendDown:'Falling',
      trackerTrendStable:'Stable',
      trackerTrendInsufficient:'Not enough data',
      trackerStatusSub:'Compared with the 30-day average',
      trackerInterpretationPrefix:'Today traded the equivalent of ',
      trackerInterpretationSuffix:' average daily volumes.',
      trackerNoComparison:'No comparison',
      trackerDelta30Avg:'vs 30d avg',
      trackerDelta7Prev:'vs previous 7d',
      trackerDelta30Prev:'vs previous 30d',
      trackerSentimentStable:'Stable',
      trackerSentimentGrowth:'📈 Growing',
      trackerSentimentRetraction:'⚠️ Cooling Off',
      trackerSentimentExceptional:'🔥 Exceptional Spike',
      trackerChartVolume:'Daily volume',
      trackerChartMA7:'7d moving average',
      trackerChartMA30:'30d moving average',
      trackerLastValidUpdate:'Last valid update: ',
      exchangeNoData:'No data available right now.',
      exchangeWallets:'wallets',
      exchangeDelta7:'7d change: ',
      exchangeDelta30:'30d change: ',
      exchangeDeltaBuilding:'building (waiting for history).',
      exchangeUpdated:'Updated at ',
      exchangeShareBase:'Exchange balances (hot): XRP ',
      exchangeShare7:'7d change: ',
      exchangeShare30:'30d change: '
    }
  };
  var localeRouteMap={
    '/':{pt:'/',en:'/en/'},
    '/en':{pt:'/',en:'/en/'},
    '/pages/guia.html':{pt:'/pages/guia.html',en:'/en/pages/guide.html'},
    '/en/pages/guide.html':{pt:'/pages/guia.html',en:'/en/pages/guide.html'},
    '/pages/xrpl.html':{pt:'/pages/xrpl.html',en:'/en/pages/xrpl.html'},
    '/en/pages/xrpl.html':{pt:'/pages/xrpl.html',en:'/en/pages/xrpl.html'},
    '/pages/sobre.html':{pt:'/pages/sobre.html',en:'/en/pages/about.html'},
    '/en/pages/about.html':{pt:'/pages/sobre.html',en:'/en/pages/about.html'},
    '/pages/o-que-e-xrp.html':{pt:'/pages/o-que-e-xrp.html',en:'/en/pages/what-is-xrp.html'},
    '/en/pages/what-is-xrp.html':{pt:'/pages/o-que-e-xrp.html',en:'/en/pages/what-is-xrp.html'},
    '/pages/o-que-e-xrpl.html':{pt:'/pages/o-que-e-xrpl.html',en:'/en/pages/what-is-xrpl.html'},
    '/en/pages/what-is-xrpl.html':{pt:'/pages/o-que-e-xrpl.html',en:'/en/pages/what-is-xrpl.html'},
    '/pages/xrpl-passo-a-passo.html':{pt:'/pages/xrpl-passo-a-passo.html',en:'/en/pages/xrpl-step-by-step.html'},
    '/en/pages/xrpl-step-by-step.html':{pt:'/pages/xrpl-passo-a-passo.html',en:'/en/pages/xrpl-step-by-step.html'},
    '/pages/rastreador-xrpl.html':{pt:'/pages/rastreador-xrpl.html',en:'/en/pages/xrpl-tracker.html'},
    '/en/pages/xrpl-tracker.html':{pt:'/pages/rastreador-xrpl.html',en:'/en/pages/xrpl-tracker.html'},
    '/pages/glossario.html':{pt:'/glossario/',en:'/en/glossary/'},
    '/en/pages/glossary.html':{pt:'/glossario/',en:'/en/glossary/'},
    '/ebook':{pt:'/ebook/',en:'/en/ebook/'},
    '/en/ebook':{pt:'/ebook/',en:'/en/ebook/'},
    '/ferramentas':{pt:'/ferramentas/',en:'/en/tools/'},
    '/en/tools':{pt:'/ferramentas/',en:'/en/tools/'},
    '/glossario':{pt:'/glossario/',en:'/en/glossary/'},
    '/en/glossary':{pt:'/glossario/',en:'/en/glossary/'},
    '/metricas':{pt:'/metricas/',en:'/en/metrics/'},
    '/en/metrics':{pt:'/metricas/',en:'/en/metrics/'},
    '/newsletter':{pt:'/newsletter/',en:'/en/newsletter/'},
    '/en/newsletter':{pt:'/newsletter/',en:'/en/newsletter/'},
    '/termos.html':{pt:'/termos.html',en:'/en/terms.html'},
    '/en/terms.html':{pt:'/termos.html',en:'/en/terms.html'},
    '/privacidade.html':{pt:'/privacidade.html',en:'/en/privacy.html'},
    '/en/privacy.html':{pt:'/privacidade.html',en:'/en/privacy.html'},
    '/404.html':{pt:'/404.html',en:'/en/404.html'},
    '/en/404.html':{pt:'/404.html',en:'/en/404.html'},
    '/artigos':{pt:'/artigos/',en:'/en/articles/'},
    '/en/articles':{pt:'/artigos/',en:'/en/articles/'},
    '/artigos/atualizacoes':{pt:'/artigos/atualizacoes/',en:'/en/articles/archive/'},
    '/en/articles/archive':{pt:'/artigos/atualizacoes/',en:'/en/articles/archive/'},
    '/artigos/atualizacoes/2026-05-02.html':{pt:'/artigos/atualizacoes/2026-05-02.html',en:'/en/articles/2026-05-02.html'},
    '/en/articles/2026-05-02.html':{pt:'/artigos/atualizacoes/2026-05-02.html',en:'/en/articles/2026-05-02.html'},
    '/artigos/atualizacao-semanal.html':{pt:'/artigos/atualizacoes/2026-05-02.html',en:'/en/articles/2026-05-02.html'},
    '/artigos/atualizacao-semanal':{pt:'/artigos/atualizacoes/2026-05-02.html',en:'/en/articles/2026-05-02.html'},
    '/en/articles/weekly-update.html':{pt:'/artigos/atualizacoes/2026-05-02.html',en:'/en/articles/2026-05-02.html'},
    '/en/articles/weekly-update':{pt:'/artigos/atualizacoes/2026-05-02.html',en:'/en/articles/2026-05-02.html'},
    '/artigos/2025-infraestrutura-xrp-institucional.html':{pt:'/artigos/2025-infraestrutura-xrp-institucional.html',en:'/en/articles/2025-institutional-xrp-infrastructure.html'},
    '/en/articles/2025-institutional-xrp-infrastructure.html':{pt:'/artigos/2025-infraestrutura-xrp-institucional.html',en:'/en/articles/2025-institutional-xrp-infrastructure.html'},
    '/artigos/amm-dex-xrpl.html':{pt:'/artigos/amm-dex-xrpl.html',en:'/en/articles/xrpl-amm-and-native-dex.html'},
    '/en/articles/xrpl-amm-and-native-dex.html':{pt:'/artigos/amm-dex-xrpl.html',en:'/en/articles/xrpl-amm-and-native-dex.html'},
    '/artigos/aquisicoes-ripple.html':{pt:'/artigos/aquisicoes-ripple.html',en:'/en/articles/ripple-acquisitions-and-xrp-xrpl.html'},
    '/en/articles/ripple-acquisitions-and-xrp-xrpl.html':{pt:'/artigos/aquisicoes-ripple.html',en:'/en/articles/ripple-acquisitions-and-xrp-xrpl.html'},
    '/artigos/atualizacoes-rlusd-xrpl-etfs.html':{pt:'/artigos/atualizacoes-rlusd-xrpl-etfs.html',en:'/en/articles/weekly-updates-rlusd-xrpl-xrp-etfs.html'},
    '/en/articles/weekly-updates-rlusd-xrpl-xrp-etfs.html':{pt:'/artigos/atualizacoes-rlusd-xrpl-etfs.html',en:'/en/articles/weekly-updates-rlusd-xrpl-xrp-etfs.html'},
    '/artigos/carteiras-xrp.html':{pt:'/artigos/carteiras-xrp.html',en:'/en/articles/xrp-wallets-custody-and-security.html'},
    '/en/articles/xrp-wallets-custody-and-security.html':{pt:'/artigos/carteiras-xrp.html',en:'/en/articles/xrp-wallets-custody-and-security.html'},
    '/artigos/casos-uso-xrpl.html':{pt:'/artigos/casos-uso-xrpl.html',en:'/en/articles/xrpl-real-world-use-cases.html'},
    '/en/articles/xrpl-real-world-use-cases.html':{pt:'/artigos/casos-uso-xrpl.html',en:'/en/articles/xrpl-real-world-use-cases.html'},
    '/artigos/etfs-xrp-institucional.html':{pt:'/artigos/etfs-xrp-institucional.html',en:'/en/articles/xrp-etfs-and-institutional-capital.html'},
    '/en/articles/xrp-etfs-and-institutional-capital.html':{pt:'/artigos/etfs-xrp-institucional.html',en:'/en/articles/xrp-etfs-and-institutional-capital.html'},
    '/artigos/historia-xrp-xrpl.html':{pt:'/artigos/historia-xrp-xrpl.html',en:'/en/articles/history-of-xrp-and-xrpl.html'},
    '/en/articles/history-of-xrp-and-xrpl.html':{pt:'/artigos/historia-xrp-xrpl.html',en:'/en/articles/history-of-xrp-and-xrpl.html'},
    '/artigos/introducao-xrpl.html':{pt:'/artigos/introducao-xrpl.html',en:'/en/articles/practical-introduction-to-xrpl.html'},
    '/en/articles/practical-introduction-to-xrpl.html':{pt:'/artigos/introducao-xrpl.html',en:'/en/articles/practical-introduction-to-xrpl.html'},
    '/artigos/iso20022-xrpl.html':{pt:'/artigos/iso20022-xrpl.html',en:'/en/articles/iso-20022-and-xrpl.html'},
    '/en/articles/iso-20022-and-xrpl.html':{pt:'/artigos/iso20022-xrpl.html',en:'/en/articles/iso-20022-and-xrpl.html'},
    '/artigos/parcerias-ripple-xrp.html':{pt:'/artigos/parcerias-ripple-xrp.html',en:'/en/articles/ripple-public-partnerships-payments.html'},
    '/en/articles/ripple-public-partnerships-payments.html':{pt:'/artigos/parcerias-ripple-xrp.html',en:'/en/articles/ripple-public-partnerships-payments.html'},
    '/artigos/parcerias-ripple-xrpl.html':{pt:'/artigos/parcerias-ripple-xrpl.html',en:'/en/articles/ripple-partnerships-with-xrp-and-xrpl-potential.html'},
    '/en/articles/ripple-partnerships-with-xrp-and-xrpl-potential.html':{pt:'/artigos/parcerias-ripple-xrpl.html',en:'/en/articles/ripple-partnerships-with-xrp-and-xrpl-potential.html'},
    '/artigos/projetos-brasileiros-xrpl.html':{pt:'/artigos/projetos-brasileiros-xrpl.html',en:'/en/articles/brazilian-projects-in-the-xrpl-ecosystem.html'},
    '/en/articles/brazilian-projects-in-the-xrpl-ecosystem.html':{pt:'/artigos/projetos-brasileiros-xrpl.html',en:'/en/articles/brazilian-projects-in-the-xrpl-ecosystem.html'},
    '/artigos/ripple-xrp-xrpl.html':{pt:'/artigos/ripple-xrp-xrpl.html',en:'/en/articles/ripple-xrp-xrpl-differences.html'},
    '/en/articles/ripple-xrp-xrpl-differences.html':{pt:'/artigos/ripple-xrp-xrpl.html',en:'/en/articles/ripple-xrp-xrpl-differences.html'},
    '/artigos/sec-vs-ripple-xrp.html':{pt:'/artigos/sec-vs-ripple-xrp.html',en:'/en/articles/sec-vs-ripple-xrp.html'},
    '/en/articles/sec-vs-ripple-xrp.html':{pt:'/artigos/sec-vs-ripple-xrp.html',en:'/en/articles/sec-vs-ripple-xrp.html'},
    '/artigos/seguranca-xrp-xrpl.html':{pt:'/artigos/seguranca-xrp-xrpl.html',en:'/en/articles/xrp-xrpl-security-guide.html'},
    '/en/articles/xrp-xrpl-security-guide.html':{pt:'/artigos/seguranca-xrp-xrpl.html',en:'/en/articles/xrp-xrpl-security-guide.html'},
    '/artigos/semana-em-foco-etfs-iso20022.html':{pt:'/artigos/semana-em-foco-etfs-iso20022.html',en:'/en/articles/week-in-focus-xrp-xrpl-etfs-iso20022.html'},
    '/en/articles/week-in-focus-xrp-xrpl-etfs-iso20022.html':{pt:'/artigos/semana-em-foco-etfs-iso20022.html',en:'/en/articles/week-in-focus-xrp-xrpl-etfs-iso20022.html'},
    '/artigos/stablecoins-xrpl.html':{pt:'/artigos/stablecoins-xrpl.html',en:'/en/articles/stablecoins-on-xrpl.html'},
    '/en/articles/stablecoins-on-xrpl.html':{pt:'/artigos/stablecoins-xrpl.html',en:'/en/articles/stablecoins-on-xrpl.html'},
    '/artigos/xrp-epicentro-revolucao-institucional.html':{pt:'/artigos/xrp-epicentro-revolucao-institucional.html',en:'/en/articles/xrp-at-the-center-of-the-institutional-shift.html'},
    '/en/articles/xrp-at-the-center-of-the-institutional-shift.html':{pt:'/artigos/xrp-epicentro-revolucao-institucional.html',en:'/en/articles/xrp-at-the-center-of-the-institutional-shift.html'},
    '/artigos/xrp-infraestrutura-destaque.html':{pt:'/artigos/xrp-infraestrutura-destaque.html',en:'/en/articles/xrp-infrastructure-in-the-spotlight.html'},
    '/en/articles/xrp-infrastructure-in-the-spotlight.html':{pt:'/artigos/xrp-infraestrutura-destaque.html',en:'/en/articles/xrp-infrastructure-in-the-spotlight.html'},
    '/artigos/xrp-nova-infraestrutura-financeira-global.html':{pt:'/artigos/xrp-nova-infraestrutura-financeira-global.html',en:'/en/articles/xrp-in-the-new-global-financial-infrastructure.html'},
    '/en/articles/xrp-in-the-new-global-financial-infrastructure.html':{pt:'/artigos/xrp-nova-infraestrutura-financeira-global.html',en:'/en/articles/xrp-in-the-new-global-financial-infrastructure.html'},
    '/artigos/xrp-vs-btc-eth.html':{pt:'/artigos/xrp-vs-btc-eth.html',en:'/en/articles/xrp-xrpl-vs-btc-and-eth.html'},
    '/en/articles/xrp-xrpl-vs-btc-and-eth.html':{pt:'/artigos/xrp-vs-btc-eth.html',en:'/en/articles/xrp-xrpl-vs-btc-and-eth.html'},
    '/artigos/xrp-xrpl-e-ripple.html':{pt:'/artigos/xrp-xrpl-e-ripple.html',en:'/en/articles/how-ripple-xrp-and-xrpl-connect.html'},
    '/en/articles/how-ripple-xrp-and-xrpl-connect.html':{pt:'/artigos/xrp-xrpl-e-ripple.html',en:'/en/articles/how-ripple-xrp-and-xrpl-connect.html'},
    '/artigos/atualizacoes/2025-11-13.html':{pt:'/artigos/atualizacoes/2025-11-13.html',en:'/en/articles/archive/2025-11-13.html'},
    '/en/articles/archive/2025-11-13.html':{pt:'/artigos/atualizacoes/2025-11-13.html',en:'/en/articles/archive/2025-11-13.html'},
    '/artigos/atualizacoes/2026-01-10.html':{pt:'/artigos/atualizacoes/2026-01-10.html',en:'/en/articles/archive/2026-01-10.html'},
    '/artigos/atualizacoes/2026-01-10':{pt:'/artigos/atualizacoes/2026-01-10.html',en:'/en/articles/archive/2026-01-10.html'},
    '/en/articles/archive/2026-01-10.html':{pt:'/artigos/atualizacoes/2026-01-10.html',en:'/en/articles/archive/2026-01-10.html'},
    '/artigos/atualizacoes/2026-01-26.html':{pt:'/artigos/atualizacoes/2026-01-26.html',en:'/en/articles/archive/2026-01-26.html'},
    '/en/articles/archive/2026-01-26.html':{pt:'/artigos/atualizacoes/2026-01-26.html',en:'/en/articles/archive/2026-01-26.html'},
    '/artigos/atualizacoes/2026-02-14.html':{pt:'/artigos/atualizacoes/2026-02-14.html',en:'/en/articles/archive/2026-02-14.html'},
    '/en/articles/archive/2026-02-14.html':{pt:'/artigos/atualizacoes/2026-02-14.html',en:'/en/articles/archive/2026-02-14.html'}
  };

  function getCurrentLocale(){
    var path=(window.location&&window.location.pathname)||'/';
    return path==='/en' || path.indexOf('/en/')===0 ? 'en' : 'pt';
  }

  function t(key){
    var catalog=localeMessages[currentLocale]||localeMessages.pt;
    return catalog[key]||localeMessages.pt[key]||key;
  }

  function normalizeLocalePath(path){
    var normalized=(path||'/').replace(/index\.html$/,'');
    if(!normalized){normalized='/';}
    if(normalized.charAt(0)!=='/'){normalized='/'+normalized;}
    if(normalized.length>1 && normalized.endsWith('/')){
      normalized=normalized.slice(0,-1);
    }
    return normalized||'/';
  }

  function saveLocalePreference(locale){
    try{localStorage.setItem(localeStorageKey,locale);}catch(err){console.warn('Locale storage',err);}
  }

  function numberLocale(){
    return currentLocale==='en'?'en-US':'pt-BR';
  }

  function legalPath(kind){
    if(currentLocale==='en'){
      return kind==='terms'?'/en/terms.html':'/en/privacy.html';
    }
    return kind==='terms'?'/termos.html':'/privacidade.html';
  }

  function getCounterpartLocalePath(targetLocale){
    var normalized=normalizeLocalePath(window.location.pathname);
    var mapped=localeRouteMap[normalized];
    if(mapped && mapped[targetLocale]){return mapped[targetLocale];}
    if(targetLocale==='en'){
      if(normalized.indexOf('/artigos/')===0){return '/en/articles/';}
      if(normalized.indexOf('/pages/')===0){return '/en/pages/guide.html';}
      return '/en/';
    }
    if(normalized.indexOf('/en/articles/')===0){return '/artigos/index.html';}
    if(normalized.indexOf('/en/pages/')===0){return '/pages/guia.html';}
    return '/';
  }

  function applyPreferredLocale(){
    var preferred;
    try{preferred=localStorage.getItem(localeStorageKey);}catch(err){return false;}
    if(!preferred || preferred===currentLocale){return false;}
    var normalized=normalizeLocalePath(window.location.pathname);
    if(normalized!=='/' && normalized!=='/en'){return false;}
    var target=getCounterpartLocalePath(preferred);
    if(!target){return false;}
    if(normalizeLocalePath(target)===normalized){return false;}
    window.location.replace(target);
    return true;
  }

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
        btn.textContent=t('copySuccess');
        setTimeout(function(){btn.textContent=original;},1200);
      }).catch(function(){
        btn.textContent=t('copyFailed');
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
    if(applyPreferredLocale()){return;}
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
    if(currentLocale==='en'){return;}
    var nav=document.querySelector('.site-header .nav');
    if(!nav){return;}
    var target='/metricas/';
    if(nav.querySelector('a[href="'+target+'"]')){return;}
    var link=document.createElement('a');
    link.href=target;
    link.textContent=t('metrics');
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
    if(currentLocale==='en'){return;}
    var nav=document.querySelector('.site-header .nav');
    if(!nav){return;}
    var target='/pages/rastreador-xrpl.html';
    if(nav.querySelector('a[href=\"'+target+'\"]')){return;}
    var link=document.createElement('a');
    link.href=target;
    link.textContent=t('tracker');
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
    toggle.innerHTML='<span>'+t('menu')+'</span>';
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
    searchBtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><span>'+t('searchButton')+'</span>';
    actions.appendChild(searchBtn);
    initLocaleSwitcher(actions,searchBtn);
    searchBtn.addEventListener('click',function(){openSearch();});
  }

  function initLocaleSwitcher(actions,searchBtn){
    if(!actions || actions.querySelector('[data-locale-switcher]')){return;}
    var switcher=document.createElement('div');
    switcher.className='locale-switcher';
    switcher.setAttribute('data-locale-switcher','');
    switcher.setAttribute('role','group');
    switcher.setAttribute('aria-label',t('localeLabel'));
    ['pt','en'].forEach(function(locale){
      var button=document.createElement('button');
      button.type='button';
      button.className='locale-switcher__button'+(locale===currentLocale?' is-active':'');
      button.setAttribute('aria-pressed',locale===currentLocale?'true':'false');
      button.textContent=locale==='pt'?t('localePt'):t('localeEn');
      button.addEventListener('click',function(){
        saveLocalePreference(locale);
        var target=getCounterpartLocalePath(locale);
        if(target && normalizeLocalePath(target)!==normalizeLocalePath(window.location.pathname)){
          window.location.href=target;
        }
      });
      switcher.appendChild(button);
    });
    actions.insertBefore(switcher,searchBtn||null);
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
    var indexUrl=currentLocale==='en'?'/data/search-index-en.json':'/data/search-index.json';
    searchLoadPromise=fetch(indexUrl).then(function(resp){
      if(!resp.ok){throw new Error(t('searchLoadFail'));}
      return resp.json();
    }).then(function(data){
      searchIndex=Array.isArray(data)?data:[];
      searchLoaded=true;
      renderSearchResults();
      return searchIndex;
    }).catch(function(err){
      console.warn('Busca interna',err);
      if(searchResults){
        searchResults.innerHTML='<p class=\"search-empty\">'+t('searchLoadError')+'</p>';
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
    searchOverlay.setAttribute('aria-label',t('searchDialogLabel'));
    searchOverlay.innerHTML='\
      <div class="search-panel" role="document">\
        <header>\
          <strong>'+t('searchHeading')+'</strong>\
          <button type="button" class="search-close" data-close-search>'+t('searchClose')+'</button>\
        </header>\
        <form role="search">\
          <label for="site-search-input" class="visually-hidden">'+t('searchFieldLabel')+'</label>\
          <div class="search-input-wrap">\
            <input id="site-search-input" class="search-input" type="search" placeholder="'+t('searchPlaceholder')+'" autocomplete="off" />\
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>\
          </div>\
          <p class="search-hint">'+t('searchHint')+'</p>\
        </form>\
        <div class="search-results" data-results>\
          <p class="search-empty">'+t('searchEmpty')+'</p>\
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
      return value.toLocaleString(numberLocale());
    }

    function formatCurrency(value){
      if(value===null||value===undefined||Number.isNaN(value)){return '--';}
      return value.toLocaleString(numberLocale(),{style:'currency',currency:'USD',maximumFractionDigits:0});
    }

    function formatCompactCurrency(value){
      if(value===null||value===undefined||Number.isNaN(value)){return '--';}
      return new Intl.NumberFormat(numberLocale(),{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:1}).format(value);
    }

    function formatXrp(value){
      if(value===null||value===undefined||Number.isNaN(value)){return '--';}
      return 'XRP '+new Intl.NumberFormat(numberLocale(),{notation:'compact',maximumFractionDigits:2}).format(value);
    }

    function clamp(num,min,max){return Math.max(min,Math.min(max,num));}

    function average(list){
      if(!list.length){return 0;}
      var sum=0;
      list.forEach(function(item){sum+=item;});
      return sum/list.length;
    }

    function buildStatus(ratio){
      if(ratio>1.15){return {label:t('dexGrowth'),tone:'var(--brand-green)'};}
      if(ratio<0.85){return {label:t('dexRetraction'),tone:'#ff6b6b'};}
      return {label:t('dexStable'),tone:'var(--primary)'};}

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
      if(values.length<14){return 'insufficient';}
      var last7=values.slice(-7);
      var prev7=values.slice(-14,-7);
      var avgLast=average(last7);
      var avgPrev=average(prev7);
      if(avgPrev===0){return 'flat';}
      var ratio=avgLast/avgPrev;
      if(ratio>1.05){return 'up';}
      if(ratio<0.95){return 'down';}
      return 'flat';
    }

    function getTrendLabel(code){
      if(code==='up'){return t('trackerTrendUp');}
      if(code==='down'){return t('trackerTrendDown');}
      if(code==='insufficient'){return t('trackerTrendInsufficient');}
      return t('trackerTrendStable');
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
      var ratioLabel=new Intl.NumberFormat(numberLocale(),{minimumFractionDigits:2,maximumFractionDigits:2}).format(ratio)+'x';
      var deltaPct=Math.round((ratio-1)*100);
      var sentimentText=t('trackerSentimentStable');
      if(ratio>3){sentimentText=t('trackerSentimentExceptional');}
      else if(ratio>1.2){sentimentText=t('trackerSentimentGrowth');}
      else if(ratio<1){sentimentText=t('trackerSentimentRetraction');}

      setText(els.status,sentimentText);
      if(els.badge){
        els.badge.textContent=t('online');
        els.badge.classList.remove('offline');
      }
      var statusColor='var(--primary)';
      if(ratio>1.2){statusColor='var(--brand-green)';}
      if(ratio<1){statusColor='#ff6b6b';}
      if(els.status){els.status.style.color=statusColor;}
      if(els.status){els.status.style.color=status.tone;}
      setText(els.statusSub,t('trackerStatusSub'));
      setText(els.index,ratioLabel);
      if(els.delta){els.delta.textContent='('+(deltaPct>=0?'+':'')+deltaPct+'%)';}
      if(els.interpretation){
        els.interpretation.textContent=t('trackerInterpretationPrefix')+ratioLabel+t('trackerInterpretationSuffix');
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
      setText(els.vol7dDelta,vol7Delta===null?t('trackerNoComparison'):(vol7Delta.toFixed(1)+'% '+t('trackerDelta30Avg')));
      var trendCode=computeTrend(series.map(function(p){return p.value;}));
      var trend=getTrendLabel(trendCode);
      setText(els.trend,trend);
      if(els.trend){
        els.trend.classList.remove('trend-up','trend-down','trend-flat');
        if(trendCode==='up'){els.trend.classList.add('trend-up');}
        else if(trendCode==='down'){els.trend.classList.add('trend-down');}
        else{els.trend.classList.add('trend-flat');}
        var arrow=trendCode==='up'?' ↑':(trendCode==='down'?' ↓':' →');
        els.trend.textContent=trend+arrow;
      }
      setText(els.updated,new Date().toLocaleString(numberLocale()));

      var sum7=last7.reduce(function(a,b){return a+b.value;},0);
      var sumPrev7=prev7.reduce(function(a,b){return a+b.value;},0);
      var sum30=last30.reduce(function(a,b){return a+b.value;},0);
      var sumPrev30=prev30.reduce(function(a,b){return a+b.value;},0);

      if(els.delta24){
        var delta24=Math.round((ratio-1)*100);
        els.delta24.textContent=(delta24>=0?'▲ ':'▼ ')+Math.abs(delta24)+'% '+t('trackerDelta30Avg');
        els.delta24.classList.toggle('up',delta24>=0);
        els.delta24.classList.toggle('down',delta24<0);
      }
      if(els.delta7){
        var delta7=sumPrev7?Math.round(((sum7/sumPrev7)-1)*100):0;
        els.delta7.textContent=sumPrev7?((delta7>=0?'▲ ':'▼ ')+Math.abs(delta7)+'% '+t('trackerDelta7Prev')):'--';
        els.delta7.classList.toggle('up',delta7>=0);
        els.delta7.classList.toggle('down',delta7<0);
      }
      if(els.delta30){
        var delta30=sumPrev30?Math.round(((sum30/sumPrev30)-1)*100):0;
        els.delta30.textContent=sumPrev30?((delta30>=0?'▲ ':'▼ ')+Math.abs(delta30)+'% '+t('trackerDelta30Prev')):'--';
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
        if(currentLocale==='en'){
          templatesByTone={
            muito_alto:[
              'Volume exploded: 24h reached {ratio} of the monthly average, placing today in the top {topPct}% of the period. The last 7 days total {vol7} ({share7}% of 30d), with trend {trend}.',
              'Exceptional spike: 24h came in at {ratio} of the monthly average. Today ranks among the top {topPct}% of recent sessions. The week adds up to {vol7} ({share7}% of 30d), still {trend}.'
            ],
            alto:[
              'Activity is elevated: 24h is running at {ratio} of the monthly average, in the top {topPct}% of the period. The last 7 days total {vol7} ({share7}% of 30d), with trend {trend}.',
              'Volume is above average: 24h reached {ratio}. Today sits in the top {topPct}% of recent sessions. The week totals {vol7} ({share7}% of 30d), showing a {trend} profile.'
            ],
            estavel:[
              'Activity is within normal range: 24h is at {ratio} of the monthly average. The last 7 days total {vol7} ({share7}% of 30d), with trend {trend}.',
              'Stable reading: 24h stands at {ratio} of the monthly average. The week accumulates {vol7} ({share7}% of 30d), while the short-term trend remains {trend}.'
            ],
            baixo:[
              'Activity is below normal: 24h is at {ratio} of the monthly average. The last 7 days total {vol7} ({share7}% of 30d), with trend {trend}.',
              'Volume has cooled off: 24h sits at {ratio} of the monthly average. The week totals {vol7} ({share7}% of 30d), indicating a {trend} rhythm.'
            ]
          };
        }

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
              label:t('trackerChartVolume')+' ('+range+'d)',
              data:data,
              borderColor:'#00e6ff',
              backgroundColor:'rgba(0,230,255,0.12)',
              fill:true,
              tension:0.25,
              pointRadius:0
            },
            {
              label:t('trackerChartMA7'),
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
          label:t('trackerChartMA30'),
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
        setText(els.status,t('unavailable'));
        if(els.badge){
          els.badge.textContent=t('offline');
          els.badge.classList.add('offline');
        }
        if(lastSnapshot){
          updateUI(lastSnapshot);
          setText(els.updated,t('trackerLastValidUpdate')+new Date().toLocaleString(numberLocale()));
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
      return 'XRP '+new Intl.NumberFormat(numberLocale(),{notation:'compact',maximumFractionDigits:2}).format(value);
    }

    function renderList(items){
      if(!listEl){return;}
      if(!items || !items.length){
        listEl.innerHTML='<span class="muted">'+t('exchangeNoData')+'</span>';
        return;
      }
      var selected=items
        .filter(function(item){return item && typeof item.xrp==='number' && item.xrp>0;})
        .sort(function(a,b){return b.xrp-a.xrp;})
        .slice(0,4);
      var html=selected.slice(0,4).map(function(item){
        var addressCount=Array.isArray(item.addresses)?item.addresses.length:Number(item.addresses||0);
        return '<article class="activity-kpi activity-kpi--compact">'+
          '<p class="label">'+item.name+'</p>'+
          '<h2>'+formatXrp(item.xrp)+'</h2>'+
          '<p class="muted">'+addressCount+' '+t('exchangeWallets')+'</p>'+
        '</article>';
      }).join('');
      listEl.innerHTML=html;
    }

    var lastSnapshot=null;

    function updateUI(data){
      if(!data){return;}
      lastSnapshot=data;
      if(statusEl){
        statusEl.textContent=t('online');
        statusEl.classList.remove('offline');
      }
      if(totalEl){totalEl.textContent=formatXrp(data.totalXrp||0);}
      if(delta7El){
        if(data.history && typeof data.history.delta7Pct === 'number' && typeof data.history.delta7Xrp === 'number'){
          var sign7=data.history.delta7Pct>=0?'+':'';
          delta7El.textContent=t('exchangeDelta7')+sign7+data.history.delta7Pct.toFixed(1)+'% ('+formatXrp(data.history.delta7Xrp)+')';
          delta7El.classList.toggle('exchange-delta-up',data.history.delta7Pct>=0);
          delta7El.classList.toggle('exchange-delta-down',data.history.delta7Pct<0);
        }else{
          delta7El.textContent=t('exchangeDelta7')+t('exchangeDeltaBuilding');
          delta7El.classList.remove('exchange-delta-up','exchange-delta-down');
        }
      }
      if(delta30El){
        if(data.history && typeof data.history.delta30Pct === 'number' && typeof data.history.delta30Xrp === 'number'){
          var sign30=data.history.delta30Pct>=0?'+':'';
          delta30El.textContent=t('exchangeDelta30')+sign30+data.history.delta30Pct.toFixed(1)+'% ('+formatXrp(data.history.delta30Xrp)+')';
          delta30El.classList.toggle('exchange-delta-up',data.history.delta30Pct>=0);
          delta30El.classList.toggle('exchange-delta-down',data.history.delta30Pct<0);
        }else{
          delta30El.textContent=t('exchangeDelta30')+t('exchangeDeltaBuilding');
          delta30El.classList.remove('exchange-delta-up','exchange-delta-down');
        }
      }
      renderList(data.exchanges||[]);
      if(updatedEl){
        updatedEl.textContent=t('exchangeUpdated')+new Date().toLocaleString(numberLocale());
      }
    }

    function load(){
      var isLocal=location.hostname==='localhost'||location.hostname==='127.0.0.1';
      var primary='/api/exchange-balances?v=6';
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
              statusEl.textContent=t('offline');
              statusEl.classList.add('offline');
            }
          });
          return;
        }
        console.warn('Exchange tracker',err);
        if(statusEl){
          statusEl.textContent=t('offline');
          statusEl.classList.add('offline');
        }
      });
    }

    load();
    setInterval(load,3600000);

    if(shareBtn){
      shareBtn.addEventListener('click',function(){
        if(!lastSnapshot || typeof lastSnapshot.totalXrp!=='number'){return;}
        var base=t('exchangeShareBase')+new Intl.NumberFormat(numberLocale(),{notation:'compact',maximumFractionDigits:2}).format(lastSnapshot.totalXrp);
        var parts=[base];
        if(lastSnapshot.history && typeof lastSnapshot.history.delta7Pct === 'number'){
          var sign7=lastSnapshot.history.delta7Pct>=0?'+':'';
          parts.push(t('exchangeShare7')+sign7+lastSnapshot.history.delta7Pct.toFixed(1)+'%');
        }
        if(lastSnapshot.history && typeof lastSnapshot.history.delta30Pct === 'number'){
          var sign30=lastSnapshot.history.delta30Pct>=0?'+':'';
          parts.push(t('exchangeShare30')+sign30+lastSnapshot.history.delta30Pct.toFixed(1)+'%');
        }
        var text=parts.join(' | ');
        var original=shareBtn.textContent;
        if(navigator.share){
          navigator.share({text:text}).then(function(){
            shareBtn.textContent=t('shared');
            setTimeout(function(){shareBtn.textContent=original;},1200);
          }).catch(function(){
            copyText(text).then(function(){
              shareBtn.textContent=t('copySuccess');
              setTimeout(function(){shareBtn.textContent=original;},1200);
            }).catch(function(){
              shareBtn.textContent=t('copyFailed');
              setTimeout(function(){shareBtn.textContent=original;},1200);
            });
          });
          return;
        }
        copyText(text).then(function(){
          shareBtn.textContent=t('copySuccess');
          setTimeout(function(){shareBtn.textContent=original;},1200);
        }).catch(function(){
          shareBtn.textContent=t('copyFailed');
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
      var lowered=text.toLowerCase();
      if(!text || lowered.indexOf('carregando')>-1 || lowered.indexOf('loading')>-1){return;}

      var original=btn.textContent;
        if(navigator.share){
          navigator.share({text:text}).then(function(){
            btn.textContent=t('shared');
            setTimeout(function(){btn.textContent=original;},1200);
          }).catch(function(){
            copyText(text).then(function(){
              btn.textContent=t('copySuccess');
              setTimeout(function(){btn.textContent=original;},1200);
            }).catch(function(){
              btn.textContent=t('copyFailed');
              setTimeout(function(){btn.textContent=original;},1200);
            });
          });
        return;
      }

      copyText(text).then(function(){
        btn.textContent=t('copySuccess');
        setTimeout(function(){btn.textContent=original;},1200);
      }).catch(function(){
        btn.textContent=t('copyFailed');
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
      var label=t('dexStable');
      if(ratio>3){label=t('dexExceptional');}
      else if(ratio>1.2){label=t('dexGrowth');}
      else if(ratio<1){label=t('dexRetraction');}
      statusEl.textContent=label;
      if(badge){
        badge.textContent=t('online');
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
      statusEl.textContent=t('unavailable');
      if(badge){
        badge.textContent=t('offline');
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
      searchResults.innerHTML='<p class="search-empty">'+t('searchEmpty')+'</p>';
      return;
    }
    if(!searchLoaded){
      searchResults.innerHTML='<p class="search-empty">'+t('searchLoading')+'</p>';
      return;
    }
    var results=searchIndex.filter(function(item){
      var bag=(item.title+' '+item.description+' '+(item.category||'')+' '+(item.keywords||[]).join(' ')).toLowerCase();
      return bag.indexOf(query)>-1;
    }).slice(0,8);
    if(!results.length){
      searchResults.innerHTML='<p class="search-empty">'+t('searchNoResults')+'"'+query+'".</p>';
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
        <p class="kicker">'+t('consentKicker')+'</p>\
        <h2>'+t('consentTitle')+'</h2>\
        <p>'+t('consentBody')+'</p>\
        <p>'+t('consentIntro')+' <a href="'+legalPath('terms')+'">'+t('consentTerms')+'</a>'+t('consentJoin')+'<a href="'+legalPath('privacy')+'">'+t('consentPrivacy')+'</a>.</p>\
        <div class="consent-actions">\
          <button type="button" class="btn secondary" data-consent-cancel>'+t('consentCancel')+'</button>\
          <button type="button" class="btn primary" data-consent-accept>'+t('consentAccept')+'</button>\
        </div>\
      </div>';
    document.body.appendChild(consentOverlayEl);
    document.body.classList.add('no-scroll');
    var acceptBtn=consentOverlayEl.querySelector('[data-consent-accept]');
    var cancelBtn=consentOverlayEl.querySelector('[data-consent-cancel]');
    if(cancelBtn){
      cancelBtn.addEventListener('click',function(){
        window.location.href=legalPath('terms');
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
    var path=normalizeLocalePath(window.location.pathname);
    if(path==='/'||path==='/en'){return;}
    var isEn=currentLocale==='en';
    var crumbs=[{label:t('home'),url:isEn?'/en/':'/'}];
    var overrideMap=isEn?{
      '/en/pages/xrpl.html':[{label:'XRPL',url:'/en/pages/xrpl.html'}],
      '/en/pages/about.html':[{label:t('about'),url:'/en/pages/about.html'}],
      '/en/terms.html':[{label:t('terms'),url:'/en/terms.html'}],
      '/en/privacy.html':[{label:t('privacy'),url:'/en/privacy.html'}]
    }:{
      '/pages/xrpl.html':[{label:'XRPL',url:'/pages/xrpl.html'}],
      '/pages/sobre.html':[{label:t('about'),url:'/pages/sobre.html'}],
      '/termos.html':[{label:t('terms'),url:'/termos.html'}],
      '/privacidade.html':[{label:t('privacy'),url:'/privacidade.html'}]
    };
    var override=overrideMap[window.location.pathname];
    if(override){
      crumbs=crumbs.concat(override);
    }else{
      var segments=path.split('/').filter(Boolean);
      if(segments.length){
        var first=isEn && segments[0]==='en' ? segments[1] : segments[0];
        var map=isEn?{
          'pages':{label:t('guides'),url:'/en/pages/guide.html'},
          'articles':{label:t('articles'),url:'/en/articles/'},
          'ebook':{label:t('ebook'),url:'/en/ebook/'},
          'glossary':{label:t('glossary'),url:'/en/glossary/'},
          'tools':{label:t('tools'),url:'/en/tools/'},
          'newsletter':{label:t('newsletter'),url:'/en/newsletter/'},
          'metrics':{label:t('metrics'),url:'/en/metrics/'}
        }:{
          'pages':{label:t('guides'),url:'/pages/guia.html'},
          'artigos':{label:t('articles'),url:'/artigos/index.html'},
          'ebook':{label:t('ebook'),url:'/ebook/'},
          'glossario':{label:t('glossary'),url:'/glossario/index.html'},
          'ferramentas':{label:t('tools'),url:'/ferramentas/index.html'},
          'newsletter':{label:t('newsletter'),url:'/newsletter/index.html'}
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
    trail.setAttribute('aria-label',t('breadcrumbs'));
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
    var isPtArticle=path.indexOf('/artigos/')===0 && path!=='/artigos' && path!=='/artigos/';
    var isEnArticle=path.indexOf('/en/articles/')===0 && path!=='/en/articles' && path!=='/en/articles/';
    if(!isPtArticle && !isEnArticle){return;}
    if(path.endsWith('/index.html')){return;}
    var main=document.querySelector('main');
    if(!main){return;}
    if(main.querySelector('.share-cta')){return;}
    var shareSection=document.createElement('section');
    shareSection.className='share-cta';
    shareSection.innerHTML='\
      <h2>'+t('shareTitle')+'</h2>\
      <p>'+t('shareBody')+'</p>\
      <div class="share-cta__actions">\
        <button type="button" class="btn primary share-cta__button" data-share-copy>'+t('shareButton')+'</button>\
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
