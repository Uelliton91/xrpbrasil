$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$siteUrl = 'https://xrpbrasil.com.br'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

. (Join-Path $PSScriptRoot 'build-en-articles.ps1')

function Update-BilingualHead {
  param(
    [Parameter(Mandatory = $true)][string]$RelativePath,
    [Parameter(Mandatory = $true)][string]$PtCanonicalPath,
    [Parameter(Mandatory = $true)][string]$EnPath
  )

  $fullPath = Join-Path $root ($RelativePath.Replace('/', '\'))
  if(-not (Test-Path $fullPath)){
    return
  }

  $content = [System.IO.File]::ReadAllText($fullPath, [System.Text.Encoding]::UTF8)
  $ptUrl = if($PtCanonicalPath -match '^https?://'){ $PtCanonicalPath } else { $siteUrl + $PtCanonicalPath }
  $enUrl = if($EnPath -match '^https?://'){ $EnPath } else { $siteUrl + $EnPath }

$alternateBlock = @"
    <link rel="alternate" href="$ptUrl" hreflang="pt-BR" />
    <link rel="alternate" href="$enUrl" hreflang="en" />
    <link rel="alternate" href="$ptUrl" hreflang="x-default" />
"@ + "`r`n"

  $alternateRegex = [regex]::new(
    '\s*<link rel="alternate" href="[^"]+" hreflang="(pt-BR|en|x-default)" \/>\r?\n?',
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
  )
  $content = $alternateRegex.Replace($content, '')

  if($content -match '<link rel="canonical" href="([^"]+)" \/>'){
    $canonicalRegex = [regex]::new(
      '<link rel="canonical" href="[^"]+" \/>',
      [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )
    $content = $canonicalRegex.Replace(
      $content,
      "<link rel=`"canonical`" href=`"$ptUrl`" />`r`n$alternateBlock",
      1
    )
  } else {
    $insertAfter = $null
    if($content -match '<meta name="description" content="[^"]*" \/>'){
      $insertAfter = '<meta name="description" content="[^"]*" \/>'
    } elseif($content -match '<meta name="viewport" content="[^"]*" \/>'){
      $insertAfter = '<meta name="viewport" content="[^"]*" \/>'
    } else {
      $insertAfter = '<meta charset="utf-8" \/>'
    }

    $insertRegex = [regex]::new(
      $insertAfter,
      [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )
    $content = $insertRegex.Replace(
      $content,
      ('$0' + "`r`n" + "    <link rel=`"canonical`" href=`"$ptUrl`" />" + "`r`n" + $alternateBlock),
      1
    )
  }

  [System.IO.File]::WriteAllText($fullPath, $content, $utf8NoBom)
}

foreach($article in $articles){
  Update-BilingualHead -RelativePath $article.ptPath.TrimStart('/') -PtCanonicalPath $article.ptPath -EnPath $article.enPath
}

$extraMappings = @(
  @{ file = 'artigos/atualizacoes/2026-05-02.html'; pt = '/artigos/atualizacoes/2026-05-02.html'; en = '/en/articles/2026-05-02.html' },
  @{ file = 'artigos/atualizacao-semanal.html'; pt = '/artigos/atualizacoes/2026-05-02.html'; en = '/en/articles/2026-05-02.html' },
  @{ file = 'artigos/atualizacao-semanal/index.html'; pt = '/artigos/atualizacoes/2026-05-02.html'; en = '/en/articles/2026-05-02.html' },
  @{ file = 'artigos/atualizacoes/index.html'; pt = '/artigos/atualizacoes/'; en = '/en/articles/archive/' },
  @{ file = 'artigos/atualizacoes/2026-01-10/index.html'; pt = '/artigos/atualizacoes/2026-01-10.html'; en = '/en/articles/archive/2026-01-10.html' }
)

foreach($mapping in $extraMappings){
  Update-BilingualHead -RelativePath $mapping.file -PtCanonicalPath $mapping.pt -EnPath $mapping.en
}
