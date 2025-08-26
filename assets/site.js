// Menú móvil
(function () {
  const toggle = document.getElementById("mobileToggle");
  const menu = document.getElementById("mobileMenu");
  if (!toggle || !menu) return;

  toggle.setAttribute("aria-controls", "mobileMenu");
  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", () => {
    const isHidden = menu.classList.toggle("hidden");
    toggle.setAttribute("aria-expanded", String(!isHidden));
  });
})();

// Dropdown “Más recursos”
(function () {
  const btn = document.getElementById("resourcesBtn");
  const menu = document.getElementById("resourcesMenu");
  if (!btn || !menu) return;

  const icon = btn.querySelector("svg");
  let open = false;

  const setOpen = (value) => {
    open = value;
    btn.setAttribute("aria-expanded", String(open));
    menu.dataset.open = open ? "true" : "false";
    if (icon) icon.style.transform = open ? "rotate(180deg)" : "rotate(0deg)";
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!open);
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();

// Carrusel de testimonios (auto-rotativo sin controles)
(function () {
  const slides = Array.from(
    document.querySelectorAll("[data-testimonial-slide]")
  );
  if (!slides.length) return;

  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0;

  const show = (k) => {
    slides.forEach((el, j) => {
      const active = j === k;
      el.classList.toggle("opacity-100", active);
      el.classList.toggle("opacity-0", !active);
      el.classList.toggle("pointer-events-none", !active);
    });
  };

  show(i);
  if (reduce) return;

  setInterval(() => {
    i = (i + 1) % slides.length;
    show(i);
  }, 5000);
})();

(function () {
  const video = document.getElementById("heroVideo");
  const btn = document.getElementById("heroPlay");
  if (!video || !btn) return;

  const update = () => {
    // oculto el botón mientras se reproduce
    btn.style.display = video.paused ? "grid" : "none";
    btn.setAttribute(
      "aria-label",
      video.paused ? "Reproducir video" : "Pausar video"
    );
  };

  // intento autoplay (muted) y sincronizo estado
  video.play().catch(() => {
    /* algunos navegadores bloquean, el botón quedará visible */
  });
  update();

  video.addEventListener("play", update);
  video.addEventListener("pause", update);

  btn.addEventListener("click", () => {
    if (video.paused) {
      // en el primer click, si querés con sonido, desmutealo:
      // video.muted = false;
      video.play();
    } else {
      video.pause();
    }
  });
})();

// Misión y Visión: colapsable en mobile
(function () {
  const box = document.getElementById("mvText");
  const fade = document.getElementById("mvFade");
  const btn = document.getElementById("mvToggle");
  if (!box || !btn) return;

  function setCollapsed(collapsed) {
    box.dataset.collapsed = collapsed ? "true" : "false";
    if (collapsed) {
      fade?.classList.remove("hidden");
      btn.textContent = "Leer más";
    } else {
      fade?.classList.add("hidden");
      btn.textContent = "Ver menos";
    }
  }

  function applyByBreakpoint() {
    // En desktop siempre expandido; en mobile inicia colapsado
    if (window.matchMedia("(min-width: 768px)").matches) {
      setCollapsed(false);
      btn.classList.add("hidden");
    } else {
      setCollapsed(true);
      btn.classList.remove("hidden");
    }
  }

  applyByBreakpoint();
  window.addEventListener("resize", applyByBreakpoint);
  btn.addEventListener("click", () => {
    setCollapsed(box.dataset.collapsed !== "true" ? true : false);
  });
})();

// Suscripción Discover
(function () {
  const form = document.getElementById("subscribeForm");
  if (!form) return;

  const emailInput = document.getElementById("subscribeEmail");
  const msg = document.getElementById("subscribeMsg");
  const btn = document.getElementById("subscribeBtn");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const isBot = form.querySelector('input[name="company"]').value !== "";
    if (isBot) return;

    if (!EMAIL_RE.test(email)) {
      msg.textContent = "Ingresá un email válido.";
      msg.className = "mt-2 text-xs text-red-600";
      emailInput.focus();
      return;
    }

    btn.disabled = true;
    msg.textContent = "Enviando…";
    msg.className = "mt-2 text-xs text-neutral-500";

    try {
      // Opción A — serverless propio:
      const res = await fetch("https://formspree.io/f/xzzapqkw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Error de red");
      msg.textContent = "¡Listo! Te contactaremos pronto 👋";
      msg.className = "mt-2 text-xs text-green-700";
      form.reset();
    } catch (err) {
      msg.textContent =
        "Tuvimos un problema. Intentá de nuevo en unos minutos.";
      msg.className = "mt-2 text-xs text-red-600";
    } finally {
      btn.disabled = false;
    }
  });
})();

// Contacto (Formspree)
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const messageInput = document.getElementById("contactMessage");
  const terms = document.getElementById("contactTerms");
  const msg = document.getElementById("contactMsg");
  const btn = document.getElementById("contactBtn");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // honeypot
    const isBot = form.querySelector('input[name="company"]').value !== "";
    if (isBot) return;

    // validaciones
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (name.length < 2) {
      msg.textContent = "Ingresá tu nombre.";
      msg.className = "mt-3 text-xs text-red-600";
      nameInput.focus();
      return;
    }
    if (!EMAIL_RE.test(email)) {
      msg.textContent = "Ingresá un email válido.";
      msg.className = "mt-3 text-xs text-red-600";
      emailInput.focus();
      return;
    }
    if (message.length < 5) {
      msg.textContent = "Escribí un mensaje un poco más completo.";
      msg.className = "mt-3 text-xs text-red-600";
      messageInput.focus();
      return;
    }
    if (!terms.checked) {
      msg.textContent = "Debés aceptar los Términos.";
      msg.className = "mt-3 text-xs text-red-600";
      terms.focus();
      return;
    }

    // estado UI
    btn.disabled = true;
    msg.textContent = "Enviando…";
    msg.className = "mt-3 text-xs text-neutral-500";

    try {
      const res = await fetch("https://formspree.io/f/xzzapqkw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          source: "contact-form",
          page: window.location.href,
        }),
      });

      if (!res.ok) throw new Error("Network error");

      msg.textContent = "¡Gracias! Te responderemos pronto 👋";
      msg.className = "mt-3 text-xs text-green-700";
      form.reset();
    } catch (error) {
      msg.textContent = "Tuvimos un problema. Intentá de nuevo en unos minutos.";
      msg.className = "mt-3 text-xs text-red-600";
    } finally {
      btn.disabled = false;
    }
  });
})();

// ===== EQUIPO: render desde JSON =====
(function renderTeam() {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;

  const PLACEHOLDER =
    '<div class="flex h-full w-full items-center justify-center text-neutral-400">' +
    '<svg class="h-10 w-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14h18ZM5 5h14v9l-3.6-3.6a2 2 0 0 0-2.8 0L9 14l-2-2-2 2V5Z"/></svg></div>';

  const ICONS = {
    linkedin:
      '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3 8h3.9v13H3zM14.5 8A5.5 5.5 0 0 1 20 13.5V21h-3.9v-6.2c0-1.7-.9-2.8-2.4-2.8s-2.5 1.1-2.5 2.8V21H7.3V8H11v1.9C11.6 9.2 13 8 14.5 8z"/></svg>',
    x:
      '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M3 3h4.3l4.2 6 4.7-6H21l-7.3 9.2L21 21h-4.3l-4.6-6.4L7 21H3l7.6-9.7z"/></svg>',
    site:
      '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2c2.8 0 5.3 1.5 6.7 3.8H5.3A8 8 0 0 1 12 4Zm0 16a8 8 0 0 1-6.7-3.8h13.4A8 8 0 0 1 12 20Zm-7-6a7.9 7.9 0 0 1 0-4h14a7.9 7.9 0 0 1 0 4H5Z"/></svg>'
  };

  const card = (m) => {
    // article
    const a = document.createElement('article');
    a.className = 'grid grid-cols-[140px,1fr] items-start gap-5 sm:grid-cols-[200px,1fr]';

    // figure
    const fig = document.createElement('figure');
    fig.className = 'aspect-square rounded-2xl border bg-neutral-200 overflow-hidden';
    if (m.photo) {
      const img = document.createElement('img');
      img.src = m.photo;
      img.alt = m.name || 'Foto de miembro del equipo';
      img.className = 'h-full w-full object-cover';
      img.loading = 'lazy';
      fig.appendChild(img);
    } else {
      fig.innerHTML = PLACEHOLDER;
    }

    // texto
    const info = document.createElement('div');

    const h3 = document.createElement('h3');
    h3.className = 'text-lg font-semibold';
    h3.textContent = m.name || '';

    const role = document.createElement('p');
    role.className = 'text-sm text-neutral-500';
    role.textContent = m.role || '';

    const bio = document.createElement('p');
    bio.className = 'mt-3 text-sm text-neutral-700';
    bio.textContent = m.bio || '';

    // links
    const socials = document.createElement('div');
    socials.className = 'mt-3 flex items-center gap-3 text-neutral-700';
    (m.links ? Object.entries(m.links) : []).forEach(([key, url]) => {
      if (!ICONS[key] || !url) return;
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.ariaLabel = key;
      a.className = 'hover:text-neutral-900';
      a.innerHTML = ICONS[key];
      socials.appendChild(a);
    });

    info.append(h3, role, bio, socials);
    a.append(fig, info);
    return a;
  };

  // Intenta cargar JSON externo, si falla usa inline (opcional)
  async function loadData() {
    try {
      const res = await fetch('/assets/data/team.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudo cargar team.json');
      return await res.json();
    } catch {
      const inline = document.getElementById('team-data');
      return inline ? JSON.parse(inline.textContent) : [];
    }
  }

  loadData().then((list) => {
    grid.innerHTML = ''; // limpia por si había SSR
    (list || []).forEach((m) => grid.appendChild(card(m)));
  }).catch(() => {
    grid.innerHTML = '<p class="text-sm text-neutral-500">No pudimos cargar el equipo.</p>';
  });
})();


