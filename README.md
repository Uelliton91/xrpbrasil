# XRP BRASIL - Portal educacional sobre XRP/XRPL

Este repositório contém o site estático do XRP BRASIL.

- Conteúdo: educacional, sem recomendações financeiras
- Propriedade intelectual: todos os direitos reservados ao proprietário do projeto. Nenhuma licença de redistribuição é concedida.
- Contribuições: apenas via solicitação prévia por e-mail.

## Desenvolvimento local

Requisitos: Python 3

```bash
# na raiz do projeto
python -m http.server 8000 --bind 0.0.0.0
# abrir: http://localhost:8000/
```

## Publicação (Netlify)

- Build command: (vazio)
- Publish directory: `/` (raiz)
- Arquivo `netlify.toml` define cabeçalhos de segurança, cache de assets e 404.

## Atualização semanal (Destaque)

1. Edite `artigos/atualizacao-semanal.html` com a nova edição.
2. Para arquivar a anterior: mova para `artigos/atualizacoes/AAAA-MM-DD.html` e liste em `artigos/atualizacoes/index.html`.

## Segurança

- Links externos `rel="noopener"`.
- Cabeçalhos HTTP (CSP, X-Content-Type-Options, etc.) via `netlify.toml`.
- Sem formulários/login - site estático.

## SEO e sitemap

- Gere/atualize as meta tags padronizadas executando `python scripts/apply_seo_meta.py`.
- Recrie o arquivo `sitemap.xml` sempre que adicionar páginas com `python scripts/generate_sitemap.py` e envie o sitemap para o Search Console.

Contato: contato@xrpbrasil.com.br
