/* =========================================================
   LIGHT FOOD WAY — unidades.js
   Base de unidades + mapa interativo (UF → cidade → unidade),
   busca por cidade/estado/CEP e busca por geolocalização.

   >>> SUBSTITUIR os registros de exemplo abaixo pela base real
       da rede. Estrutura de cada unidade documentada no README.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. BASE DE UNIDADES (dados de exemplo) ---------- */
  const UNIDADES = [
    { id:'sp-moema',      cidade:'São Paulo',      uf:'SP', bairro:'Moema',            endereco:'Av. Exemplo, 1200 — Moema, São Paulo/SP',        horario:'Seg a Sáb, 9h às 20h | Dom, 9h às 14h', whatsapp:'5511999990001', ifood:'https://www.ifood.com.br/', maps:'https://maps.google.com/?q=Light+Food+Way+Moema', lat:-23.6006, lng:-46.6650 },
    { id:'sp-pinheiros',  cidade:'São Paulo',      uf:'SP', bairro:'Pinheiros',        endereco:'Rua Exemplo, 340 — Pinheiros, São Paulo/SP',     horario:'Seg a Sáb, 9h às 20h',                  whatsapp:'5511999990002', ifood:'https://www.ifood.com.br/', maps:'https://maps.google.com/?q=Light+Food+Way+Pinheiros', lat:-23.5629, lng:-46.7010 },
    { id:'sp-campinas',   cidade:'Campinas',       uf:'SP', bairro:'Cambuí',           endereco:'Av. Exemplo, 55 — Cambuí, Campinas/SP',          horario:'Seg a Sáb, 9h às 19h',                  whatsapp:'5519999990003', ifood:'',                          maps:'https://maps.google.com/?q=Light+Food+Way+Campinas', lat:-22.8956, lng:-47.0553 },
    { id:'rj-barra',      cidade:'Rio de Janeiro', uf:'RJ', bairro:'Barra da Tijuca',  endereco:'Av. Exemplo, 900 — Barra da Tijuca, Rio de Janeiro/RJ', horario:'Seg a Sáb, 9h às 20h',           whatsapp:'5521999990004', ifood:'https://www.ifood.com.br/', maps:'https://maps.google.com/?q=Light+Food+Way+Barra', lat:-23.0045, lng:-43.3650 },
    { id:'rj-tijuca',     cidade:'Rio de Janeiro', uf:'RJ', bairro:'Tijuca',           endereco:'Rua Exemplo, 210 — Tijuca, Rio de Janeiro/RJ',   horario:'Seg a Sáb, 9h às 19h',                  whatsapp:'5521999990005', ifood:'',                          maps:'https://maps.google.com/?q=Light+Food+Way+Tijuca', lat:-22.9243, lng:-43.2320 },
    { id:'mg-savassi',    cidade:'Belo Horizonte', uf:'MG', bairro:'Savassi',          endereco:'Rua Exemplo, 77 — Savassi, Belo Horizonte/MG',   horario:'Seg a Sáb, 9h às 20h',                  whatsapp:'5531999990006', ifood:'https://www.ifood.com.br/', maps:'https://maps.google.com/?q=Light+Food+Way+Savassi', lat:-19.9386, lng:-43.9345 },
    { id:'df-asa-sul',    cidade:'Brasília',       uf:'DF', bairro:'Asa Sul',          endereco:'CLS 000, Bloco A — Asa Sul, Brasília/DF',        horario:'Seg a Sáb, 9h às 20h',                  whatsapp:'5561999990007', ifood:'https://www.ifood.com.br/', maps:'https://maps.google.com/?q=Light+Food+Way+Brasilia', lat:-15.8267, lng:-47.9218 },
    { id:'pr-batel',      cidade:'Curitiba',       uf:'PR', bairro:'Batel',            endereco:'Av. Exemplo, 480 — Batel, Curitiba/PR',          horario:'Seg a Sáb, 9h às 19h',                  whatsapp:'5541999990008', ifood:'',                          maps:'https://maps.google.com/?q=Light+Food+Way+Curitiba', lat:-25.4372, lng:-49.2900 },
    { id:'rs-moinhos',    cidade:'Porto Alegre',   uf:'RS', bairro:'Moinhos de Vento', endereco:'Rua Exemplo, 150 — Moinhos de Vento, Porto Alegre/RS', horario:'Seg a Sáb, 9h às 19h',            whatsapp:'5551999990009', ifood:'https://www.ifood.com.br/', maps:'https://maps.google.com/?q=Light+Food+Way+Porto+Alegre', lat:-30.0247, lng:-51.2050 },
    { id:'sc-centro',     cidade:'Florianópolis',  uf:'SC', bairro:'Centro',           endereco:'Rua Exemplo, 22 — Centro, Florianópolis/SC',     horario:'Seg a Sáb, 9h às 19h',                  whatsapp:'5548999990010', ifood:'',                          maps:'https://maps.google.com/?q=Light+Food+Way+Florianopolis', lat:-27.5954, lng:-48.5480 },
    { id:'ba-barra',      cidade:'Salvador',       uf:'BA', bairro:'Barra',            endereco:'Av. Exemplo, 1000 — Barra, Salvador/BA',         horario:'Seg a Sáb, 9h às 20h',                  whatsapp:'5571999990011', ifood:'https://www.ifood.com.br/', maps:'https://maps.google.com/?q=Light+Food+Way+Salvador', lat:-13.0100, lng:-38.5320 },
    { id:'pe-boaviagem',  cidade:'Recife',         uf:'PE', bairro:'Boa Viagem',       endereco:'Av. Exemplo, 640 — Boa Viagem, Recife/PE',       horario:'Seg a Sáb, 9h às 20h',                  whatsapp:'5581999990012', ifood:'https://www.ifood.com.br/', maps:'https://maps.google.com/?q=Light+Food+Way+Recife', lat:-8.1200, lng:-34.9000 },
    { id:'ce-aldeota',    cidade:'Fortaleza',      uf:'CE', bairro:'Aldeota',          endereco:'Rua Exemplo, 310 — Aldeota, Fortaleza/CE',       horario:'Seg a Sáb, 9h às 19h',                  whatsapp:'5585999990013', ifood:'',                          maps:'https://maps.google.com/?q=Light+Food+Way+Fortaleza', lat:-3.7370, lng:-38.5010 },
    { id:'go-setor-bueno',cidade:'Goiânia',        uf:'GO', bairro:'Setor Bueno',      endereco:'Av. Exemplo, 900 — Setor Bueno, Goiânia/GO',     horario:'Seg a Sáb, 9h às 19h',                  whatsapp:'5562999990014', ifood:'https://www.ifood.com.br/', maps:'https://maps.google.com/?q=Light+Food+Way+Goiania', lat:-16.7050, lng:-49.2720 }
  ];

  /* ---------- 2. ESTADOS (nomes e fallback para a malha) ---------- */
  const UFS = {
    RR:{n:'Roraima',c:3,r:1},            AP:{n:'Amapá',c:5,r:1},
    AM:{n:'Amazonas',c:2,r:2},           PA:{n:'Pará',c:4,r:2},     MA:{n:'Maranhão',c:5,r:2},  CE:{n:'Ceará',c:6,r:2},   RN:{n:'Rio Grande do Norte',c:7,r:2},
    AC:{n:'Acre',c:1,r:3},               TO:{n:'Tocantins',c:4,r:3},PI:{n:'Piauí',c:5,r:3},     PE:{n:'Pernambuco',c:6,r:3}, PB:{n:'Paraíba',c:7,r:3},
    RO:{n:'Rondônia',c:2,r:4},           MT:{n:'Mato Grosso',c:3,r:4}, GO:{n:'Goiás',c:4,r:4},  BA:{n:'Bahia',c:5,r:4},   SE:{n:'Sergipe',c:6,r:4}, AL:{n:'Alagoas',c:7,r:4},
    MS:{n:'Mato Grosso do Sul',c:3,r:5}, DF:{n:'Distrito Federal',c:4,r:5}, MG:{n:'Minas Gerais',c:5,r:5}, ES:{n:'Espírito Santo',c:6,r:5},
    PR:{n:'Paraná',c:3,r:6},             SP:{n:'São Paulo',c:4,r:6}, RJ:{n:'Rio de Janeiro',c:5,r:6},
    RS:{n:'Rio Grande do Sul',c:2,r:7},  SC:{n:'Santa Catarina',c:3,r:7}
  };

  /* ---------- 3. ELEMENTOS ---------- */
  const grade    = document.querySelector('[data-mapa]');
  const painel   = document.querySelector('[data-painel]');
  const titulo   = document.querySelector('[data-painel-titulo]');
  const contagem = document.querySelector('[data-painel-contagem]');
  const form     = document.querySelector('[data-busca]');
  const input    = document.querySelector('[data-busca-input]');
  const btnGeo   = document.querySelector('[data-geo]');
  const statusEl = document.querySelector('[data-busca-status]');
  if (!painel) return;

  let ufAtiva = null;

  /* ---------- 4. HELPERS ---------- */
  const ICO = {
    pin:    '<path d="M12 21s6.5-5.6 6.5-10.3A6.5 6.5 0 0 0 5.5 10.7C5.5 15.4 12 21 12 21Z"/><circle cx="12" cy="10.5" r="2.4"/>',
    relogio:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7v5.3l3.3 2"/>',
    chat:   '<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l.9-4.4A8 8 0 1 1 20 12Z"/>',
    moto:   '<circle cx="5.5" cy="17" r="3"/><circle cx="18.5" cy="17" r="3"/><path d="M8.5 17h7l-4-7H8m6.5 7 3-9h2"/>',
    bussola:'<circle cx="12" cy="12" r="8.6"/><path d="m15 9-2 4.5L8.5 15 10.5 10 15 9Z"/>',
    seta:   '<path d="M5 12h14m-6-6 6 6-6 6"/>'
  };
  const icone = (n) => '<svg class="icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    ICO[n] + '</svg>';

  // Escapa tudo que vai para innerHTML — inclusive o termo digitado pelo usuário
  // e a resposta do ViaCEP.
  const esc = (t) => String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const normaliza = (t) => (t || '').toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  const distanciaKm = (a, b, c, d) => {
    const R = 6371, rad = (x) => (x * Math.PI) / 180;
    const dLat = rad(c - a), dLng = rad(d - b);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(dLng / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.sqrt(h)));
  };

  const aviso = (msg, tipo) => {
    if (!statusEl) return;
    statusEl.textContent = msg || '';
    if (tipo) statusEl.dataset.tipo = tipo;
    else delete statusEl.dataset.tipo;
  };

  /* ---------- 5. RENDERIZAÇÃO ---------- */
  function cardUnidade(u) {
    const acoes = [];
    if (u.whatsapp) acoes.push('<a class="btn btn--primario btn--pequeno" href="https://wa.me/' +
      encodeURIComponent(u.whatsapp) + '" target="_blank" rel="noopener">Pedir no WhatsApp</a>');
    if (u.ifood) acoes.push('<a class="btn btn--secundario btn--pequeno" href="' + esc(u.ifood) +
      '" target="_blank" rel="noopener">Pedir no iFood</a>');
    if (u.maps) acoes.push('<a class="link-seta" href="' + esc(u.maps) +
      '" target="_blank" rel="noopener">Como chegar ' + icone('seta') + '</a>');

    const titulo = 'Light Food Way — ' + (u.bairro ? u.bairro + ', ' : '') + u.cidade;

    return '<article class="unidade-card">' +
      '<div class="unidade-card__topo">' +
        '<h3>' + esc(titulo) + '</h3>' +
        '<span class="unidade-card__uf">' + esc(u.uf) + '</span>' +
      '</div>' +
      '<ul class="unidade-card__info">' +
        '<li>' + icone('pin') + '<span>' + esc(u.endereco) + '</span></li>' +
        '<li>' + icone('relogio') + '<span>' + esc(u.horario) + '</span></li>' +
        (u.whatsapp ? '<li>' + icone('chat') + '<span>Atendimento por WhatsApp</span></li>' : '') +
        (u.ifood ? '<li>' + icone('moto') + '<span>Pedidos pelo iFood</span></li>' : '') +
        (u.distancia != null ? '<li>' + icone('bussola') + '<span>A cerca de ' +
          esc(u.distancia) + ' km de você</span></li>' : '') +
      '</ul>' +
      '<div class="unidade-card__acoes">' + acoes.join('') + '</div>' +
    '</article>';
  }

  function mostrar(lista, rotulo) {
    if (titulo) titulo.textContent = rotulo;
    if (contagem) contagem.textContent = lista.length === 1 ? '1 unidade' : lista.length + ' unidades';

    painel.innerHTML = lista.length
      ? lista.map(cardUnidade).join('')
      : '<div class="vazio">' +
          '<p><strong>Ainda não temos unidade nessa busca.</strong></p>' +
          '<p>Tente outra cidade ou estado — a rede Light Food Way está em expansão.</p>' +
        '</div>';
  }

  /* ---------- 6. MAPA ---------- */
  function montarMapa() {
    if (!grade) return;
    const comUnidade = new Set(UNIDADES.map((u) => u.uf));
    const mapa = window.MAPA_BRASIL;

    if (mapa && mapa.paths) {
      const estados = Object.keys(mapa.paths).map((sigla) => {
        const tem = comUnidade.has(sigla);
        const qtd = UNIDADES.filter((u) => u.uf === sigla).length;
        const nome = mapa.nomes[sigla] || UFS[sigla].n;
        const rotulo = nome + (tem ? ' — ' + qtd + (qtd === 1 ? ' unidade' : ' unidades') : ' — em breve');
        const marca = mapa.marcas[sigla];
        return '<g class="uf' + (tem ? ' tem-unidade' : '') + '" data-uf="' + sigla + '"' +
          ' role="button" tabindex="' + (tem ? '0' : '-1') + '" aria-disabled="' + String(!tem) + '"' +
          ' aria-label="' + esc(rotulo) + '"><title>' + esc(rotulo) + '</title>' +
          '<path d="' + mapa.paths[sigla] + '"></path></g>';
      }).join('');
      grade.innerHTML = '<svg class="mapa__svg" viewBox="0 0 ' + mapa.w + ' ' + mapa.h +
        '" role="img" aria-label="Mapa interativo do Brasil">' + estados + '</svg>';
    } else {
      grade.innerHTML = Object.keys(UFS).map((sigla) => '<button type="button" class="uf" data-uf="' +
        sigla + '">' + sigla + '</button>').join('');
    }

    grade.addEventListener('click', (e) => {
      const botao = e.target.closest('.uf.tem-unidade');
      if (botao) selecionarUF(botao.dataset.uf);
    });
    grade.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.uf.tem-unidade')) {
        e.preventDefault();
        selecionarUF(e.target.dataset.uf);
      }
    });
  }

  function selecionarUF(sigla) {
    ufAtiva = sigla;
    if (grade) grade.querySelectorAll('.uf').forEach((b) => {
      const ativo = b.dataset.uf === sigla;
      b.classList.toggle('is-ativo', ativo);
      if (ativo) b.setAttribute('aria-pressed', 'true'); else b.removeAttribute('aria-pressed');
    });
    const lista = UNIDADES.filter((u) => u.uf === sigla)
      .sort((a, b) => a.cidade.localeCompare(b.cidade, 'pt-BR'));
    mostrar(lista, 'Unidades em ' + (UFS[sigla] ? UFS[sigla].n : sigla));
    aviso('');
    if (window.innerWidth <= 1100) {
      painel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* ---------- 7. BUSCA POR TEXTO / CEP ---------- */
  async function buscar(termo) {
    const cru = (termo || '').trim();
    if (!cru) { limparUF(); mostrar(UNIDADES, 'Todas as unidades'); aviso(''); return; }

    const cep = cru.replace(/\D/g, '');
    if (/^\d{8}$/.test(cep)) {
      aviso('Buscando pelo CEP…');
      try {
        const ctrl = new AbortController();
        const limite = setTimeout(() => ctrl.abort(), 8000);
        const r = await fetch('https://viacep.com.br/ws/' + cep + '/json/', { signal: ctrl.signal });
        clearTimeout(limite);
        if (!r.ok) throw new Error('resposta inválida');
        const dados = await r.json();
        if (dados.erro) { aviso('CEP não encontrado. Tente pela cidade.', 'erro'); return; }
        const lista = UNIDADES.filter((u) =>
          normaliza(u.cidade) === normaliza(dados.localidade) || u.uf === dados.uf);
        limparUF();
        aviso('');
        mostrar(lista, 'Unidades perto de ' + dados.localidade + '/' + dados.uf);
      } catch (e) {
        aviso('Não foi possível consultar o CEP agora. Tente pela cidade ou estado.', 'erro');
      }
      return;
    }

    const t = normaliza(cru);
    const lista = UNIDADES.filter((u) =>
      normaliza(u.cidade).includes(t) ||
      normaliza(u.bairro).includes(t) ||
      normaliza(u.uf) === t ||
      normaliza(UFS[u.uf] && UFS[u.uf].n).includes(t) ||
      normaliza(u.endereco).includes(t)
    );
    limparUF();
    aviso('');
    mostrar(lista, 'Resultados para “' + cru + '”');
  }

  function limparUF() {
    ufAtiva = null;
    if (grade) grade.querySelectorAll('.uf.is-ativo').forEach((b) => {
      b.classList.remove('is-ativo');
      b.removeAttribute('aria-pressed');
    });
  }

  /* ---------- 8. GEOLOCALIZAÇÃO ---------- */
  function usarMinhaLocalizacao() {
    if (!navigator.geolocation) {
      aviso('Seu navegador não permite localização automática. Busque pela cidade.', 'erro');
      return;
    }
    aviso('Localizando você…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const lista = UNIDADES
          .map((u) => Object.assign({}, u, {
            distancia: distanciaKm(coords.latitude, coords.longitude, u.lat, u.lng)
          }))
          .sort((a, b) => a.distancia - b.distancia)
          .slice(0, 6);
        limparUF();
        aviso('');
        mostrar(lista, 'Unidades mais próximas de você');
      },
      () => aviso('Não conseguimos acessar sua localização. Busque pela cidade ou CEP.', 'erro'),
      { timeout: 10000, maximumAge: 300000 }
    );
  }

  /* ---------- 9. INICIALIZAÇÃO ---------- */
  montarMapa();
  mostrar(UNIDADES, 'Todas as unidades');

  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    buscar(input ? input.value : '');
  });
  if (btnGeo) btnGeo.addEventListener('click', usarMinhaLocalizacao);

  // Abre a página já filtrada: unidades.html?uf=SP
  const paramUF = new URLSearchParams(location.search).get('uf');
  if (paramUF && UFS[paramUF.toUpperCase()]) selecionarUF(paramUF.toUpperCase());
})();
