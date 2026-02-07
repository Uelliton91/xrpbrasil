# XRP BRASIL - Portal educacional sobre XRP/XRPL

Este repositorio contem o site estatico do XRP BRASIL.

- Conteudo: educacional, sem recomendacoes financeiras
- Propriedade intelectual: todos os direitos reservados ao proprietario do projeto. Nenhuma licenca de redistribuicao e concedida.
- Contribuicoes: apenas via solicitacao previa por e-mail.

## Desenvolvimento local

Requisitos: Python 3

```bash
# na raiz do projeto
python -m http.server 8000 --bind 0.0.0.0
# abrir: http://localhost:8000/
```

## Publicacao (Cloudflare Pages)

- O repositorio esta conectado ao Cloudflare Pages; cada `git push` em `main` gera um deploy automatico.
- Para subir manualmente use o Wrangler: `wrangler pages deploy . --project-name <nome-do-projeto>`.
- Depois do deploy, limpe o cache no painel (Caching > Purge Everything) para evitar versao antiga.
- O rastreador de corretoras usa KV `EXCHANGE_HISTORY`. O binding ja esta no `wrangler.toml`.
- O historico 7d/30d grava 1 ponto por dia (BRT); aparece apos alguns dias de coleta.

## Atualizacao semanal (Destaque)

1. Edite `artigos/atualizacao-semanal.html` com a nova edicao.
2. Para arquivar a anterior: mova para `artigos/atualizacoes/AAAA-MM-DD.html` e liste em `artigos/atualizacoes/index.html`.

## Seguranca

- Links externos `rel="noopener"`.
- Sem formularios/login - site estatico.

## SEO basico

- Atualize titulos, descricoes e o `sitemap.xml` sempre que criar paginas relevantes.
- Envie `https://xrpbrasil.com.br/sitemap.xml` no Google Search Console (menu Sitemaps) e use Inspecao de URL para solicitar indexacao da home, guia, XRPL e artigos principais.
- Depois do deploy, rode PageSpeed Insights/Lighthouse para checar LCP, INP e CLS.

Contato: contato@xrpbrasil.com.br
