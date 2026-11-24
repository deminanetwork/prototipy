/* «есть привезём» — общая логика прототипа: шапка, подвал, корзина, каталог. */
(function () {
  var S = window.SHOP, T = window.typo || function (s) { return s; };
  var PHONE = '8 933 982-40-41', PHONE_HREF = 'tel:+79339824041';
  var FREE_FROM = 2000, ZONES = { jub: { name: 'Юбилейный', price: 99 }, city: { name: 'Другой район Саратова', price: 199 } };
  var byId = {}; S.products.forEach(function (p) { byId[p.id] = p; });
  var catName = {}; S.cats.forEach(function (c) { catName[c.id] = c.name; });

  /* ---------- хранение корзины (без падений в приватном режиме) ---------- */
  var mem = {};
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return mem[k] || d; } }
  function save(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var cart = load('ep_cart', {});
  var zone = load('ep_zone', 'jub');

  /* ключ строки корзины: id или id|номер сорта */
  function keyOf(id, v) { return v == null ? id : id + '|' + v; }
  function parseKey(k) { var a = k.split('|'); return { p: byId[a[0]], v: a[1] == null ? null : +a[1] }; }
  function fmtQty(p, q) { return p.unit === 'kg' ? String(q).replace('.', ',') + ' кг' : q + ' шт'; }
  function rub(n) { return Math.round(n).toLocaleString('ru-RU').replace(/\s/g, ' ') + ' ₽'; }
  function unitLbl(p) { return p.unit === 'kg' ? '/кг' : '/шт'; }
  /* временная заглушка вместо фото: значок на плашке цвета раздела */
  var ICO_CAT = { fruits: 'apple', citrus: 'lemon-2', grapes: 'cherry', veg: 'salad', roots: 'carrot', greens: 'leaf' };
  var ICO_ID = [[/^pomidor|^cherri/, 'cherry'], [/^perec|^baklazhan/, 'pepper'], [/^kabachok|^tykva/, 'melon'], [/^chesnok|^luk-(repch|krasny|krym)/, 'seedling'],
    [/^limon|^laim/, 'lemon'], [/^aisberg|^salat/, 'salad'], [/^zelen|^bazilik|^luk-zel/, 'plant-2']];
  function icoOf(p) { for (var i = 0; i < ICO_ID.length; i++) if (ICO_ID[i][0].test(p.id)) return ICO_ID[i][1]; return ICO_CAT[p.cat] || 'basket'; }
  function pic(p, cls) { return '<span class="ph-ico ph-' + p.cat + (cls ? ' ' + cls : '') + '" role="img" aria-label="' + p.name + '"><i class="ti ti-' + icoOf(p) + '"></i></span>'; }
  function lineName(p, v) { return p.name + (v != null ? ', ' + p.variants[v].toLowerCase() : ''); }

  function totals() {
    var sum = 0, count = 0, okMin = false;
    Object.keys(cart).forEach(function (k) {
      var x = parseKey(k), q = cart[k]; if (!x.p) return;
      sum += x.p.price * q; count++;
      if (x.p.unit === 'kg' && q >= 1) okMin = true;
    });
    var del = count ? (sum >= FREE_FROM ? 0 : ZONES[zone].price) : 0;
    return { sum: sum, count: count, okMin: okMin, del: del, total: sum + del };
  }
  function setQty(k, q) {
    var p = parseKey(k).p;
    if (q <= 0) delete cart[k]; else cart[k] = p.unit === 'kg' ? Math.round(q * 2) / 2 : Math.round(q);
    save('ep_cart', cart); refresh();
  }
  function add(id, v, q) {
    var p = byId[id], k = keyOf(id, v);
    var start = q || (p.unit === 'kg' ? 1 : 1);
    setQty(k, (cart[k] || 0) + (cart[k] ? (p.unit === 'kg' ? .5 : 1) : start));
    toast('Добавили: ' + lineName(p, v) + ' — ' + fmtQty(p, cart[k]));
    var c = document.querySelector('.cart-btn .cnt'); if (c) { c.classList.add('bump'); setTimeout(function () { c.classList.remove('bump'); }, 250); }
  }
  function inc(k, dir) { var p = parseKey(k).p, st = p.unit === 'kg' ? .5 : 1; setQty(k, (cart[k] || 0) + dir * st); }

  /* ---------- уведомление ---------- */
  var tEl, tTimer;
  function toast(msg, link) {
    if (!tEl) { tEl = document.createElement('div'); tEl.className = 'toast'; tEl.setAttribute('role', 'status'); document.body.appendChild(tEl); }
    tEl.innerHTML = '<i class="ti ti-circle-check"></i><span></span>' + (link === false ? '' : '<a href="cart.html">В корзину</a>');
    tEl.querySelector('span').textContent = msg;
    requestAnimationFrame(function () { tEl.classList.add('show'); });
    clearTimeout(tTimer); tTimer = setTimeout(function () { tEl.classList.remove('show'); }, 2600);
  }
  window.demo = function (what) { toast((what || 'Эта функция') + ' — в прототипе не подключено', false); return false; };

  /* ---------- шапка и подвал ---------- */
  var page = document.body.dataset.page || '';
  function header() {
    var nav = [['catalog.html', 'Каталог', 'catalog'], ['delivery.html', 'Доставка и оплата', 'delivery'], ['index.html#how', 'Как заказать', 'how'], ['index.html#about', 'О нас', 'about'], ['index.html#faq', 'Вопросы', 'faq']];
    var links = nav.map(function (n) { return '<a href="' + n[0] + '"' + (n[2] === page ? ' class="on"' : '') + '>' + n[1] + '</a>'; }).join('');
    var h = document.createElement('div');
    h.innerHTML =
      '<div class="proto-bar"><b>Прототип</b> · вместо фото товаров пока значки, настоящие фото добавим позже · заказы не отправляются</div>' +
      '<header class="hdr"><div class="wrap">' +
      '<a class="logo" href="index.html" aria-label="есть привезём — на главную"><b>есть</b><span>привезём</span></a>' +
      '<nav class="nav" aria-label="Главное меню">' + links + '</nav>' +
      '<div class="hdr-right">' +
      '<a class="hdr-phone" href="' + PHONE_HREF + '">' + PHONE + '<small>ежедневно 8:00–20:00</small></a>' +
      '<a class="cart-btn" href="cart.html" aria-label="Корзина"><i class="ti ti-shopping-bag"></i><span class="lbl">Корзина</span><span class="cnt">0</span></a>' +
      '<button class="icon-btn burger" aria-label="Меню" aria-expanded="false"><i class="ti ti-menu-2"></i></button>' +
      '</div></div></header>' +
      '<nav class="mnav" aria-label="Мобильное меню">' + links + '<a href="' + PHONE_HREF + '">' + PHONE + '</a><a class="btn btn-terra" href="catalog.html">Выбрать продукты</a></nav>';
    while (h.firstChild) document.body.insertBefore(h.lastChild, document.body.firstChild);
    var b = document.querySelector('.burger'), m = document.querySelector('.mnav');
    b.addEventListener('click', function () { var o = m.classList.toggle('open'); b.setAttribute('aria-expanded', o); b.innerHTML = '<i class="ti ti-' + (o ? 'x' : 'menu-2') + '"></i>'; document.body.style.overflow = o ? 'hidden' : ''; });
    m.addEventListener('click', function (e) { if (e.target.tagName === 'A') { m.classList.remove('open'); document.body.style.overflow = ''; } });
    var hdr = document.querySelector('.hdr');
    window.addEventListener('scroll', function () { hdr.classList.toggle('scrolled', scrollY > 20); }, { passive: true });
  }
  function footer() {
    var f = document.createElement('footer'); f.className = 'ftr';
    f.innerHTML = '<div class="wrap"><div class="ftr-grid">' +
      '<div class="ftr-brand"><a class="logo" href="index.html"><b>есть</b><span>привезём</span></a><p>' + T('Овощи и фрукты с рынка') + '<br>' + T('с доставкой по Саратову') + '</p></div>' +
      '<div><h4>Покупателям</h4><ul><li><a href="catalog.html">Каталог</a></li><li><a href="delivery.html">Доставка и оплата</a></li><li><a href="index.html#how">Как заказать</a></li><li><a href="index.html#faq">Вопросы и ответы</a></li></ul></div>' +
      '<div><h4>Документы</h4><ul><li><a href="docs.html#oferta">Публичная оферта</a></li><li><a href="docs.html#policy">Политика конфиденциальности</a></li></ul></div>' +
      '<div class="ftr-contacts"><a class="ftr-phone" href="' + PHONE_HREF + '"><img src="img/d/i-phone.svg" alt="" width="22" height="22">' + PHONE + '</a>' +
      '<a href="#" onclick="return demo(\'Telegram\')"><img src="img/d/i-plane.svg" alt="" width="22" height="22">Написать в Telegram</a>' +
      '<span><img src="img/d/i-clock.svg" alt="" width="22" height="22">' + T('Принимаем заказы ежедневно с 8:00 до 22:00, привозим в выбранный интервал') + '</span></div>' +
      '</div></div><div class="ftr-bottom"><div class="wrap"><span>' + T('© 2026 есть привезём. Доставка овощей и фруктов по Саратову') + ' · ИП <span class="need">Нужно от вас: ФИО, ИНН, ОГРНИП</span></span><span>Прототип подготовила Демина Галина. Разработка сайтов для малого бизнеса</span></div></div>';
    document.body.appendChild(f);
  }
  function refresh() {
    var t = totals(), b = document.querySelector('.cart-btn');
    if (b) { b.querySelector('.cnt').textContent = t.count; b.querySelector('.lbl').textContent = t.count ? rub(t.sum) : 'Корзина'; }
    document.querySelectorAll('[data-buy]').forEach(renderBuy);
    if (window.onCart) window.onCart(t);
  }

  /* ---------- кнопка «в корзину» / шаговый счётчик ---------- */
  function renderBuy(el) {
    var id = el.dataset.buy, p = byId[id], v = el.dataset.v === undefined || el.dataset.v === '' ? null : +el.dataset.v, k = keyOf(id, v), q = cart[k];
    el.innerHTML = q
      ? '<div class="step' + (el.dataset.light ? ' light' : '') + '"><button aria-label="Меньше" data-inc="-1"><i class="ti ti-minus"></i></button><output>' + fmtQty(p, q) + '</output><button aria-label="Больше" data-inc="1"><i class="ti ti-plus"></i></button></div>'
      : '<button class="add" data-add><i class="ti ti-plus"></i>' + (p.unit === 'kg' ? '1 кг' : '1 шт') + '</button>';
  }
  document.addEventListener('click', function (e) {
    var w = e.target.closest('[data-buy]'); if (!w) return;
    var id = w.dataset.buy, v = w.dataset.v === undefined || w.dataset.v === '' ? null : +w.dataset.v, k = keyOf(id, v);
    if (e.target.closest('[data-add]')) add(id, v);
    var i = e.target.closest('[data-inc]'); if (i) inc(k, +i.dataset.inc);
  });
  /* выбор сорта на карточке */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.var'); if (!b) return;
    var box = b.closest('.card,.pp-info'); box.querySelectorAll('.var').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    box.querySelectorAll('[data-buy]').forEach(function (w) { w.dataset.v = b.dataset.v; renderBuy(w); });
    if (window.onVar) window.onVar(+b.dataset.v);
  });

  function card(p) {
    var badges = (p.local ? '<span class="badge badge-local"><i class="ti ti-plant-2"></i>Местное</span>' : '') + (p.tag ? '<span class="badge badge-tag">' + p.tag + '</span>' : '');
    var vars = p.variants ? '<div class="vars" role="group" aria-label="Сорт">' + p.variants.map(function (v, i) { return '<button class="var' + (i ? '' : ' on') + '" data-v="' + i + '" aria-pressed="' + !i + '">' + v + '</button>'; }).join('') + '</div><span class="need" style="align-self:flex-start">Нужно от вас: названия сортов</span>' : '';
    return '<article class="card"><a class="pic" href="product.html?id=' + p.id + '">' + pic(p) + '<span class="badges">' + badges + '</span></a>' +
      '<div class="body"><h3 class="name"><a href="product.html?id=' + p.id + '">' + T(p.name) + '</a></h3><div class="sub">' + (p.sub ? T(p.sub) : '&nbsp;') + '</div>' + vars + '</div>' +
      '<div class="foot"><span class="price">' + p.price + '&nbsp;₽<small>' + unitLbl(p) + '</small></span><div data-buy="' + p.id + '"' + (p.variants ? ' data-v="0"' : '') + '></div></div></article>';
  }

  /* ---------- появление при прокрутке, с запасным вариантом ---------- */
  function reveal() {
    var els = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
    setTimeout(function () { els.forEach(function (e) { e.classList.add('in'); }); }, 2500);
  }

  window.EP = { S: S, byId: byId, catName: catName, cart: function () { return cart; }, totals: totals, setQty: setQty, inc: inc, add: add, keyOf: keyOf, parseKey: parseKey,
    fmtQty: fmtQty, pic: pic, rub: rub, unitLbl: unitLbl, lineName: lineName, card: card, renderBuy: renderBuy, toast: toast, refresh: refresh, T: T, ZONES: ZONES, FREE_FROM: FREE_FROM,
    zone: function (z) { if (z) { zone = z; save('ep_zone', z); refresh(); } return zone; }, clear: function () { cart = {}; save('ep_cart', cart); refresh(); }, PHONE: PHONE, PHONE_HREF: PHONE_HREF };

  header(); footer();
  document.addEventListener('DOMContentLoaded', function () { if (window.init) window.init(); refresh(); reveal(); });
})();
