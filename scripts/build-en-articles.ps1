$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$siteUrl = 'https://xrpbrasil.com.br'
$outDir = Join-Path $root 'en\articles'
$archiveDir = Join-Path $outDir 'archive'
$searchIndexPath = Join-Path $root 'data\search-index-en.json'

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
New-Item -ItemType Directory -Force -Path $archiveDir | Out-Null

function HtmlText([string]$value){
  return [System.Net.WebUtility]::HtmlEncode($value)
}

function NavHtml {
  return @'
    <header class="site-header">
      <a class="brand" href="/en/"><img src="/assets/logo.png" alt="XRP BRASIL" height="26" onerror="this.onerror=null;this.src='/assets/logo.svg';"/> <span>XRP BRASIL</span></a>
      <nav class="nav">
        <a href="/en/pages/guide.html">Guide</a>
        <a href="/en/pages/xrpl.html">XRPL</a>
        <a href="/en/pages/xrpl-tracker.html">Tracker</a>
        <a href="/en/articles/">Articles</a>
        <a href="/en/ebook/">E-book</a>
        <a href="/en/tools/">Tools</a>
        <a href="/en/metrics/">Metrics</a>
        <a href="/en/glossary/">Glossary</a>
        <a href="/en/pages/about.html">About</a>
      </nav>
    </header>
'@
}

function FooterHtml {
  return '<footer class="site-footer"><p>&copy; <span id="year"></span> XRP BRASIL - Independent educational content. <a href="/en/terms.html">Terms</a> | <a href="/en/privacy.html">Privacy</a></p></footer>'
}

function CardHtml($href, $tag, $title, $description){
  return @"
        <a class="card" href="$href">
          <span class="tag">$(HtmlText $tag)</span>
          <h3>$(HtmlText $title)</h3>
          <p>$(HtmlText $description)</p>
        </a>
"@
}

function RelatedHtml {
  return @'
      <section class="related">
        <h2>Read next</h2>
        <div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
          <a class="card" href="/en/pages/guide.html">
            <h3>Start with the guide</h3>
            <p>Build context on XRP, XRPL, safety, and the right study path before going deeper.</p>
          </a>
          <a class="card" href="/en/pages/xrpl.html">
            <h3>Understand the ledger</h3>
            <p>Review consensus, DEX, AMM, trustlines, and validators in one technical overview.</p>
          </a>
          <a class="card" href="/en/articles/2026-05-02.html">
            <h3>Read the current highlight</h3>
            <p>See how regulation, RLUSD, DTCC/NSCC, SWIFT, ETFs, and tokenization connect today.</p>
          </a>
        </div>
      </section>
'@
}

function JsonLdHtml($item, $canonical){
  $json = [ordered]@{
    '@context' = 'https://schema.org'
    '@type' = 'BlogPosting'
    headline = $item.title
    description = $item.description
    inLanguage = 'en'
    mainEntityOfPage = @{
      '@type' = 'WebPage'
      '@id' = $canonical
    }
    author = @{
      '@type' = 'Organization'
      name = 'XRP BRASIL'
    }
    publisher = @{
      '@type' = 'Organization'
      name = 'XRP BRASIL'
      logo = @{
        '@type' = 'ImageObject'
        url = "$siteUrl/assets/logo.png"
      }
    }
    url = $canonical
  }
  if($item.dateIso){
    $json.datePublished = $item.dateIso
  }
  return ($json | ConvertTo-Json -Depth 8)
}

function ArticleHtml($item){
  $canonical = "$siteUrl$($item.enPath)"
  $alternate = "$siteUrl$($item.ptPath)"
  $title = "$(HtmlText $item.title) | XRP BRASIL"
  $desc = HtmlText $item.description
  $tag = HtmlText $item.tag
  $lead = HtmlText $item.lead
  $topNotice = HtmlText $item.topNotice
  $bottomNotice = HtmlText $item.bottomNotice
  $bullets = ($item.bullets | ForEach-Object { "        <li>$(HtmlText $_)</li>" }) -join "`n"
  $overview = ($item.overview | ForEach-Object { "      <p>$(HtmlText $_)</p>" }) -join "`n"
  $why = ($item.why | ForEach-Object { "      <p>$(HtmlText $_)</p>" }) -join "`n"
  $takeaway = HtmlText $item.takeaway
  $published = HtmlText $item.publishedLabel
  $jsonLd = JsonLdHtml $item $canonical
  return @"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>$title</title>
    <meta name="description" content="$desc" />
    <meta name="robots" content="index,follow" />
    <meta name="author" content="XRP BRASIL" />
    <meta name="application-name" content="XRP BRASIL" />
    <meta name="theme-color" content="#030712" />
    <meta name="color-scheme" content="dark light" />
    <meta name="keywords" content="$(($item.keywords | ForEach-Object { HtmlText $_ }) -join ', ')" />
    <link rel="canonical" href="$canonical" />
    <link rel="alternate" href="$alternate" hreflang="pt-BR" />
    <link rel="alternate" href="$canonical" hreflang="en" />
    <link rel="alternate" href="$alternate" hreflang="x-default" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="XRP BRASIL" />
    <meta property="og:title" content="$title" />
    <meta property="og:description" content="$desc" />
    <meta property="og:url" content="$canonical" />
    <meta property="og:image" content="$siteUrl/assets/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Brasil_Xrp" />
    <meta name="twitter:title" content="$title" />
    <meta name="twitter:description" content="$desc" />
    <meta name="twitter:image" content="$siteUrl/assets/logo.png" />
    <link rel="stylesheet" href="/assets/styles.css" />
    <link rel="icon" href="/assets/favicon.svg" />
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-NHTPCXTQRF"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-NHTPCXTQRF');
    </script>
  </head>
  <body>
$(NavHtml)
    <main class="container">
      <section class="notice">
        <p><strong>${tag}:</strong> $topNotice</p>
      </section>

      <h1>$(HtmlText $item.title)</h1>
      <p class="lead">$lead</p>

      <h2>What this page covers</h2>
      <ul>
$bullets
      </ul>

      <h2>Overview</h2>
$overview

      <h2>Why it matters</h2>
$why

      <h2>Practical takeaway</h2>
      <p>$takeaway</p>

$(RelatedHtml)

      <section class="notice">
        <p>$bottomNotice</p>
      </section>
      <p class="article-date">$published</p>
    </main>
    $(FooterHtml)
    <script src="/assets/script.js"></script>
    <script type="application/ld+json">
$jsonLd
    </script>
  </body>
</html>
"@
}

$articles = @(
  [pscustomobject]@{
    ptPath = '/artigos/2025-infraestrutura-xrp-institucional.html'
    enPath = '/en/articles/2025-institutional-xrp-infrastructure.html'
    title = '2025: XRP infrastructure at institutional scale'
    description = 'XRP ETFs, RLUSD, and tokenization show how 2025 strengthened the institutional infrastructure around XRP and XRPL.'
    publishedLabel = 'Published on January 2, 2026'
    dateIso = '2026-01-02'
    tag = 'Infrastructure'
    category = 'infrastructure'
    lead = 'This article frames 2025 as the year in which XRP and XRPL stopped looking like peripheral crypto topics and started looking like institutional plumbing.'
    topNotice = 'This English page condenses and translates the original Portuguese article for international readers while preserving the main institutional thesis.'
    bullets = @(
      'Why 2025 was less about narrative and more about financial rails.',
      'How ETFs, RLUSD, and tokenization reinforced the same infrastructure story.',
      'What changed in the market structure around XRP and XRPL.'
    )
    overview = @(
      'The Portuguese original argues that 2025 should be read as a systems year. Instead of a single headline dominating the cycle, several pieces moved at once: regulated products, custody, stablecoins, tokenization, and public-ledger interoperability.',
      'In that reading, XRP does not gain importance because of community enthusiasm alone. It gains importance because the surrounding architecture begins to look compatible with the needs of regulated capital and operational liquidity.'
    )
    why = @(
      'That distinction matters because institutional adoption rarely arrives through dramatic declarations. It arrives through repeated compatibility with compliance, settlement, reporting, and market structure.',
      'For international readers, this page is useful as a snapshot of why 2025 is described on the site as a consolidation year rather than a speculative anomaly.'
    )
    takeaway = 'The main takeaway is simple: when multiple regulated rails begin pointing in the same direction, the conversation shifts from hype to infrastructure readiness.'
    bottomNotice = 'Educational content only. Use the Portuguese original if you want the exact wording and local editorial framing of the full article.'
    keywords = @('xrp', 'xrpl', 'institutional infrastructure', 'rlusd', 'tokenization', 'etfs')
  }
  [pscustomobject]@{
    ptPath = '/artigos/amm-dex-xrpl.html'
    enPath = '/en/articles/xrpl-amm-and-native-dex.html'
    title = 'XRPL AMM and native DEX'
    description = 'Guide to XRPL''s on-ledger DEX and native AMM: order books, pools, LP tokens, routing, and practical risks.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Technical'
    category = 'foundations'
    lead = 'XRPL combines an on-ledger order-book exchange with a native AMM, giving the network a hybrid market structure that is unusual among public ledgers.'
    topNotice = 'This English page is a condensed translation of the Portuguese guide and focuses on the core technical ideas rather than every implementation detail.'
    bullets = @(
      'How the order-book DEX works inside the ledger itself.',
      'What auto-bridging with XRP changes for execution and routing.',
      'Which AMM and liquidity risks still matter in practice.'
    )
    overview = @(
      'The original article explains that XRPL''s DEX is not an external application layer. Order books live inside the ledger, so wallets and applications can interact with the same market structure directly from the protocol.',
      'It also highlights why the native AMM matters: pools, LP tokens, and swap routing can operate alongside traditional order books, which allows liquidity to be sourced from more than one mechanism at once.'
    )
    why = @(
      'That matters because XRPL''s value proposition is not only about fast payments. It also includes native market access and asset exchange without depending on a stack of separate smart contracts for basic functionality.',
      'For readers evaluating XRPL seriously, the practical question is not whether an AMM exists, but how native integration changes slippage, routing, capital efficiency, and user experience.'
    )
    takeaway = 'If you want to understand XRPL as infrastructure, study how value is routed through order books, pools, and XRP bridge liquidity. That is one of the ledger''s most distinctive design choices.'
    bottomNotice = 'Educational content only. Review official XRPL documentation before using AMMs or DEX tools with meaningful capital.'
    keywords = @('xrpl', 'amm', 'dex', 'order book', 'liquidity', 'lp tokens')
  }
  [pscustomobject]@{
    ptPath = '/artigos/aquisicoes-ripple.html'
    enPath = '/en/articles/ripple-acquisitions-and-xrp-xrpl.html'
    title = 'Ripple acquisitions and their impact on XRP and XRPL'
    description = 'Key Ripple acquisitions and investments, and how they may strengthen XRP and XRPL across custody, payments, and tokenization.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'M&A'
    category = 'infrastructure'
    lead = 'This article looks at Ripple''s acquisition strategy as a map of where the company thinks financial infrastructure is going next.'
    topNotice = 'This English page summarizes and translates the Portuguese analysis for international readers who want the strategic picture without the full local-language text.'
    bullets = @(
      'Why acquisitions matter more than brand expansion alone.',
      'How custody, settlement, and tokenization assets can reinforce XRPL relevance.',
      'Where corporate strategy meets ledger utility.'
    )
    overview = @(
      'The original Portuguese piece argues that Ripple''s acquisitions should not be read as isolated business deals. They are best understood as attempts to secure positions in the stack around settlement, custody, capital markets, and institutional access.',
      'From that perspective, even when an acquired company does not use XRPL immediately, it may still increase the probability that Ripple-controlled infrastructure can route value, custody assets, or support tokenized workflows that later intersect with XRPL.'
    )
    why = @(
      'This matters because infrastructure rarely scales through one product alone. It scales through adjacencies: custody connects to tokenization, tokenization connects to settlement, and settlement connects to liquidity.',
      'For XRP watchers, the key question is not whether every acquisition creates direct token demand on day one. It is whether the broader platform becomes harder to ignore inside institutional finance.'
    )
    takeaway = 'Read Ripple''s acquisitions as architecture moves. The deeper the company sits inside institutional workflows, the easier it becomes for XRP and XRPL to become functional components of those workflows.'
    bottomNotice = 'Educational content only. Corporate acquisitions do not automatically imply direct token usage, and each integration should be evaluated case by case.'
    keywords = @('ripple', 'acquisitions', 'xrpl', 'xrp', 'custody', 'tokenization')
  }
  [pscustomobject]@{
    ptPath = '/artigos/atualizacoes-rlusd-xrpl-etfs.html'
    enPath = '/en/articles/weekly-updates-rlusd-xrpl-xrp-etfs.html'
    title = 'Weekly updates: RLUSD, XRPL, and XRP ETFs'
    description = 'Weekly summary covering RLUSD, XRPL developments, and XRP ETF data, including assets under management and circulating-supply context.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Weekly'
    category = 'market'
    lead = 'This piece condenses a week in which stablecoin structure, ledger development, and ETF flows all pointed back to the same thesis: market access is becoming more institutional.'
    topNotice = 'This English page is a condensed archive translation of the original Portuguese weekly article.'
    bullets = @(
      'What RLUSD signals about regulated liquidity design.',
      'How XRP ETF data changes the way supply absorption is discussed.',
      'Why weekly flow data can matter more than isolated headlines.'
    )
    overview = @(
      'The Portuguese article ties together three threads that are often discussed separately: stablecoin design, XRPL evolution, and regulated market access through ETFs. It argues that those threads increasingly belong to one infrastructure story.',
      'Rather than treating RLUSD as a retail stablecoin narrative, the article presents it as a regulated settlement and liquidity instrument. ETF flow data, in turn, is used to show how institutional exposure can absorb circulating supply without following typical retail behavior.'
    )
    why = @(
      'That framework matters because the most relevant market signals are not always price spikes. Sometimes they are signs of deepening structure: more regulated products, more operational liquidity, and more reliable channels between capital and settlement layers.',
      'International readers following XRP only through price action often miss that weekly background shift. This article exists to connect those dots.'
    )
    takeaway = 'The recurring takeaway is that regulated liquidity, ETF access, and XRPL utility should be evaluated together. They describe the same market transition from different angles.'
    bottomNotice = 'Educational content only. Weekly commentary is not investment advice and should not replace source verification for ETF or stablecoin data.'
    keywords = @('rlusd', 'xrpl', 'xrp etfs', 'weekly update', 'aum', 'market structure')
  }
  [pscustomobject]@{
    ptPath = '/artigos/carteiras-xrp.html'
    enPath = '/en/articles/xrp-wallets-custody-and-security.html'
    title = 'XRP wallets: custody and security'
    description = 'Self-custody versus third-party custody, wallet types, seed phrases, multisigning, and security practices for XRP users.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Security'
    category = 'security'
    lead = 'Wallet choice is not a cosmetic decision on XRPL. It determines who controls the keys, where operational risk sits, and how recoverable a mistake may be.'
    topNotice = 'This English page condenses the original Portuguese wallet guide so international readers can navigate the site safely from day one.'
    bullets = @(
      'The difference between self-custody and custodial platforms.',
      'What seed phrases, regular keys, and multisigning change in practice.',
      'How to approach wallet security before moving real funds.'
    )
    overview = @(
      'The Portuguese article separates custody models clearly. A user who controls the private keys has more autonomy, but also carries more operational responsibility. A user who leaves funds with a third party outsources convenience and risk at the same time.',
      'It also explains that XRPL security is not just about one wallet app. It includes backup discipline, domain verification, device hygiene, and a realistic understanding of phishing and impersonation scams.'
    )
    why = @(
      'This matters because most retail losses in crypto come from operational mistakes, not from misunderstanding consensus theory. Security failures are usually simple and preventable.',
      'For newcomers arriving through English social posts, a clear wallet framework is often more valuable than another market commentary article.'
    )
    takeaway = 'Treat wallets as key-management tools, not as branding choices. Learn custody models first, then choose the product that matches your risk tolerance and operating habits.'
    bottomNotice = 'Educational content only. Never share seed phrases, private keys, or recovery screenshots with anyone.'
    keywords = @('xrp wallet', 'custody', 'seed phrase', 'multisigning', 'security', 'xrpl')
  }
  [pscustomobject]@{
    ptPath = '/artigos/casos-uso-xrpl.html'
    enPath = '/en/articles/xrpl-real-world-use-cases.html'
    title = 'XRPL in the real world: use cases beyond speculation'
    description = 'Payments, remittances, stablecoins, utility NFTs, and institutional projects that use XRPL in practice.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Use cases'
    category = 'foundations'
    lead = 'XRPL becomes easier to evaluate once the discussion moves away from price cycles and toward concrete use cases that require fast settlement and low transaction cost.'
    topNotice = 'This English version condenses the Portuguese article into a practical use-case map for readers who want utility context quickly.'
    bullets = @(
      'Which XRPL applications stand apart from pure speculation.',
      'How stablecoins, payments, and tokenization fit into one ledger model.',
      'Why institutional pilots and user-level tools both matter.'
    )
    overview = @(
      'The original Portuguese article walks through several categories of practical use: cross-border payments, remittance corridors, issued assets, utility NFTs, and enterprise or institutional pilots.',
      'Its main argument is that XRPL should be judged by functional fit. Networks that make settlement cheaper, faster, and easier to audit naturally attract use cases that depend on those properties.'
    )
    why = @(
      'That matters because speculative attention can obscure real adoption signals. In many cases, the stronger indicator is not price, but whether a specific workflow becomes easier to run on-chain.',
      'Readers who want to understand XRPL''s long-term relevance need to see how those workflows connect to public-ledger design.'
    )
    takeaway = 'Use cases are the bridge between theory and adoption. If you can explain why a payment, tokenized asset, or wallet flow works better on XRPL, you are much closer to understanding the network''s real value.'
    bottomNotice = 'Educational content only. Not every public pilot becomes production, so each cited use case should be verified against current official sources.'
    keywords = @('xrpl use cases', 'payments', 'remittances', 'stablecoins', 'tokenization', 'nfts')
  }
  [pscustomobject]@{
    ptPath = '/artigos/etfs-xrp-institucional.html'
    enPath = '/en/articles/xrp-etfs-and-institutional-capital.html'
    title = 'XRP ETFs and institutional capital'
    description = 'Overview of XRP-linked ETFs, ETPs, and ETNs, how to verify official products, and what they may change in market liquidity.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Market'
    category = 'market'
    lead = 'ETFs do not matter simply because they are new products. They matter because they change who can access XRP, through which regulated wrappers, and under what portfolio mandates.'
    topNotice = 'This English page condenses and translates the original Portuguese market article for readers tracking regulated XRP access.'
    bullets = @(
      'How to distinguish official XRP products from noise and rumor.',
      'Why ETFs, ETPs, and ETNs are not interchangeable.',
      'What institutional wrappers can change in liquidity and market perception.'
    )
    overview = @(
      'The Portuguese article explains the basic product map first: spot vehicles, exchange-traded notes, and other listed wrappers do not all carry the same structure, custody model, or risk profile.',
      'It then connects those products to a bigger institutional question. Once exposure becomes easier to access through regulated channels, the composition of demand can shift away from purely retail speculation.'
    )
    why = @(
      'That matters because flows into institutional wrappers often follow different rules than direct exchange trading. They can be slower, more predictable, and tied to allocation mandates rather than online narrative momentum.',
      'For international readers, understanding that distinction is essential before using ETF headlines as bullish or bearish shortcuts.'
    )
    takeaway = 'The most useful question is not whether an XRP ETF exists. It is what kind of product it is, who can buy it, and how that changes liquidity behavior over time.'
    bottomNotice = 'Educational content only. Always verify issuer documentation, custody disclosures, and market structure before relying on any ETF or ETP claim.'
    keywords = @('xrp etf', 'institutional capital', 'etp', 'etn', 'liquidity', 'market')
  }
  [pscustomobject]@{
    ptPath = '/artigos/historia-xrp-xrpl.html'
    enPath = '/en/articles/history-of-xrp-and-xrpl.html'
    title = 'History of XRP and XRPL since 2012'
    description = 'Timeline of XRP and XRPL: origins, founders, early design choices, and major milestones since 2012.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'History'
    category = 'foundations'
    lead = 'Understanding XRPL is easier when you know the order in which its design choices, governance debates, and institutional associations emerged.'
    topNotice = 'This English page condenses the Portuguese historical overview into a timeline-style summary for international readers.'
    bullets = @(
      'Where XRP and XRPL came from and why they were built differently from proof-of-work networks.',
      'Which founders and early contributors shaped the project.',
      'How the ledger''s history affects today''s debates.'
    )
    overview = @(
      'The Portuguese article traces XRPL back to its 2012 launch and explains why its creators prioritized fast settlement, low cost, and native exchange functionality from the beginning.',
      'It also separates the history of the public ledger from the later corporate story around Ripple. That distinction helps readers understand how a network can remain public while still being strongly associated with a company.'
    )
    why = @(
      'Historical context matters because many present-day arguments around XRP mix up chronology, governance, and product history. Without a timeline, readers often inherit simplified narratives that miss the technical intent of the ledger.',
      'A clean timeline also makes it easier to evaluate why XRP is discussed differently from both Bitcoin and Ethereum.'
    )
    takeaway = 'History does not answer every market question, but it clarifies design intent. For XRPL, that intent has always centered on settlement infrastructure rather than mining culture.'
    bottomNotice = 'Educational content only. Use this page as a guide to the main milestones, then verify deeper historical claims through primary sources when needed.'
    keywords = @('xrp history', 'xrpl history', 'founders', 'timeline', 'settlement', '2012')
  }
  [pscustomobject]@{
    ptPath = '/artigos/introducao-xrpl.html'
    enPath = '/en/articles/practical-introduction-to-xrpl.html'
    title = 'Practical introduction to XRPL'
    description = 'Create a testnet account, inspect it on XRPScan, and send your first XRPL transaction step by step.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Guide'
    category = 'foundations'
    lead = 'This article turns XRPL from an abstract topic into a hands-on environment by walking the reader through testnet setup and first interaction.'
    topNotice = 'This English version condenses the Portuguese tutorial into a clean practical entry point for new readers.'
    bullets = @(
      'How to create and inspect a testnet account safely.',
      'What to look for in XRPScan when you view an XRPL address.',
      'Why a first low-risk transaction teaches more than passive reading.'
    )
    overview = @(
      'The Portuguese tutorial focuses on learning through observation. Instead of asking the reader to buy anything first, it starts with testnet access, balance inspection, and basic transaction flow.',
      'That approach reinforces one of the site''s central principles: operational understanding should come before capital allocation. Readers are encouraged to build intuition in a safe environment.'
    )
    why = @(
      'This matters because public-ledger concepts become much clearer once you have seen them on a real explorer: sequence numbers, balances, transaction hashes, and confirmations stop being theoretical vocabulary.',
      'A practical tutorial also reduces beginner anxiety and helps readers avoid confusing product marketing with actual network behavior.'
    )
    takeaway = 'Before you form strong opinions about XRPL, use the testnet. Even one small transaction can make the ledger feel far more legible than hours of second-hand commentary.'
    bottomNotice = 'Educational content only. Use official tools and testnet resources first, and avoid real-value transfers until you understand the basics.'
    keywords = @('xrpl tutorial', 'testnet', 'xrpscan', 'first transaction', 'beginner', 'guide')
  }
  [pscustomobject]@{
    ptPath = '/artigos/iso20022-xrpl.html'
    enPath = '/en/articles/iso-20022-and-xrpl.html'
    title = 'ISO 20022 and the role of XRPL in payments'
    description = 'Understand the ISO 20022 messaging standard, why banks are migrating, and how XRP and XRPL fit into modern payment infrastructure.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Infrastructure'
    category = 'infrastructure'
    lead = 'ISO 20022 is not a token narrative. It is a messaging standard, and the important question is how ledgers like XRPL interact with that standardized financial language.'
    topNotice = 'This English page condenses the Portuguese article into a practical infrastructure reading for international audiences.'
    bullets = @(
      'What ISO 20022 is and what it is not.',
      'Why payment modernization depends on structured financial data.',
      'How XRPL can sit near that transition without being confused with the standard itself.'
    )
    overview = @(
      'The original article explains that ISO 20022 is about richer, more structured messaging across financial institutions. It is not a direct endorsement of any one asset or ledger.',
      'The relevance to XRPL comes from interoperability. If global payment infrastructure is modernizing around more expressive data standards, the ledgers that can connect cleanly to those flows become more useful.'
    )
    why = @(
      'That matters because many online discussions collapse ISO 20022 into simplistic token-selection narratives. The Portuguese piece pushes back on that and focuses instead on architecture and compatibility.',
      'Readers who understand that distinction are less likely to confuse marketing slogans with actual financial integration.'
    )
    takeaway = 'Treat ISO 20022 as an infrastructure lens. It helps explain why interoperability and data quality matter, but it should not be used as a shortcut for price assumptions.'
    bottomNotice = 'Educational content only. Standards migration is complex and institution-specific, so always separate documented integration from speculation.'
    keywords = @('iso 20022', 'xrpl', 'payments', 'financial messaging', 'interoperability', 'xrp')
  }
  [pscustomobject]@{
    ptPath = '/artigos/parcerias-ripple-xrp.html'
    enPath = '/en/articles/ripple-public-partnerships-payments.html'
    title = 'Ripple public partnerships: clients and payments'
    description = 'Overview of publicly announced Ripple partnerships with a focus on cross-border payments, liquidity, and real operational use.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Adoption'
    category = 'infrastructure'
    lead = 'Partnership lists are only useful when they help readers distinguish between marketing noise and operational relevance.'
    topNotice = 'This English page condenses the Portuguese article and keeps the same cautious framing around public partnership announcements.'
    bullets = @(
      'Which kinds of Ripple partnerships deserve closer attention.',
      'How to separate real payment relevance from superficial brand association.',
      'Why public partnerships do not all imply the same level of XRP or XRPL usage.'
    )
    overview = @(
      'The Portuguese article reviews public Ripple partnerships through a practical filter. It asks what each relationship actually involves: messaging, liquidity, custody, infrastructure, or simply a limited integration layer.',
      'That approach helps prevent a common mistake in crypto commentary: treating every company mention as identical evidence of adoption.'
    )
    why = @(
      'This matters because institutional infrastructure is built through specific workflows, not generic logo collections. A single deep integration can matter more than dozens of shallow references.',
      'Readers following Ripple from abroad benefit from a more disciplined framework for reading announcements and public-client narratives.'
    )
    takeaway = 'Use partnerships as clues, not conclusions. The operational depth of the relationship matters far more than the headline itself.'
    bottomNotice = 'Educational content only. Partnership announcements should always be checked against official statements and actual product scope.'
    keywords = @('ripple partnerships', 'payments', 'xrp', 'liquidity', 'adoption', 'clients')
  }
  [pscustomobject]@{
    ptPath = '/artigos/parcerias-ripple-xrpl.html'
    enPath = '/en/articles/ripple-partnerships-with-xrp-and-xrpl-potential.html'
    title = 'Ripple public partnerships with potential XRP and XRPL use'
    description = 'Survey of public partnerships and how they may connect to XRP and XRPL usage, with sources and caution around direct attribution.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Adoption'
    category = 'infrastructure'
    lead = 'This article treats partnership analysis as probability mapping rather than certainty theater.'
    topNotice = 'This English page condenses the Portuguese article and preserves its explicit caution around over-attributing XRP or XRPL usage.'
    bullets = @(
      'Which public partnerships create plausible XRPL exposure.',
      'Why potential use should not be confused with confirmed use.',
      'How source discipline improves adoption analysis.'
    )
    overview = @(
      'The Portuguese original is careful on purpose. It catalogs partnerships that may connect to XRP or XRPL without claiming that every public relationship already relies on the ledger in production.',
      'That restraint is important because infrastructure adoption often moves gradually. There may be multiple layers between a corporate partnership and confirmed on-ledger activity.'
    )
    why = @(
      'This matters because overstatement damages credibility. International readers following the ecosystem need a method for separating plausible infrastructure relevance from unfounded certainty.',
      'By keeping the analysis conditional where necessary, the page remains more useful over time and less vulnerable to narrative whiplash.'
    )
    takeaway = 'The strongest adoption analysis is disciplined analysis. Public partnerships matter, but the level of confirmed XRP or XRPL involvement must be stated honestly.'
    bottomNotice = 'Educational content only. When a partnership does not explicitly confirm ledger or token usage, it should be described as potential rather than certain.'
    keywords = @('ripple partnerships', 'xrpl', 'xrp', 'sources', 'adoption', 'institutional')
  }
  [pscustomobject]@{
    ptPath = '/artigos/projetos-brasileiros-xrpl.html'
    enPath = '/en/articles/brazilian-projects-in-the-xrpl-ecosystem.html'
    title = 'Brazilian projects in the XRPL ecosystem'
    description = 'An evolving directory of Brazilian projects connected to XRPL or XRP, with official links for verification.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Brazil'
    category = 'ecosystem'
    lead = 'This page exists to give international readers a practical view of how XRPL interest appears inside Brazil beyond market commentary alone.'
    topNotice = 'This English page condenses the Portuguese directory and is intended as a verified ecosystem snapshot rather than a promotional list.'
    bullets = @(
      'Which Brazilian projects are being tracked around XRPL.',
      'Why local ecosystem mapping matters for adoption analysis.',
      'How to verify whether a project really belongs in the directory.'
    )
    overview = @(
      'The Portuguese original is structured as a developing directory, not a finished ranking. Its goal is to keep a verifiable list of Brazilian initiatives that touch XRPL, XRP, wallets, services, or education.',
      'That local lens matters because ecosystem strength is not measured only by global headlines. It is also measured by how many regional builders, services, and communities can be identified and checked.'
    )
    why = @(
      'For an English-speaking audience, this page helps reveal where Brazil appears in the broader XRPL landscape. It is a practical answer to the question: what is actually being built locally?',
      'Directories also force analytical discipline. If a project cannot be sourced, linked, or described clearly, it should not be treated as confirmed ecosystem evidence.'
    )
    takeaway = 'Regional ecosystem maps are useful because they make adoption concrete. They show whether a network is producing real local activity instead of only global narrative visibility.'
    bottomNotice = 'Educational content only. Inclusion in a directory is not an endorsement and does not remove the need for independent verification.'
    keywords = @('brazil', 'xrpl ecosystem', 'projects', 'xrp brasil', 'directory', 'community')
  }
  [pscustomobject]@{
    ptPath = '/artigos/ripple-xrp-xrpl.html'
    enPath = '/en/articles/ripple-xrp-xrpl-differences.html'
    title = 'Ripple vs XRP vs XRPL: what is the difference?'
    description = 'Clear explanation of the difference between Ripple the company, XRP the asset, and XRPL the network, with examples and correct terminology.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Concepts'
    category = 'foundations'
    lead = 'Many misunderstandings around XRP begin with vocabulary. This page exists to separate the company, the asset, and the public ledger cleanly.'
    topNotice = 'This English page condenses the Portuguese explainer into a quick-reference version for international readers.'
    bullets = @(
      'What Ripple is as a company.',
      'What XRP is as a digital asset.',
      'What XRPL is as a public network.'
    )
    overview = @(
      'The Portuguese article draws a strict line between the three terms. Ripple is a company. XRP is the native asset of the ledger. XRPL is the public network where that asset operates.',
      'That sounds basic, but it solves a surprising amount of confusion. News headlines, social posts, and even product pages often collapse those categories and create wrong assumptions about governance or ownership.'
    )
    why = @(
      'This matters because clear terminology is the foundation of every more advanced discussion, from regulation to tokenization to institutional integration.',
      'Readers who confuse the company with the network often misread what is decentralized, what is corporate, and what can change independently over time.'
    )
    takeaway = 'Start with vocabulary discipline. Once Ripple, XRP, and XRPL are separated correctly, the rest of the ecosystem becomes much easier to analyze.'
    bottomNotice = 'Educational content only. Terminology accuracy is especially important when evaluating legal claims, infrastructure announcements, and market commentary.'
    keywords = @('ripple', 'xrp', 'xrpl', 'differences', 'terminology', 'company vs network')
  }
  [pscustomobject]@{
    ptPath = '/artigos/sec-vs-ripple-xrp.html'
    enPath = '/en/articles/sec-vs-ripple-xrp.html'
    title = 'SEC vs Ripple: what was decided about XRP in the US?'
    description = 'Didactic summary of the SEC vs Ripple case, including programmatic and institutional sales and the effect on secondary-market interpretation.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Legal'
    category = 'legal'
    lead = 'The SEC vs Ripple case matters because it shaped how many market participants discuss XRP in relation to US securities law.'
    topNotice = 'This English page condenses the Portuguese legal explainer and keeps the same narrow focus on what the case actually clarified.'
    bullets = @(
      'What the court said about different categories of XRP sales.',
      'Why programmatic sales and institutional sales were treated differently.',
      'How the case affects public interpretation of XRP in secondary markets.'
    )
    overview = @(
      'The Portuguese article explains the case in a didactic way, avoiding the usual social-media shorthand. Instead of presenting a single winner-loser narrative, it separates the court''s reasoning across different transaction contexts.',
      'That distinction is essential because not all XRP sales were treated the same way. The legal analysis depended on who sold, how they sold, and in what context the sale occurred.'
    )
    why = @(
      'This matters because legal simplifications can distort both risk assessment and market discussion. Readers need to know what the case addressed directly and what remained outside its scope.',
      'For international audiences, the value of this page is not prediction. It is clarity about one of the most referenced legal events in the XRP ecosystem.'
    )
    takeaway = 'Use the case as a legal reference point, not as a meme. Its importance lies in nuance, and that nuance is exactly what many fast summaries leave out.'
    bottomNotice = 'Educational content only. This page is not legal advice and should not be used as a substitute for professional counsel or direct court-source review.'
    keywords = @('sec ripple case', 'xrp legal', 'programmatic sales', 'institutional sales', 'us regulation', 'xrp')
  }
  [pscustomobject]@{
    ptPath = '/artigos/seguranca-xrp-xrpl.html'
    enPath = '/en/articles/xrp-xrpl-security-guide.html'
    title = 'Maximum security with XRP and XRPL'
    description = 'Full security guide covering common scams, custody mistakes, operational checklists, and best practices for XRP and XRPL.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Security'
    category = 'security'
    lead = 'Security on XRPL is mostly a matter of operational discipline. The biggest risks are usually phishing, fake support, weak backups, and bad custody habits.'
    topNotice = 'This English page condenses the Portuguese security guide into a practical checklist-style summary for international readers.'
    bullets = @(
      'Which scams hit XRP users most often.',
      'How to reduce avoidable custody and recovery risk.',
      'Why simple checklists usually outperform complex security theater.'
    )
    overview = @(
      'The Portuguese guide is intentionally practical. It focuses on the kinds of mistakes that cause real losses: exposing seed phrases, trusting fake support accounts, storing backups carelessly, or using unfamiliar tools with real capital too quickly.',
      'Its broader message is that good security does not start with advanced jargon. It starts with repeatable habits and a clear understanding of what must never be shared.'
    )
    why = @(
      'This matters because crypto education often overemphasizes market timing and underemphasizes survival. A reader who cannot protect keys and verify domains is not ready for any sophisticated strategy.',
      'For many international visitors, security content is the highest-value part of a site like this because it reduces the chance of irreversible errors.'
    )
    takeaway = 'Slow down, verify everything, and treat key management as your first responsibility. On public ledgers, operational mistakes are often final.'
    bottomNotice = 'Educational content only. Neither XRP BRASIL nor legitimate wallet providers will ever ask for your seed phrase or private keys.'
    keywords = @('xrp security', 'xrpl security', 'scams', 'custody', 'seed phrase', 'checklist')
  }
  [pscustomobject]@{
    ptPath = '/artigos/semana-em-foco-etfs-iso20022.html'
    enPath = '/en/articles/week-in-focus-xrp-xrpl-etfs-iso20022.html'
    title = 'Week in focus: XRP, XRPL, ETFs, and ISO 20022'
    description = 'Weekly overview of XRP and XRPL covering ETF developments, technical progress, and the global migration toward ISO 20022.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Weekly'
    category = 'market'
    lead = 'This weekly piece takes several topics that can feel disconnected in real time and reframes them as one infrastructure narrative.'
    topNotice = 'This English page is a condensed translation of the Portuguese weekly article and highlights the main strategic connections.'
    bullets = @(
      'How ETF flow headlines and standards migration can belong to one discussion.',
      'Why technical progress on XRPL matters more when read next to payment modernization.',
      'What kind of weekly signal is worth tracking.'
    )
    overview = @(
      'The Portuguese article ties together ETF developments, ledger progress, and ISO 20022 migration not because they are identical topics, but because they all point toward the same underlying transition in finance.',
      'Instead of treating the week as a list of isolated updates, it reads it as a systems pattern: capital access, data standards, and settlement rails are evolving in parallel.'
    )
    why = @(
      'That matters because infrastructure stories are easy to miss when readers only follow one domain at a time. Payments people watch standards. Market people watch ETFs. Builders watch protocol updates. Real integration lives in the overlap.',
      'Weekly synthesis helps create that overlap for readers who want a more coherent model of what is happening.'
    )
    takeaway = 'The best weekly takeaway is not a single bullish headline. It is whether multiple parts of the financial stack continue moving in the same direction.'
    bottomNotice = 'Educational content only. Weekly synthesis should complement direct source checking, not replace it.'
    keywords = @('weekly xrp', 'xrpl', 'etfs', 'iso 20022', 'market structure', 'infrastructure')
  }
  [pscustomobject]@{
    ptPath = '/artigos/stablecoins-xrpl.html'
    enPath = '/en/articles/stablecoins-on-xrpl.html'
    title = 'Stablecoins on XRPL: how they work'
    description = 'IOUs, trustlines, examples such as RLUSD and other issued assets, plus the risks of issuer verification on XRPL.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Stablecoin'
    category = 'foundations'
    lead = 'Stablecoins on XRPL are best understood through issued assets, trustlines, and issuer credibility rather than through generic token-language imported from other chains.'
    topNotice = 'This English page condenses the Portuguese article into a practical explainer for readers who need the XRPL-specific stablecoin model.'
    bullets = @(
      'How issued assets and trustlines work on XRPL.',
      'Why issuer verification matters more than ticker symbols alone.',
      'How RLUSD fits into the broader stablecoin discussion on the ledger.'
    )
    overview = @(
      'The Portuguese article explains that many stablecoins on XRPL rely on the ledger''s issued-currency model. That means trust is explicit and local: users establish trustlines to specific issuers rather than interacting with a uniform token standard detached from issuer identity.',
      'This structure makes issuer verification central. Two assets that look similar at first glance can represent very different credit or counterparty profiles depending on who issued them and how transparent they are.'
    )
    why = @(
      'This matters because readers coming from other ecosystems can misread how XRPL handles stable value. On this ledger, understanding the issuer is part of understanding the asset.',
      'It also matters because regulated stablecoins like RLUSD are changing expectations around transparency, custody, and compliance.'
    )
    takeaway = 'On XRPL, stablecoin literacy starts with trustline literacy. Learn the issuer model first, and many other risk questions become easier to answer.'
    bottomNotice = 'Educational content only. Always verify issuer identity, reserve disclosures, and official account details before trusting any issued asset.'
    keywords = @('stablecoins', 'xrpl', 'trustlines', 'issued assets', 'rlusd', 'issuer risk')
  }
  [pscustomobject]@{
    ptPath = '/artigos/xrp-epicentro-revolucao-institucional.html'
    enPath = '/en/articles/xrp-at-the-center-of-the-institutional-shift.html'
    title = 'XRP at the center of the institutional shift'
    description = 'ETFs, real-world assets, and banking infrastructure help explain why XRP and XRPL keep appearing in the institutional cycle.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Institutional'
    category = 'infrastructure'
    lead = 'This article reads XRP not as an isolated asset story, but as a recurring intersection point between tokenization, bank rails, and regulated capital.'
    topNotice = 'This English page condenses the Portuguese article into a high-level institutional summary for international readers.'
    bullets = @(
      'Why XRP keeps reappearing in institutional-market discussions.',
      'How ETFs, RWAs, and banking rails reinforce one another.',
      'What makes the current cycle look more structural than narrative-driven.'
    )
    overview = @(
      'The Portuguese original argues that the most interesting part of the XRP conversation is not any one product, but the repeated convergence of multiple serious domains: ETFs, tokenized real-world assets, stable liquidity, and regulated payment infrastructure.',
      'In that framework, XRP is described as relevant because it sits near the moving pieces of financial modernization, especially where settlement and interoperability remain costly problems.'
    )
    why = @(
      'That matters because institutional cycles are rarely powered by retail-style excitement. They are powered by repeated signs that a network or asset can serve an operational role inside larger financial systems.',
      'The article therefore treats XRP''s relevance as a systems question rather than as a pure sentiment question.'
    )
    takeaway = 'When several regulated trends keep pointing to the same settlement layer, it becomes harder to dismiss that layer as incidental.'
    bottomNotice = 'Educational content only. Institutional relevance does not remove risk, and no single article should be used as a basis for allocation decisions.'
    keywords = @('xrp institutional', 'rwa', 'banking', 'etfs', 'infrastructure', 'xrpl')
  }
  [pscustomobject]@{
    ptPath = '/artigos/xrp-infraestrutura-destaque.html'
    enPath = '/en/articles/xrp-infrastructure-in-the-spotlight.html'
    title = 'XRP: the week infrastructure stopped being backstage'
    description = 'Weekly infrastructure panorama covering RLUSD, real XRPL usage, ETF supply absorption, and regulatory signals.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Weekly'
    category = 'market'
    lead = 'This weekly article is built around one idea: the most important XRP signals are increasingly infrastructure signals, not crowd-noise signals.'
    topNotice = 'This English page condenses the Portuguese weekly article and keeps the same infrastructure-first editorial angle.'
    bullets = @(
      'How RLUSD, ETF demand, and regulatory clarity fit together.',
      'Why on-chain and market signals are reinforcing one another.',
      'What it means when infrastructure becomes the main story.'
    )
    overview = @(
      'The Portuguese article highlights a week in which several normally separate indicators lined up: a regulated stablecoin story, stronger signs of real XRPL use, and ETF flows that suggested disciplined absorption rather than pure speculation.',
      'Its framing is deliberately different from headline chasing. Instead of asking what went viral, it asks what operational layer became more visible.'
    )
    why = @(
      'That matters because infrastructure maturity often appears first in these quieter alignments. Supply gets absorbed more methodically, regulated tools become more common, and usage looks less hypothetical.',
      'For readers outside Brazil, this page offers the site''s preferred lens for interpreting weekly XRP developments.'
    )
    takeaway = 'When infrastructure becomes the headline, the cycle is changing. That does not guarantee outcome, but it does change what deserves attention.'
    bottomNotice = 'Educational content only. Weekly commentary should be treated as analytical framing, not financial advice.'
    keywords = @('xrp weekly', 'infrastructure', 'rlusd', 'etfs', 'xrpl use', 'regulation')
  }
  [pscustomobject]@{
    ptPath = '/artigos/xrp-nova-infraestrutura-financeira-global.html'
    enPath = '/en/articles/xrp-in-the-new-global-financial-infrastructure.html'
    title = 'XRP in the new global financial infrastructure'
    description = 'ETFs, tokenization, and regulation show how XRP and XRPL connect to the new financial infrastructure taking shape globally.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Infrastructure'
    category = 'infrastructure'
    lead = 'This article brings ETFs, tokenization, regulation, and settlement design into one coherent argument about why XRPL keeps surfacing in modernization discussions.'
    topNotice = 'This English page condenses the Portuguese feature article into a strategic summary for international readers.'
    bullets = @(
      'How recurring ETF volumes changed the institutional reading of XRP.',
      'Why tokenization matters only when it reaches core financial infrastructure.',
      'Where XRP and XRPL fit in a convergence between traditional finance and public ledgers.'
    )
    overview = @(
      'The Portuguese article argues that several market and regulatory signals should no longer be read as isolated facts. Recurring ETF activity, progress in tokenization, and a clearer legal environment all point toward the same larger transition.',
      'In that transition, XRPL is presented as a ledger whose design aligns unusually well with the needs of fast settlement, bridge liquidity, and low-friction asset movement.'
    )
    why = @(
      'That matters because infrastructure relevance is usually cumulative. It does not arrive through one press release. It arrives through repeated signs that a system solves real operational constraints better than legacy layers alone.',
      'The article therefore treats XRP not as a disconnected market asset, but as part of a functional architecture being tested by the financial system itself.'
    )
    takeaway = 'The larger point is not whether finance becomes fully on-chain overnight. It is whether mature ledgers become indispensable in the parts of finance that are already modernizing.'
    bottomNotice = 'Educational content only. Readers should verify cited institutions, products, and regulatory developments through primary sources when making decisions.'
    keywords = @('xrp infrastructure', 'xrpl', 'tokenization', 'regulation', 'etfs', 'global finance')
  }
  [pscustomobject]@{
    ptPath = '/artigos/xrp-vs-btc-eth.html'
    enPath = '/en/articles/xrp-xrpl-vs-btc-and-eth.html'
    title = 'XRP and XRPL vs Bitcoin and Ethereum'
    description = 'Direct comparison of purpose, consensus, finality, fees, programmability, and common use cases across XRP, Bitcoin, and Ethereum.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Comparison'
    category = 'foundations'
    lead = 'Comparisons only become useful when they focus on design intent, not on tribal ranking exercises.'
    topNotice = 'This English page condenses the Portuguese comparison article and keeps the same practical, non-tribal framing.'
    bullets = @(
      'How XRP, Bitcoin, and Ethereum were designed for different priorities.',
      'What consensus, cost, and finality differences mean in practice.',
      'Why comparing use cases matters more than comparing slogans.'
    )
    overview = @(
      'The Portuguese article explains that Bitcoin, Ethereum, and XRPL answer different questions. Bitcoin centers monetary scarcity and proof-of-work security. Ethereum centers generalized programmability. XRPL centers fast, low-cost settlement with native exchange features.',
      'That does not make one network universally superior. It means comparisons should start from intended use and operating tradeoffs rather than from brand loyalty.'
    )
    why = @(
      'This matters because readers often inherit one-dimensional comparisons that ignore finality, energy model, on-ledger exchange design, or settlement cost.',
      'A cleaner comparison helps readers understand where XRPL fits best instead of forcing it into categories built for other systems.'
    )
    takeaway = 'Compare networks by function. When you match design choices to use cases, the differences become much more informative and much less ideological.'
    bottomNotice = 'Educational content only. Network comparisons simplify complex systems and should be treated as study aids, not absolute rankings.'
    keywords = @('xrp vs btc', 'xrp vs eth', 'xrpl comparison', 'consensus', 'fees', 'finality')
  }
  [pscustomobject]@{
    ptPath = '/artigos/xrp-xrpl-e-ripple.html'
    enPath = '/en/articles/how-ripple-xrp-and-xrpl-connect.html'
    title = 'How XRP, XRPL, and Ripple connect'
    description = 'How Ripple contributes to and uses XRP and XRPL across products, governance conversations, escrow structure, and executive influence.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Company'
    category = 'foundations'
    lead = 'The relationship between Ripple, XRP, and XRPL is close enough to matter and separate enough to require careful explanation.'
    topNotice = 'This English page condenses the Portuguese article into a clean map of how the company, asset, and network interact.'
    bullets = @(
      'Where Ripple directly intersects with XRP and XRPL.',
      'How escrow, products, and public positioning affect the discussion.',
      'Why connection does not mean identity.'
    )
    overview = @(
      'The Portuguese article explains that Ripple uses and contributes to an ecosystem that is larger than the company itself. That includes payment products, public messaging, liquidity design, and strategic influence, but it does not collapse the company into the network.',
      'It also points readers toward the structural pieces that create the strongest association, such as escrowed XRP, executive visibility, and the company''s role in institutional distribution narratives.'
    )
    why = @(
      'This matters because many readers move from "Ripple exists" to "Ripple controls everything" without understanding what parts of the system are public, what parts are corporate, and what parts sit in between.',
      'A better framework improves both technical understanding and legal or market interpretation.'
    )
    takeaway = 'The connection is real, but it is layered. Understanding those layers is more useful than forcing the ecosystem into a false either-or.'
    bottomNotice = 'Educational content only. Governance, market structure, and company influence should be evaluated through current public information, not assumptions.'
    keywords = @('ripple', 'xrp', 'xrpl', 'escrow', 'governance', 'company relationship')
  }
  [pscustomobject]@{
    ptPath = '/artigos/atualizacoes/2025-11-13.html'
    enPath = '/en/articles/archive/2025-11-13.html'
    title = 'A new milestone: the first XRP spot ETF in the US'
    description = 'Archived weekly update on the XRPC launch: debut volume, fee structure, custody, and comparison with other crypto ETFs.'
    publishedLabel = 'Published in Q4 2025'
    dateIso = $null
    tag = 'Archive'
    category = 'archive'
    lead = 'This archived update marks the point at which XRP''s ETF story became concrete enough to be discussed as market structure rather than rumor.'
    topNotice = 'Archived weekly update: this English page condenses and translates the original Portuguese edition for archive coverage.'
    bullets = @(
      'Why the first spot ETF mattered symbolically and operationally.',
      'How launch structure, fees, and custody should be read.',
      'What this milestone changed in the institutional conversation around XRP.'
    )
    overview = @(
      'The Portuguese edition focuses on the launch mechanics of the first US spot XRP ETF and why those mechanics matter more than the existence of a ticker alone.',
      'It frames the product as an opening move in a broader market transition, where regulated wrappers can change how institutions approach exposure, liquidity, and legitimacy.'
    )
    why = @(
      'This matters because milestone products often reprice perception before they reprice markets. They alter the set of tools available to conservative capital.',
      'In archive form, the page works as a historical checkpoint for readers tracking when the ETF conversation around XRP stopped being hypothetical.'
    )
    takeaway = 'Use this update as a reference point: once a regulated access product exists, the burden of discussion shifts from possibility to product quality and flow behavior.'
    bottomNotice = 'Educational content only. Archived weekly updates reflect the information available at the time of publication.'
    keywords = @('xrp spot etf', 'xrpc', 'archive', 'institutional access', 'xrp weekly')
  }
  [pscustomobject]@{
    ptPath = '/artigos/atualizacoes/2026-01-10.html'
    enPath = '/en/articles/archive/2026-01-10.html'
    title = 'Infrastructure before price: why XRP sits near the new global financial architecture'
    description = 'Archived weekly update covering ISO 20022, SWIFT, CBDCs, and tokenization as parts of a new financial architecture.'
    publishedLabel = 'Published on January 10, 2026'
    dateIso = '2026-01-10'
    tag = 'Archive'
    category = 'archive'
    lead = 'This archived edition argues that XRP should be studied as infrastructure first and only secondarily as a market instrument.'
    topNotice = 'Archived weekly update: this English page condenses and translates the original Portuguese edition.'
    bullets = @(
      'How ISO 20022, SWIFT, and CBDC discussions point toward interoperability.',
      'Why price-centric analysis can miss the deeper infrastructure shift.',
      'Where XRP and XRPL appear in that architecture story.'
    )
    overview = @(
      'The Portuguese edition presents a simple thesis: the more finance modernizes around structured messaging, tokenization, and cross-system coordination, the more valuable neutral settlement and interoperability layers become.',
      'From that perspective, XRP matters not because it replaces every legacy system, but because it can help connect systems that are otherwise expensive and slow to coordinate.'
    )
    why = @(
      'This matters because infrastructure transitions usually begin long before the market develops a clean narrative around them. The rails start changing first.',
      'As an archived weekly edition, this page shows how the site framed that transition early in 2026.'
    )
    takeaway = 'The key insight is that infrastructure relevance is often visible before price relevance becomes obvious. Serious readers should learn to see that order clearly.'
    bottomNotice = 'Educational content only. Archived commentary captures a moment in time and should be read together with newer developments.'
    keywords = @('infrastructure before price', 'xrp', 'iso 20022', 'swift', 'cbdc', 'tokenization')
  }
  [pscustomobject]@{
    ptPath = '/artigos/atualizacoes/2026-01-26.html'
    enPath = '/en/articles/archive/2026-01-26.html'
    title = 'From crypto narrative to financial infrastructure: the global pattern taking shape'
    description = 'Archived weekly update on ISO 20022, 24-7 settlement, regulated stablecoins, and the emerging role of XRP and XRPL.'
    publishedLabel = 'Published on January 26, 2026'
    dateIso = '2026-01-26'
    tag = 'Archive'
    category = 'archive'
    lead = 'This archived edition describes the moment when several parallel developments began to look less like scattered crypto headlines and more like a financial pattern.'
    topNotice = 'Archived weekly update: this English page condenses and translates the original Portuguese edition.'
    bullets = @(
      'Why 24-7 settlement and regulated stablecoins changed the conversation.',
      'How global standards and tokenization started converging visibly.',
      'What pattern the site identified before the February and May updates expanded it.'
    )
    overview = @(
      'The Portuguese edition argues that markets were starting to move from a crypto-native narrative frame to an infrastructure frame. Regulation, settlement modernization, and new forms of digital cash were converging instead of competing.',
      'That reading set up later weekly pieces by framing XRP and XRPL as participants in a broader institutional transition rather than as isolated speculative themes.'
    )
    why = @(
      'This matters because pattern recognition is central to infrastructure analysis. Individual developments can look minor until they are seen as parts of the same redesign process.',
      'In hindsight, this archived page works as a bridge between early 2026 commentary and the more explicit convergence thesis that followed.'
    )
    takeaway = 'The value of this update lies in the pattern it identifies: traditional finance and blockchain infrastructure were no longer moving on parallel tracks. They were starting to merge.'
    bottomNotice = 'Educational content only. Archived weekly editions are preserved for context and should be read alongside newer material.'
    keywords = @('financial infrastructure', 'archive', 'stablecoins', '24-7 settlement', 'xrpl', 'xrp')
  }
  [pscustomobject]@{
    ptPath = '/artigos/atualizacoes/2026-02-14.html'
    enPath = '/en/articles/archive/2026-02-14.html'
    title = 'The XRP Ledger is leaving the crypto world and entering the financial system'
    description = 'Archived weekly update on regulation, RLUSD, tokenization, and interoperability as XRPL moved from crypto narrative to financial infrastructure.'
    publishedLabel = 'Published on February 14, 2026'
    dateIso = '2026-02-14'
    tag = 'Archive'
    category = 'archive'
    lead = 'This archived edition is the direct precursor to the May 2026 feature article and lays out the original infrastructure thesis in explicit form.'
    topNotice = 'Archived weekly update: this English page condenses and translates the original Portuguese edition. The current featured article later expanded this thesis with additional evidence.'
    bullets = @(
      'How regulation, RLUSD, tokenization, and interoperability were reframed as one system story.',
      'Why XRPL was presented as infrastructure rather than as a niche crypto network.',
      'What changed in the editorial thesis before the May 2026 follow-up.'
    )
    overview = @(
      'The Portuguese edition argues that XRPL was entering a new phase. Instead of needing to prove that public-ledger settlement could work in theory, it was beginning to look like infrastructure that financial actors could actually integrate.',
      'It uses regulation, permissioned architecture, RLUSD, tokenization, and interoperability as supporting evidence for that transition. The emphasis is not on noise or speed of adoption, but on the quality of the institutional fit.'
    )
    why = @(
      'This matters because it captures the thesis before later developments like DTCC and the broader multilateral execution picture strengthened it further.',
      'For international readers, it functions as the conceptual bridge between early-2026 infrastructure commentary and the more expansive May feature article.'
    )
    takeaway = 'If you want to understand the site''s main institutional thesis, this is one of the key archive pages: XRPL was being positioned as infrastructure before the market fully absorbed that framing.'
    bottomNotice = 'Educational content only. Archived analysis reflects the information available at the time and should be read together with the later May 2026 update.'
    keywords = @('xrpl financial system', 'archive', 'rlusd', 'tokenization', 'interoperability', 'xrp')
  }
)

$currentArticle = [pscustomobject]@{
  href = '/en/articles/2026-05-02.html'
  tag = 'Highlight'
  title = 'XRP Ledger: From Promised Infrastructure to Real Integration'
  description = 'A full-length English feature on RLUSD, DTCC/NSCC, SWIFT, ETFs, tokenization, and coordinated execution between February and April 2026.'
}

foreach($article in $articles){
  $target = Join-Path $root ($article.enPath.TrimStart('/').Replace('/', '\'))
  $directory = Split-Path -Parent $target
  New-Item -ItemType Directory -Force -Path $directory | Out-Null
  ArticleHtml $article | Set-Content -Path $target -Encoding utf8
}

$featuredCards = @(
  $currentArticle,
  [pscustomobject]@{
    href = '/en/articles/archive/'
    tag = 'Archive'
    title = 'Weekly archive in English'
    description = 'Browse earlier weekly updates translated into English, from the first US XRP spot ETF milestone to the February 2026 infrastructure thesis.'
  },
  [pscustomobject]@{
    href = '/en/articles/archive/2026-02-14.html'
    tag = 'Archive'
    title = 'XRPL enters the financial system'
    description = 'The archived February 14, 2026 edition that set up the broader infrastructure thesis.'
  },
  [pscustomobject]@{
    href = '/en/articles/archive/2026-01-10.html'
    tag = 'Archive'
    title = 'Infrastructure before price'
    description = 'A January 2026 archive page on ISO 20022, SWIFT, CBDCs, and settlement architecture.'
  }
)

$foundations = $articles | Where-Object { $_.category -in @('foundations', 'ecosystem') }
$infrastructure = $articles | Where-Object { $_.category -in @('infrastructure', 'market', 'legal') }
$security = $articles | Where-Object { $_.category -eq 'security' }
$archive = $articles | Where-Object { $_.category -eq 'archive' }

$featuredHtml = ($featuredCards | ForEach-Object { CardHtml $_.href $_.tag $_.title $_.description }) -join "`n"
$foundationsHtml = ($foundations | ForEach-Object { CardHtml $_.enPath $_.tag $_.title $_.description }) -join "`n"
$infrastructureHtml = ($infrastructure | ForEach-Object { CardHtml $_.enPath $_.tag $_.title $_.description }) -join "`n"
$securityHtml = ($security | ForEach-Object { CardHtml $_.enPath $_.tag $_.title $_.description }) -join "`n"
$archiveHtml = ($archive | Sort-Object dateIso -Descending | ForEach-Object { CardHtml $_.enPath $_.tag $_.title $_.description }) -join "`n"

$articlesIndex = @"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>English articles on XRP and XRPL | XRP BRASIL</title>
    <meta name="description" content="English article hub covering guides, archive translations, infrastructure analysis, market structure, safety, and the current featured article from XRP BRASIL." />
    <meta name="robots" content="index,follow" />
    <meta name="author" content="XRP BRASIL" />
    <meta name="application-name" content="XRP BRASIL" />
    <meta name="theme-color" content="#030712" />
    <meta name="color-scheme" content="dark light" />
    <meta name="keywords" content="XRP, XRPL, English articles, infrastructure, archive, tokenization, ETF, regulation" />
    <link rel="canonical" href="$siteUrl/en/articles/" />
    <link rel="alternate" href="$siteUrl/artigos/" hreflang="pt-BR" />
    <link rel="alternate" href="$siteUrl/en/articles/" hreflang="en" />
    <link rel="alternate" href="$siteUrl/artigos/" hreflang="x-default" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="XRP BRASIL" />
    <meta property="og:title" content="English articles on XRP and XRPL | XRP BRASIL" />
    <meta property="og:description" content="English article hub covering guides, archive translations, infrastructure analysis, market structure, safety, and the current featured article from XRP BRASIL." />
    <meta property="og:url" content="$siteUrl/en/articles/" />
    <meta property="og:image" content="$siteUrl/assets/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Brasil_Xrp" />
    <meta name="twitter:title" content="English articles on XRP and XRPL | XRP BRASIL" />
    <meta name="twitter:description" content="English article hub covering guides, archive translations, infrastructure analysis, market structure, safety, and the current featured article from XRP BRASIL." />
    <meta name="twitter:image" content="$siteUrl/assets/logo.png" />
    <link rel="stylesheet" href="/assets/styles.css" />
    <link rel="icon" href="/assets/favicon.svg" />
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-NHTPCXTQRF"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-NHTPCXTQRF');
    </script>
  </head>
  <body>
$(NavHtml)
    <main class="container">
      <h1>Articles</h1>
      <p>The English section now covers the full strategic archive of the site. Current highlights remain full-length where available, while older Portuguese articles are offered in condensed English editorial versions so international readers can navigate the entire knowledge base coherently.</p>

      <section>
        <h2>Featured and weekly archive</h2>
        <div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
$featuredHtml
        </div>
      </section>

      <section>
        <h2>Foundations and ecosystem</h2>
        <div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
$foundationsHtml
        </div>
      </section>

      <section>
        <h2>Infrastructure, market structure, and regulation</h2>
        <div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
$infrastructureHtml
        </div>
      </section>

      <section>
        <h2>Security and operations</h2>
        <div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
$securityHtml
        </div>
      </section>

      <section class="notice">
        <p><strong>Editorial note:</strong> older Portuguese articles in the English archive are presented as condensed editorial translations. The current highlight remains the deepest English long-form piece on the site.</p>
      </section>
    </main>
    $(FooterHtml)
    <script src="/assets/script.js"></script>
  </body>
</html>
"@

$articlesIndex | Set-Content -Path (Join-Path $outDir 'index.html') -Encoding utf8

$archiveCards = @(
  $currentArticle
) + ($archive | Sort-Object dateIso -Descending | ForEach-Object {
  [pscustomobject]@{
    href = $_.enPath
    tag = 'Archive'
    title = $_.title
    description = $_.description
  }
})
$archiveCardsHtml = ($archiveCards | ForEach-Object { CardHtml $_.href $_.tag $_.title $_.description }) -join "`n"

$archiveIndex = @"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Weekly XRP and XRPL archive in English | XRP BRASIL</title>
    <meta name="description" content="English archive of weekly XRP and XRPL updates from XRP BRASIL, including the current highlighted edition and earlier infrastructure-focused reports." />
    <meta name="robots" content="index,follow" />
    <meta name="author" content="XRP BRASIL" />
    <meta name="application-name" content="XRP BRASIL" />
    <meta name="theme-color" content="#030712" />
    <meta name="color-scheme" content="dark light" />
    <meta name="keywords" content="XRP, XRPL, weekly archive, English updates, regulation, ETFs, tokenization" />
    <link rel="canonical" href="$siteUrl/en/articles/archive/" />
    <link rel="alternate" href="$siteUrl/artigos/atualizacoes/" hreflang="pt-BR" />
    <link rel="alternate" href="$siteUrl/en/articles/archive/" hreflang="en" />
    <link rel="alternate" href="$siteUrl/artigos/atualizacoes/" hreflang="x-default" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="XRP BRASIL" />
    <meta property="og:title" content="Weekly XRP and XRPL archive in English | XRP BRASIL" />
    <meta property="og:description" content="English archive of weekly XRP and XRPL updates from XRP BRASIL, including the current highlighted edition and earlier infrastructure-focused reports." />
    <meta property="og:url" content="$siteUrl/en/articles/archive/" />
    <meta property="og:image" content="$siteUrl/assets/logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Brasil_Xrp" />
    <meta name="twitter:title" content="Weekly XRP and XRPL archive in English | XRP BRASIL" />
    <meta name="twitter:description" content="English archive of weekly XRP and XRPL updates from XRP BRASIL, including the current highlighted edition and earlier infrastructure-focused reports." />
    <meta name="twitter:image" content="$siteUrl/assets/logo.png" />
    <link rel="stylesheet" href="/assets/styles.css" />
    <link rel="icon" href="/assets/favicon.svg" />
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-NHTPCXTQRF"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-NHTPCXTQRF');
    </script>
  </head>
  <body>
$(NavHtml)
    <main class="container">
      <h1>Weekly archive</h1>
      <p>This archive gathers the site's dated weekly updates in English. The current feature remains available as a full English long-form article, while earlier editions are offered as condensed translations for archive continuity.</p>
      <div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
$archiveCardsHtml
      </div>
    </main>
    $(FooterHtml)
    <script src="/assets/script.js"></script>
  </body>
</html>
"@

$archiveIndex | Set-Content -Path (Join-Path $archiveDir 'index.html') -Encoding utf8

$searchEntries = @(
  @{
    title = 'XRP BRASIL in English'
    description = 'English home page with translated guides, articles, tools, glossary, tracker pages, and practical context.'
    url = '/en/'
    category = 'Home'
    keywords = @('xrp', 'xrpl', 'english', 'home')
  },
  @{
    title = "Beginner's guide to XRP and XRPL"
    description = 'Start from zero with XRP, XRPL, safety, testnet practice, and the right study path.'
    url = '/en/pages/guide.html'
    category = 'Guides'
    keywords = @('guide', 'beginner', 'security', 'xrp', 'xrpl')
  },
  @{
    title = 'XRPL explained'
    description = 'Accounts, consensus, DEX, AMM, issued assets, trustlines, and validators.'
    url = '/en/pages/xrpl.html'
    category = 'Guides'
    keywords = @('xrpl', 'consensus', 'amm', 'dex', 'validators')
  },
  @{
    title = 'About XRP BRASIL'
    description = 'Mission, editorial principles, and the educational focus of the project.'
    url = '/en/pages/about.html'
    category = 'About'
    keywords = @('about', 'mission', 'editorial', 'xrp brasil')
  },
  @{
    title = 'What is XRP?'
    description = 'Quick explanation of XRP, its role on XRPL, and basic safety points for new readers.'
    url = '/en/pages/what-is-xrp.html'
    category = 'Guides'
    keywords = @('xrp', 'what is xrp', 'basics', 'payments')
  },
  @{
    title = 'What is XRPL?'
    description = 'Quick explanation of the XRP Ledger, native features, and practical use cases.'
    url = '/en/pages/what-is-xrpl.html'
    category = 'Guides'
    keywords = @('xrpl', 'what is xrpl', 'consensus', 'amm', 'dex')
  },
  @{
    title = 'XRPL step by step'
    description = 'Create a testnet account, inspect it on XRPScan, and send your first transaction.'
    url = '/en/pages/xrpl-step-by-step.html'
    category = 'Guides'
    keywords = @('testnet', 'xrpscan', 'first transaction', 'xrpl tutorial')
  },
  @{
    title = 'XRPL activity tracker'
    description = 'Real-time dashboard for DEX activity, liquidity rhythm, and exchange balances.'
    url = '/en/pages/xrpl-tracker.html'
    category = 'Metrics'
    keywords = @('tracker', 'dex', 'liquidity', 'activity', 'exchange balances')
  },
  @{
    title = 'English articles hub'
    description = 'English article hub covering current features, archive translations, infrastructure analysis, and safety guides.'
    url = '/en/articles/'
    category = 'Articles'
    keywords = @('articles', 'english', 'archive', 'xrp', 'xrpl')
  },
  @{
    title = 'Weekly archive in English'
    description = 'English archive of weekly XRP and XRPL updates from XRP BRASIL.'
    url = '/en/articles/archive/'
    category = 'Archive'
    keywords = @('weekly archive', 'english updates', 'xrp', 'xrpl')
  },
  @{
    title = 'XRP Ledger: From Promised Infrastructure to Real Integration'
    description = 'RLUSD, DTCC/NSCC, SWIFT, ETFs, tokenization, privacy, and convergence between February and April 2026.'
    url = '/en/articles/2026-05-02.html'
    category = 'Updates'
    keywords = @('rlusd', 'dtcc', 'swift', 'etf', 'tokenization', 'xrp', 'xrpl')
  },
  @{
    title = 'English glossary'
    description = 'Essential definitions for XRP, XRPL, trustlines, validators, and more.'
    url = '/en/glossary/'
    category = 'Glossary'
    keywords = @('glossary', 'trustline', 'validator', 'amm', 'dex')
  },
  @{
    title = 'XRP/XRPL tools'
    description = 'Curated list of explorers, wallets, documentation, and developer resources.'
    url = '/en/tools/'
    category = 'Tools'
    keywords = @('tools', 'explorer', 'wallet', 'documentation', 'faucet')
  },
  @{
    title = 'XRPL metrics'
    description = 'Educational dashboard with price, volume, and on-chain activity indicators.'
    url = '/en/metrics/'
    category = 'Metrics'
    keywords = @('metrics', 'price', 'volume', 'accounts', 'on-chain')
  },
  @{
    title = 'XRP BRASIL newsletter'
    description = 'Weekly summary of guides, articles, and ecosystem developments.'
    url = '/en/newsletter/'
    category = 'Newsletter'
    keywords = @('newsletter', 'weekly summary', 'updates', 'xrpl')
  },
  @{
    title = 'Technical e-book'
    description = 'Technical e-book about settlement infrastructure, interoperability, and value transfer on XRPL.'
    url = '/en/ebook/'
    category = 'E-book'
    keywords = @('ebook', 'settlement', 'interoperability', 'xrpl', 'infrastructure')
  }
)

foreach($article in $articles){
  $category = if($article.category -eq 'archive') { 'Archive' } else { 'Articles' }
  $searchEntries += @{
    title = $article.title
    description = $article.description
    url = $article.enPath
    category = $category
    keywords = $article.keywords
  }
}

$searchEntries | ConvertTo-Json -Depth 5 | Set-Content -Path $searchIndexPath -Encoding utf8
