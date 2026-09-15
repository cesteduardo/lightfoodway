(() => {
  const linhas = {
    caseirinhos: {
      titulo: 'Caseirinhos',
      descricao: 'Refeições com combinações familiares, como carne ou frango acompanhados de arroz, feijão e legumes',
      prato: 'Caseirinho bovino com picadinho de carne, arroz, feijão e farofa',
      imagem: 'assets/img/linhas/oficial/caseirinhos-produto.jpg',
      fonte: 'https://lightfoodway.com.br/produtos-caseirinhos/'
    },
    frango: {
      titulo: 'Frango',
      descricao: 'Pratos com frango em preparações variadas, incluindo escondidinho, estrogonofe, curry e filé com legumes',
      prato: 'Estrogonofe de frango com batata, arroz integral e brócolis',
      imagem: 'assets/img/linhas/oficial/frango-produto.jpg',
      fonte: 'https://lightfoodway.com.br/produtos-aves/'
    },
    bovina: {
      titulo: 'Bovinas',
      descricao: 'Opções com carne bovina, de escondidinho e carne desfiada a estrogonofe e bolo de carne',
      prato: 'Estrogonofe de carne com arroz integral, batata e brócolis',
      imagem: 'assets/img/linhas/oficial/bovina-produto.jpg',
      fonte: 'https://lightfoodway.com.br/produtos-carnes/'
    },
    peixes: {
      titulo: 'Peixes',
      descricao: 'Refeições com tilápia, salmão ou cação, combinados com acompanhamentos e molhos diferentes',
      prato: 'Salmão ao molho de maracujá com arroz negro e brócolis',
      imagem: 'assets/img/linhas/oficial/peixes-produto.jpg',
      fonte: 'https://lightfoodway.com.br/produtos-peixes/'
    },
    massas: {
      titulo: 'Massas',
      descricao: 'Lasanha, nhoque, panqueca e penne para quem quer variar a refeição sem abrir mão da praticidade',
      prato: 'Lasanha à bolonhesa com peito de peru',
      imagem: 'assets/img/linhas/oficial/massas-produto.jpg',
      fonte: 'https://lightfoodway.com.br/produtos-massas/'
    },
    maromba: {
      titulo: 'Maromba',
      descricao: 'Combinações de frango em cubos ou patinho moído com purê de batata-doce ou mandioquinha',
      prato: 'Frango em cubos com purê de batata-doce',
      imagem: 'assets/img/linhas/oficial/maromba-produto.jpg',
      fonte: 'https://lightfoodway.com.br/produtos-marombas/'
    },
    veggie: {
      titulo: 'Veggie',
      descricao: 'Pratos sem carne com grão-de-bico, lentilha, soja e legumes, incluindo estrogonofe e feijoada vegana',
      prato: 'Estrogonofe de grão-de-bico com arroz integral, brócolis e batata',
      imagem: 'assets/img/linhas/oficial/veggie-produto.jpg',
      fonte: 'https://lightfoodway.com.br/produtos-veggie/'
    },
    sopas: {
      titulo: 'Sopas',
      descricao: 'Sopas e caldos com receitas como canja, cabotiá com carne desfiada e couve-flor com alho-poró',
      prato: 'Sopa de cabotiá com carne desfiada e couve',
      imagem: 'assets/img/linhas/oficial/sopas-produto.jpg',
      fonte: 'https://lightfoodway.com.br/produtos-sopas/'
    },
    sucos: {
      titulo: 'Sucos',
      descricao: 'Sucos prensados a frio para acompanhar a refeição ou refrescar outros momentos do dia',
      prato: 'Sucos Light Food Way',
      imagem: 'assets/img/linhas/oficial/sucos.webp',
      fonte: 'https://lightfoodway.com.br/sucos/'
    },
    extras: {
      titulo: 'Doces, Salgados e Pizzas',
      descricao: 'Opções para um lanche ou uma sobremesa, incluindo pizzas, salgados e doces da marca',
      prato: 'Pizza margherita',
      imagem: 'assets/img/linhas/oficial/extras-produto.webp',
      fonte: 'https://lightfoodway.com.br/pizzas/'
    }
  };

  if (!document.querySelector('[data-linha-popup]') || !window.HTMLDialogElement || !('showModal' in HTMLDialogElement.prototype)) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'linha-modal';
  dialog.setAttribute('aria-labelledby', 'linha-modal-titulo');
  dialog.innerHTML = `
    <button class="linha-modal__fechar" type="button" aria-label="Fechar detalhes da linha">×</button>
    <div class="linha-modal__conteudo">
      <div class="linha-modal__media"><img class="linha-modal__imagem" alt=""></div>
      <div class="linha-modal__texto">
        <h2 id="linha-modal-titulo"></h2>
        <p class="linha-modal__descricao"></p>
        <p class="linha-modal__prato"></p>
        <div class="linha-modal__acoes">
          <a class="linha-modal__unidades" href="unidades.html">Encontrar uma unidade <span aria-hidden="true">↗</span></a>
          <a class="linha-modal__fonte" target="_blank" rel="noopener noreferrer">Ver produtos no site oficial</a>
        </div>
      </div>
    </div>`;
  document.body.append(dialog);

  const imagem = dialog.querySelector('.linha-modal__imagem');
  const titulo = dialog.querySelector('#linha-modal-titulo');
  const descricao = dialog.querySelector('.linha-modal__descricao');
  const prato = dialog.querySelector('.linha-modal__prato');
  const fonte = dialog.querySelector('.linha-modal__fonte');
  let opener = null;

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-linha-popup]');
    if (!link) return;
    const linha = linhas[link.closest('[data-linha]')?.dataset.linha];
    if (!linha) return;
    event.preventDefault();
    event.stopPropagation();
    opener = link;
    titulo.textContent = linha.titulo;
    descricao.textContent = linha.descricao;
    prato.textContent = `Na foto: ${linha.prato}`;
    imagem.src = linha.imagem;
    imagem.alt = linha.prato + ' da Light Food Way';
    fonte.href = linha.fonte;
    dialog.showModal();
  }, true);

  dialog.querySelector('.linha-modal__fechar').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
})();
