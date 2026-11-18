// Best Buy Automobile — interactions
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Year
  $("#year").textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  // Finder tabs
  $$(".finder__tabs button").forEach(btn => btn.addEventListener("click", () => {
    $$(".finder__tabs button").forEach(b => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-selected", b === btn); });
    $$(".finder__panel").forEach(p => p.classList.toggle("is-active", p.dataset.panel === btn.dataset.tab));
  }));

  // Inventory filtering
  const cars = $$(".car");
  const chips = $$(".chip");
  const empty = $("#carsEmpty");
  const state = { type: "all", budget: Infinity, year: 0 };

  function applyFilters() {
    let shown = 0;
    cars.forEach(c => {
      const ok = (state.type === "all" || c.dataset.type === state.type)
        && +c.dataset.price <= state.budget
        && +c.dataset.year >= state.year;
      c.classList.toggle("is-hidden", !ok);
      if (ok) shown++;
    });
    empty.hidden = shown > 0;
    chips.forEach(ch => ch.classList.toggle("is-active", ch.dataset.filter === state.type));
  }

  chips.forEach(ch => ch.addEventListener("click", () => {
    state.type = ch.dataset.filter;
    applyFilters();
  }));

  const buyForm = $("#buyForm");
  buyForm.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(buyForm);
    state.type = fd.get("type");
    state.budget = +fd.get("budget");
    state.year = +fd.get("year");
    applyFilters();
    $("#inventory").scrollIntoView({ behavior: "smooth" });
  });

  function resetAll() {
    Object.assign(state, { type: "all", budget: Infinity, year: 0 });
    buyForm.reset();
    applyFilters();
  }
  $("#resetFinder").addEventListener("click", resetAll);
  $("#clearFilters").addEventListener("click", resetAll);

  // Forms → send.php (emails the dealership)
  async function sendForm(form, kind, note) {
    const btn = form.querySelector("button[type=submit]");
    const fd = new FormData(form);
    fd.append("form", kind);
    btn.disabled = true;
    try {
      const res = await fetch("send.php", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "failed");
      note.textContent = kind === "sell"
        ? "Thanks! We'll contact you with an offer within 24 hours."
        : "Thanks! We'll call you shortly to confirm.";
      form.reset();
    } catch (err) {
      note.textContent = "Sorry, that didn't send. Please call us at +49 1521 3260792.";
    }
    note.hidden = false;
    btn.disabled = false;
  }
  $("#sellForm").addEventListener("submit", e => { e.preventDefault(); sendForm(e.target, "sell", $("#sellNote")); });
  $("#contactForm").addEventListener("submit", e => { e.preventDefault(); sendForm(e.target, "contact", $("#formOk")); });

  // Reveal on scroll + count-up
  const countUp = el => {
    const end = +el.dataset.count, dur = 1400, t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add("is-in");
      const n = el.querySelector("[data-count]");
      if (n) countUp(n);
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    io.observe(el);
  });
})();
