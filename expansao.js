/* Página de expansão: botões de WhatsApp + formulário de qualificação */
(() => {
  // ====== CONFIGURAÇÃO ======
  // Número do WhatsApp da equipe de expansão: só dígitos, com 55 + DDD (ex.: "5511999999999").
  // Enquanto estiver vazio, os botões de WhatsApp abrem um e-mail para expansao@lightfoodway.com.br.
  const WHATSAPP_EXPANSAO = "5517991458142";
  const MENSAGEM_WHATSAPP = "Olá! Vi no site a oportunidade de expansão da Light Food Way e gostaria de receber mais informações sobre como levar a marca para minha cidade.";
  // Para onde vão os cadastros. FormSubmit envia cada cadastro por e-mail (no 1º envio chega um
  // e-mail de ativação para esse endereço — basta clicar em "Activate Form" uma vez).
  const ENDPOINT = "https://formsubmit.co/ajax/expansao@lightfoodway.com.br";
  const EMAIL = "expansao@lightfoodway.com.br";
  // ==========================

  const linkWhats = (extra) => {
    const texto = extra ? `${MENSAGEM_WHATSAPP}\n\n${extra}` : MENSAGEM_WHATSAPP;
    if (WHATSAPP_EXPANSAO) return `https://wa.me/${WHATSAPP_EXPANSAO}?text=${encodeURIComponent(texto)}`;
    return `mailto:${EMAIL}?subject=${encodeURIComponent("Expansão Light Food Way")}&body=${encodeURIComponent(texto)}`;
  };
  const atualizarBotoes = (extra) => document.querySelectorAll("[data-whatsapp]").forEach((a) => {
    a.href = linkWhats(extra);
    if (!WHATSAPP_EXPANSAO) { a.removeAttribute("target"); }
  });
  atualizarBotoes();

  const form = document.querySelector("[data-form-expansao]");
  if (!form) return;
  const area = document.querySelector("[data-form-area]");
  const sucesso = document.querySelector("[data-form-sucesso]");
  const status = form.querySelector("[data-form-status]");

  // Máscara de telefone (00) 00000-0000
  const tel = form.querySelector("[data-mascara-tel]");
  tel.addEventListener("input", () => {
    const d = tel.value.replace(/\D/g, "").slice(0, 11);
    let v = d;
    if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) v = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    tel.value = v;
  });

  const msgs = {
    nome: "Informe seu nome completo.",
    whatsapp: "Informe um WhatsApp com DDD.",
    email: "Informe um e-mail válido.",
    cidade: "Informe sua cidade.",
    estado: "Selecione o estado.",
    cidade_operacao: "Informe a cidade onde pretende abrir a operação.",
  };
  const erroDe = (el) => el.closest(".exp-campo").querySelector("[data-erro]");
  const marcar = (el, msg) => {
    const e = erroDe(el);
    if (msg) { e.textContent = msg; e.hidden = false; } else { e.textContent = ""; e.hidden = true; }
    if (el.matches("fieldset")) {
      el.toggleAttribute("data-invalido", !!msg);
    } else {
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) el.setAttribute("aria-describedby", e.id || (e.id = `${el.id}-erro`));
    }
  };
  const validarCampo = (el) => {
    let ok = el.checkValidity();
    if (el.name === "whatsapp") ok = el.value.replace(/\D/g, "").length >= 10;
    if (el.name === "nome") ok = ok && el.value.trim().split(/\s+/).length >= 2;
    marcar(el, ok ? "" : msgs[el.name]);
    return ok;
  };
  const validarGrupo = (fs) => {
    const ok = !!fs.querySelector("input:checked");
    marcar(fs, ok ? "" : "Escolha uma opção.");
    return ok;
  };

  const campos = [...form.querySelectorAll("input:not([type=radio]):not([name=_honey]), select")];
  const grupos = [...form.querySelectorAll("[data-grupo]")];
  campos.forEach((el) => {
    el.addEventListener("blur", () => { if (el.value) validarCampo(el); });
    el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") validarCampo(el); });
    el.addEventListener("change", () => { if (el.getAttribute("aria-invalid") === "true") validarCampo(el); });
  });
  grupos.forEach((fs) => fs.addEventListener("change", () => validarGrupo(fs)));

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    status.textContent = ""; status.removeAttribute("data-tipo");
    const okCampos = campos.map(validarCampo);
    const okGrupos = grupos.map(validarGrupo);
    if (okCampos.includes(false) || okGrupos.includes(false)) {
      const primeiro = campos.find((el) => el.getAttribute("aria-invalid") === "true")
        || grupos.find((g) => g.hasAttribute("data-invalido"))?.querySelector("input");
      primeiro?.focus();
      status.dataset.tipo = "erro";
      status.textContent = "Confira os campos destacados.";
      return;
    }
    if (form._honey.value) return; // robô

    const d = Object.fromEntries(new FormData(form));
    delete d._honey;
    const dados = {
      "Nome": d.nome,
      "WhatsApp": d.whatsapp,
      "E-mail": d.email,
      "Cidade / UF": `${d.cidade} / ${d.estado}`,
      "Cidade da operação": d.cidade_operacao,
      "Quando pretende iniciar": d.inicio,
      "Capital disponível": d.capital,
      "Já possui negócio": d.possui_negocio,
      _subject: `Novo interessado na expansão — ${d.cidade_operacao}`,
      _replyto: d.email,
      _template: "table",
      _captcha: "false",
    };

    form.setAttribute("aria-busy", "true");
    status.textContent = "Enviando…";
    try {
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(dados),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.success === false || j.success === "false") throw new Error(j.message || r.status);
      atualizarBotoes(`Meu nome é ${d.nome}, tenho interesse em ${d.cidade_operacao}.`);
      area.hidden = true;
      sucesso.hidden = false;
      sucesso.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      sucesso.focus({ preventScroll: true });
    } catch (e) {
      status.dataset.tipo = "erro";
      status.innerHTML = `Não foi possível enviar agora. Tente novamente ou <a href="${linkWhats()}">fale direto com a expansão</a>.`;
    } finally {
      form.removeAttribute("aria-busy");
    }
  });
})();
