// Studio Lumea — interazioni: menu mobile, comparsa allo scroll, FAQ, modulo con calendario.
(function () {
  var root = document.documentElement;

  // Menu mobile
  var menu = document.getElementById('mobile-menu');
  var openBtn = document.querySelector('[data-menu-open]');
  function setMenu(open) {
    if (!menu || menu.classList.contains('is-open') === open) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    // blocco scroll solo su html: sul body l'header sticky tornerebbe in cima alla pagina (menu sparito a metà pagina)
    root.style.overflow = open ? 'hidden' : '';
    if (open) { var c = menu.querySelector('[data-menu-close]'); if (c) c.focus({ preventScroll: true }); }
    else if (openBtn) openBtn.focus({ preventScroll: true }); // senza preventScroll la pagina risaliva di mezzo schermo chiudendo il menu
  }
  if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
  document.querySelectorAll('[data-menu-close]').forEach(function (el) {
    el.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  // se si ruota il telefono o si allarga la finestra, il menu non deve restare aperto su desktop
  window.matchMedia('(min-width: 960px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  // ritorno con il tasto Indietro (bfcache): stato pulito
  window.addEventListener('pageshow', function (e) { if (e.persisted) setMenu(false); });

  // Comparsa leggera allo scroll
  var items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    items.forEach(function (el) {
      var d = parseInt(el.getAttribute('data-reveal'), 10) || 0;
      if (d) el.style.transitionDelay = d + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // FAQ: un link a #faq-... apre direttamente la risposta
  function openFaqFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    var d = id && document.getElementById(id);
    if (d && d.tagName === 'DETAILS') d.open = true;
  }
  openFaqFromHash();
  window.addEventListener('hashchange', openFaqFromHash);

  // Modulo di richiesta appuntamento (demo: non invia dati a nessun server)
  var form = document.getElementById('booking-form');
  if (!form) return;
  var sent = document.getElementById('booking-sent');
  var slotField = form.querySelector('.slot-field');
  var summary = form.querySelector('[data-summary]');

  // ---- Calendario con orari liberi (simulati) ----
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function keyOf(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var first = new Date(today); first.setDate(first.getDate() + 1); // da domani
  var last = new Date(today); last.setDate(last.getDate() + 60);   // fino a 60 giorni
  var view = new Date(today.getFullYear(), today.getMonth(), 1);
  var grid = form.querySelector('[data-cal-grid]');
  var monthLabel = form.querySelector('[data-cal-month]');
  var prevBtn = form.querySelector('[data-cal-prev]');
  var nextBtn = form.querySelector('[data-cal-next]');
  var slotsBox = document.getElementById('slots');
  var selDate = null;

  function longDate(d) { return d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }); }
  function bookable(d) { return d >= first && d <= last && d.getDay() !== 0; }
  // orari "occupati" finti ma stabili: stesso giorno = stessi orari liberi
  function busy(key, t) { var h = 0, s = key + t; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 10 < 4; }
  function times(from, to) { var out = []; for (var m = from; m <= to; m += 30) out.push(Math.floor(m / 60) + ':' + pad(m % 60)); return out; }

  function renderCal() {
    monthLabel.textContent = view.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
    prevBtn.disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
    nextBtn.disabled = new Date(view.getFullYear(), view.getMonth() + 1, 1) > last;
    grid.innerHTML = '';
    var offset = (view.getDay() + 6) % 7; // lunedì = prima colonna
    for (var i = 0; i < offset; i++) grid.appendChild(document.createElement('span'));
    var days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (var n = 1; n <= days; n++) {
      var d = new Date(view.getFullYear(), view.getMonth(), n);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cal__day' + (d.getTime() === today.getTime() ? ' cal__day--today' : '');
      b.textContent = n;
      b.dataset.key = keyOf(d);
      b.setAttribute('aria-label', longDate(d));
      b.disabled = !bookable(d);
      b.setAttribute('aria-pressed', selDate && keyOf(selDate) === b.dataset.key ? 'true' : 'false');
      grid.appendChild(b);
    }
  }
  prevBtn.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderCal(); });
  nextBtn.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCal(); });

  var hint = form.querySelector('[data-slot-hint]');
  function renderSlots() {
    hint.hidden = !!selDate;
    if (!selDate) { slotsBox.hidden = true; return; }
    var key = keyOf(selDate), sat = selDate.getDay() === 6;
    slotsBox.hidden = false;
    slotsBox.querySelector('[data-slots-day]').textContent = 'Orari liberi ' + longDate(selDate) + ':';
    [['[data-slots-am]', times(9 * 60, 12 * 60 + 30)], ['[data-slots-pm]', sat ? [] : times(14 * 60 + 30, 19 * 60)]].forEach(function (g) {
      var group = slotsBox.querySelector(g[0]), list = group.querySelector('.slots__list');
      group.hidden = !g[1].length;
      list.innerHTML = '';
      g[1].forEach(function (t) {
        var s = document.createElement('button');
        s.type = 'button'; s.className = 'slot'; s.textContent = t; s.dataset.time = t;
        s.disabled = busy(key, t);
        if (s.disabled) s.setAttribute('aria-label', t + ', occupato');
        s.setAttribute('aria-pressed', form.ora.value === t ? 'true' : 'false');
        list.appendChild(s);
      });
    });
  }

  function updateSummary() {
    if (selDate && form.ora.value) {
      summary.hidden = false;
      summary.innerHTML = 'Hai scelto: <strong>' + longDate(selDate) + ', ore ' + form.ora.value + '</strong>';
    } else summary.hidden = true;
  }

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.cal__day');
    if (!b || b.disabled) return;
    var same = selDate && keyOf(selDate) === b.dataset.key;
    selDate = same ? null : new Date(b.dataset.key + 'T00:00:00');
    form.data.value = selDate ? b.dataset.key : '';
    form.ora.value = '';
    slotField.classList.remove('is-invalid');
    renderCal(); renderSlots(); updateSummary();
  });
  slotsBox.addEventListener('click', function (e) {
    var s = e.target.closest('.slot');
    if (!s || s.disabled) return;
    form.ora.value = s.dataset.time;
    slotField.classList.remove('is-invalid');
    renderSlots(); updateSummary();
  });
  renderCal();

  // ---- Validazione e invio ----
  function mark(field, bad) { field.classList.toggle('is-invalid', bad); return bad; }
  form.querySelectorAll('input,select,textarea').forEach(function (el) {
    el.addEventListener('input', function () { var f = el.closest('.field, .check-wrap'); if (f) f.classList.remove('is-invalid'); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = form.nome.value.trim(), tel = form.telefono.value, email = form.email.value.trim();
    var bad = false;
    bad = mark(slotField, !!selDate && !form.ora.value) || bad;
    bad = mark(form.nome.closest('.field'), nome.length < 2) || bad;
    bad = mark(form.telefono.closest('.field'), tel.replace(/\D/g, '').length < 6) || bad;
    bad = mark(form.email.closest('.field'), email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) || bad;
    bad = mark(form.privacy.closest('.check-wrap'), !form.privacy.checked) || bad;
    if (bad) {
      var inv = form.querySelector('.is-invalid');
      var focusEl = inv.querySelector('input:not([type=hidden]), select, .slot:not(:disabled)');
      inv.scrollIntoView({ block: 'center', behavior: 'smooth' });
      if (focusEl) focusEl.focus({ preventScroll: true });
      return;
    }
    sent.querySelector('[data-first]').textContent = nome.split(/\s+/)[0];
    sent.querySelector('[data-motivo]').textContent = form.motivo.value;
    sent.querySelector('[data-when]').textContent = selDate ? ', ' + longDate(selDate) + ' alle ' + form.ora.value : ' (ti proporremo noi un orario)';
    sent.querySelector('[data-tel]').textContent = tel.trim();
    form.hidden = true;
    sent.hidden = false;
    sent.focus({ preventScroll: true });
    var box = document.getElementById('prenota');
    window.scrollTo({ top: box.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
  });

  var again = document.getElementById('booking-again');
  if (again) again.addEventListener('click', function () {
    form.reset();
    selDate = null; form.data.value = ''; form.ora.value = '';
    view = new Date(today.getFullYear(), today.getMonth(), 1);
    renderCal(); renderSlots(); updateSummary();
    form.querySelectorAll('.is-invalid').forEach(function (f) { f.classList.remove('is-invalid'); });
    sent.hidden = true;
    form.hidden = false;
    form.motivo.focus();
  });
})();

