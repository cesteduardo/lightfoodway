(() => {
  const hero = document.querySelector('.home-hero');
  const titulo = document.querySelector('#home-hero-title');
  const descricao = document.querySelector('#home-hero-descricao');
  const grupo = document.querySelector('.home-hero__pontos');
  if (!hero || !titulo || !descricao || !grupo) return;

  const destaques = [
    {
      primeira: 'Comida de verdade para deixar',
      segunda: 'sua rotina ',
      enfase: 'mais leve',
      descricao: 'Refeições práticas, saborosas e ultracongeladas para você ter mais facilidade no dia a dia, sem abrir mão da qualidade.'
    },
    {
      primeira: 'Não é apenas congelado',
      segunda: '',
      enfase: 'É ultracongelado',
      descricao: 'Um processo diferente do congelamento convencional, pensado para preservar as características dos alimentos e levar mais praticidade para a sua rotina.'
    },
    {
      primeira: 'Um sabor para',
      segunda: '',
      enfase: 'cada momento',
      descricao: 'Caseirinhos, Frango, Bovina, Peixes, Massas, Maromba, Veggie, Sopas, Sucos, Salgados e Pizzas.'
    },
    {
      primeira: 'Tem uma Light Food Way',
      segunda: '',
      enfase: 'perto de você',
      descricao: 'Encontre a unidade mais próxima, consulte o cardápio e faça seu pedido.'
    }
  ];

  const pontos = Array.from(grupo.querySelectorAll('[data-home-hero-ponto]'));
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  let atual = 0;
  let temporizador;

  function mascara(texto, enfase = '') {
    const bloco = document.createElement('span');
    bloco.className = 'home-hero__mask';
    const linha = document.createElement('span');
    linha.className = 'home-hero__rise';
    linha.append(document.createTextNode(texto));
    if (enfase) {
      const em = document.createElement('em');
      em.textContent = enfase;
      linha.append(em);
    }
    bloco.append(linha);
    return bloco;
  }

  function mostrar(indice) {
    if (indice === atual) return;
    atual = indice;
    const destaque = destaques[atual];
    titulo.replaceChildren(mascara(destaque.primeira), document.createTextNode(' '), mascara(destaque.segunda, destaque.enfase));
    descricao.textContent = destaque.descricao;
    descricao.classList.remove('home-hero__intro');
    void descricao.offsetWidth;
    descricao.classList.add('home-hero__intro');
    pontos.forEach((ponto, i) => {
      const ativo = i === atual;
      ponto.classList.toggle('is-ativo', ativo);
      ponto.setAttribute('aria-pressed', String(ativo));
    });
  }

  function parar() {
    clearTimeout(temporizador);
  }

  function programar() {
    parar();
    if (movimentoReduzido.matches || document.hidden || hero.matches(':hover') || hero.contains(document.activeElement)) return;
    temporizador = setTimeout(() => {
      mostrar((atual + 1) % destaques.length);
      programar();
    }, 6000);
  }

  pontos.forEach((ponto, indice) => ponto.addEventListener('click', () => {
    mostrar(indice);
    programar();
  }));
  hero.addEventListener('mouseenter', parar);
  hero.addEventListener('mouseleave', programar);
  hero.addEventListener('focusin', parar);
  hero.addEventListener('focusout', () => setTimeout(programar, 0));
  document.addEventListener('visibilitychange', programar);
  movimentoReduzido.addEventListener?.('change', programar);

  grupo.hidden = false;
  programar();
})();
