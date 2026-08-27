# Light Food Way — Site Institucional

Site estático (HTML + CSS + JS puro, sem build) voltado ao consumidor final,
montado a partir de `NOVO SITE INSTITUCIONAL — LIGHT FOOD WAY.docx` e `BANNERS.docx`.

## Arquivos

```
site/
├── index.html                    Home (hierarquia do item 29 do briefing)
├── nossas-linhas.html            Portfólio com filtros por linha
├── como-funciona.html            Passos + ultracongelamento + dúvidas rápidas
├── unidades.html                 Mapa interativo + busca por cidade/CEP/localização
├── sobre.html                    História, propósito e valores
├── faq.html                      12 dúvidas frequentes
├── politica-de-privacidade.html  Estrutura mínima LGPD (pendente de jurídico)
├── termos-de-uso.html            Estrutura mínima (pendente de jurídico)
├── expansao.html                 Placeholder do link discreto de franquia
├── robots.txt · sitemap.xml
└── assets/
    ├── css/style.css             Design system completo
    ├── js/main.js                Header, menu, carrossel, FAQ, filtros, reveal
    ├── js/unidades.js            Base de unidades + mapa + buscas
    └── img/                      banners/ · linhas/ · logo · favicon
```

Para visualizar, rode um servidor local dentro de `site/`:
`python3 -m http.server` (a busca por CEP usa `fetch`; abrir via `file://` bloqueia).

## Direção visual

Estilo "healthy food": fundo creme, seções em blocos arredondados que flutuam sobre
ele, cantos generosos, formas orgânicas suaves, ícones em traço (SVG inline, sem
emoji) e tipografia display de peso alto (Bricolage Grotesque) contra corpo em Inter.

### Paleta oficial

| Token | Hex | Uso |
|---|---|---|
| `--branco` | `#FEFEFE` | Superfícies (cards, header, blocos claros) |
| `--lima` | `#99C441` | CTA principal, destaques em títulos, ícones ativos |
| `--oliva` | `#6B8B61` | Apoio e variação de blocos |
| `--preto` | `#000000` | Base do texto |
| `--verde-900` | `#2B562C` | Hero, blocos escuros, rodapé |

Tons derivados (`--lima-100`, `--verde-500`, `--creme`…) existem só para estados,
fundos e hierarquia — todos na mesma família. O botão primário é lima com texto
verde-escuro: lima com texto branco reprovaria em contraste.

## O que está funcionando

- **Carrossel do hero** com os 4 banners: rotação de 7s, setas, contador `← 1/4 →`,
  pontos, swipe (ignorando gestos verticais), pausa em hover/foco/aba oculta e
  respeito a `prefers-reduced-motion`. **O primeiro slide já vem visível no HTML** —
  sem JS o hero continua legível.
- **Versão vertical dos banners no mobile** (`banner-N-mobile.jpg`), trocada por media query.
- **Mapa de unidades** em tiles por UF: estados com unidade são clicáveis
  (UF → cidades → card com endereço, horário, WhatsApp e iFood).
- **Busca** por cidade, estado, bairro ou CEP (ViaCEP, com timeout) e por
  geolocalização, ordenando pelas mais próximas com distância em km.
- **FAQ em acordeão** acessível, filtros de linhas, menu mobile em pílula,
  reveal on scroll com rede de segurança, CTA fixo no rodapé da tela no mobile.
- **Franquias apenas no rodapé**, como link discreto, conforme o briefing.
- Acessibilidade: um `<h1>` por página, skip link, foco visível, `aria-*` nos
  componentes interativos, `scroll-padding-top` para as âncoras não sumirem sob o header.

## Pendências antes de publicar

1. **Fotos reais** em `assets/img/`:
   - `banners/banner-1..4.jpg` (~1920×1080) e `banners/banner-1..4-mobile.jpg` (~1080×1440);
   - `linhas/<slug>.jpg` — slugs: `caseirinhos`, `frango`, `bovina`, `peixes`,
     `massas`, `maromba`, `veggie`, `sopas`, `sucos`, `extras`;
   - `og-lightfoodway.jpg` (1200×630).
   Sem foto, o card exibe a marca d'água "Light Food Way" (não quebra o layout).
2. **Base real de unidades** em `assets/js/unidades.js` (hoje 14 registros de exemplo):
   ```js
   { id:'sp-moema', cidade:'São Paulo', uf:'SP', bairro:'Moema',
     endereco:'…', horario:'…', whatsapp:'5511999990001',
     ifood:'https://…', maps:'https://…', lat:-23.6006, lng:-46.6650 }
   ```
   `whatsapp` só com dígitos, formato internacional; `ifood` vazio esconde o botão.
   A página aceita `unidades.html?uf=SP` para abrir já filtrada.
3. **Depoimentos reais** na prova social da home.
4. **Redação jurídica** de privacidade e termos; a LP de franquias substitui `expansao.html`.
5. **Validação técnica/nutricional** das afirmações "zero lactose", "sem glúten",
   "sem conservantes" e dos benefícios do ultracongelamento (item 31 do briefing).
6. Trocar `SITE_URL` em `build_site.py` se o domínio final for outro (afeta canonical,
   Open Graph e sitemap).

## Manutenção

As páginas são estáticas, mas geradas por `../build_site.py`, que centraliza header,
rodapé, banners, linhas, diferenciais, passos, FAQ e blocos repetidos. Para mudanças
que afetam várias páginas, edite o script e rode `python3 build_site.py` — ele
reescreve os nove HTMLs, o `robots.txt` e o `sitemap.xml`. Alterações feitas
direto no HTML são perdidas na próxima geração.

### Duas armadilhas já corrigidas — cuidado ao editar

- **Matemática CSS precisa de espaços**: `clamp(2rem,1rem+2vw,3rem)` é inválido e o
  navegador descarta a declaração inteira, em silêncio. Escreva `1rem + 2vw`.
- **Conteúdo injetado via `innerHTML` precisa ser escapado**: o termo digitado na
  busca e a resposta do ViaCEP passam por `esc()` em `unidades.js`. Mantenha assim.
