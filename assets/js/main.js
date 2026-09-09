/* =========================================================
   LIGHT FOOD WAY — main.js
   Header, menu mobile, carrossel, FAQ, filtros, reveal
   ========================================================= */
(function () {
  'use strict';

  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- HEADER ---------- */
  const header = document.querySelector('[data-header]');
  if (header) {
    const aoRolar = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
  }

  /* ---------- MENU MOBILE ---------- */
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (toggle && nav) {
    const definir = (aberto) => {
      nav.classList.toggle('is-aberto', aberto);
      toggle.setAttribute('aria-expanded', String(aberto));
      toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('menu-aberto', aberto);
    };
    const fechar = () => definir(false);

    toggle.addEventListener('click', () => definir(!nav.classList.contains('is-aberto')));
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', fechar));

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !nav.classList.contains('is-aberto')) return;
      fechar();
      toggle.focus();
    });
    // Clique fora fecha o menu
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('is-aberto')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      fechar();
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 1320) fechar(); });
  }

  /* ---------- CARROSSEL DO HERO ---------- */
  const carrossel = document.querySelector('[data-carrossel]');
  if (carrossel) {
    const slides = Array.from(carrossel.querySelectorAll('[data-slide]'));
    const pontos = Array.from(carrossel.querySelectorAll('[data-ponto]'));
    const contador = carrossel.querySelector('[data-contador]');
    const INTERVALO = 7000;

    // Fundos dos slides 2+ só carregam depois do load: o slide 1 já vem
    // no HTML (preload + fetchpriority=high) e não pode disputar banda
    // com ele durante o carregamento inicial.
    const carregarFundosOciosos = () => {
      carrossel.querySelectorAll('[data-bg]').forEach((fundo) => {
        fundo.style.backgroundImage = `url('${fundo.dataset.bg}')`;
        fundo.removeAttribute('data-bg');
      });
    };
    if (document.readyState === 'complete') carregarFundosOciosos();
    else window.addEventListener('load', carregarFundosOciosos);
    let atual = 0;
    let timer = null;

    const ir = (i) => {
      atual = (i + slides.length) % slides.length;
      slides.forEach((s, k) => {
        const ativo = k === atual;
        s.classList.toggle('is-ativo', ativo);
        s.setAttribute('aria-hidden', String(!ativo));
        // Links de slides ocultos ficam fora da ordem de tabulação
        s.querySelectorAll('a, button').forEach((f) => {
          if (ativo) f.removeAttribute('tabindex');
          else f.setAttribute('tabindex', '-1');
        });
      });
      pontos.forEach((p, k) => {
        p.classList.toggle('is-ativo', k === atual);
        p.setAttribute('aria-current', k === atual ? 'true' : 'false');
      });
      if (contador) contador.textContent = (atual + 1) + ' / ' + slides.length;
    };

    const parar = () => { if (timer) { clearInterval(timer); timer = null; } };
    const tocar = () => {
      parar();
      if (reduzMovimento.matches) return;
      timer = setInterval(() => ir(atual + 1), INTERVALO);
    };

    const prev = carrossel.querySelector('[data-prev]');
    const next = carrossel.querySelector('[data-next]');
    if (prev) prev.addEventListener('click', () => { ir(atual - 1); tocar(); });
    if (next) next.addEventListener('click', () => { ir(atual + 1); tocar(); });
    pontos.forEach((p, k) => p.addEventListener('click', () => { ir(k); tocar(); }));

    carrossel.addEventListener('mouseenter', parar);
    carrossel.addEventListener('mouseleave', tocar);
    carrossel.addEventListener('focusin', parar);
    carrossel.addEventListener('focusout', tocar);
    document.addEventListener('visibilitychange', () => (document.hidden ? parar() : tocar()));
    reduzMovimento.addEventListener('change', tocar);

    carrossel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { ir(atual - 1); tocar(); }
      if (e.key === 'ArrowRight') { ir(atual + 1); tocar(); }
    });

    // Swipe (ignora gestos majoritariamente verticais, que são rolagem)
    let x0 = null, y0 = null;
    carrossel.addEventListener('touchstart', (e) => {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    carrossel.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { ir(atual + (dx < 0 ? 1 : -1)); tocar(); }
      x0 = y0 = null;
    }, { passive: true });

    ir(0);
    tocar();
  }

  /* ---------- FAQ (acordeão) ---------- */
  document.querySelectorAll('[data-faq]').forEach((faq) => {
    const abrir = (item, aberto) => {
      const resposta = item.querySelector('.faq__resposta');
      const botao = item.querySelector('.faq__pergunta');
      item.classList.toggle('is-aberto', aberto);
      botao.setAttribute('aria-expanded', String(aberto));
      resposta.style.maxHeight = aberto ? resposta.scrollHeight + 'px' : '';
    };

    faq.querySelectorAll('.faq__pergunta').forEach((botao) => {
      botao.addEventListener('click', () => {
        const item = botao.closest('.faq__item');
        const abrindo = !item.classList.contains('is-aberto');
        faq.querySelectorAll('.faq__item.is-aberto').forEach((o) => o !== item && abrir(o, false));
        abrir(item, abrindo);
      });
    });

    // Recalcula a altura ao redimensionar (o texto pode mudar de número de linhas)
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        faq.querySelectorAll('.faq__item.is-aberto').forEach((item) => {
          item.querySelector('.faq__resposta').style.maxHeight =
            item.querySelector('.faq__resposta').scrollHeight + 'px';
        });
      }, 150);
    });
  });

  /* ---------- FILTROS DE LINHAS ---------- */
  const filtros = document.querySelector('[data-filtros]');
  if (filtros) {
    const itens = Array.from(document.querySelectorAll('[data-linha]'));
    filtros.addEventListener('click', (e) => {
      const botao = e.target.closest('.filtro');
      if (!botao) return;
      filtros.querySelectorAll('.filtro').forEach((b) => {
        const ativo = b === botao;
        b.classList.toggle('is-ativo', ativo);
        b.setAttribute('aria-pressed', String(ativo));
      });
      const alvo = botao.dataset.filtro;
      itens.forEach((item) => {
        item.hidden = !(alvo === 'todas' || item.dataset.linha === alvo);
      });
    });
  }

  /* ---------- FOTOS AUSENTES ---------- */
  // Enquanto as fotos reais não são adicionadas, o card mostra a marca d'água
  // em vez de um ícone de imagem quebrada.
  document.querySelectorAll('[data-foto]').forEach((img) => {
    const falhou = () => {
      const foto = img.closest('.linha-card__foto');
      if (foto) foto.classList.add('sem-foto');
      img.remove();
    };
    img.addEventListener('error', falhou);
    if (img.complete && img.naturalWidth === 0) falhou();
  });

  /* ---------- REVEAL ON SCROLL ---------- */
  const alvos = document.querySelectorAll('.revela');
  if (alvos.length) {
    if (!('IntersectionObserver' in window) || reduzMovimento.matches) {
      alvos.forEach((el) => el.classList.add('is-visivel'));
    } else {
      const obs = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add('is-visivel');
          obs.unobserve(entrada.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
      alvos.forEach((el, i) => {
        el.style.setProperty('--revela-atraso', (i % 4) * 65 + 'ms');
        obs.observe(el);
      });
      // Rede de segurança: se por algum motivo o observer não disparar,
      // nada pode ficar invisível para sempre.
      setTimeout(() => alvos.forEach((el) => el.classList.add('is-visivel')), 2500);
    }
  }

  /* ---------- ANO NO RODAPÉ ---------- */
  document.querySelectorAll('[data-ano]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
