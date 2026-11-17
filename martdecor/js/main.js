(function () {
  "use strict";
  var D = window.MD, T = window.typo || function (s) { return s; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var t = function (s) { return esc(T(s || "")); };
  var NB = " ";
  var rub = function (n) { return Math.round(n).toLocaleString("ru-RU").replace(/\s/g, NB) + NB + "₽"; };
  var qs = new URLSearchParams(location.search);
  var page = document.body.dataset.page;
  var item = function (id) { return D.items.filter(function (i) { return i.id === id; })[0]; };
  var sec = function (id) { return D.sections.filter(function (s) { return s.id === id; })[0]; };

  /* ---------- общая шапка, меню, подборка, подвал ---------- */
  var NAV = [["catalog.html", "Каталог", "catalog"], ["index.html#stil", "По стилю", "stil"], ["index.html#kak", "Как проходит", "kak"],
             ["index.html#pro", "Дизайнерам", "pro"], ["index.html#salon", "Салон", "salon"]];
  function chrome() {
    var nav = NAV.map(function (n) { return '<a href="' + n[0] + '"' + (page === n[2] ? ' class="is-on"' : "") + ">" + n[1] + "</a>"; }).join("");
    var head = document.createElement("header");
    head.className = "top";
    head.innerHTML = '<div class="wrap top__in">' +
      '<a class="logo" href="index.html" aria-label="МАРТдекор, на главную"><span class="logo__mark">М</span><span><span class="logo__name">МАРТдекор</span><span class="logo__sub">интерьерный салон</span></span></a>' +
      '<nav class="nav">' + nav + "</nav>" +
      '<div class="top__right"><span class="open-now"><i></i><span>Открыто</span></span>' +
      '<a class="top__phone" href="tel:+79094200420">+7' + NB + "909 420-04-20</a>" +
      '<button class="pick-btn" type="button" data-open-pick aria-label="Моя подборка"><i class="ti ti-bookmarks"></i><span>Подборка</span><b class="is-zero">0</b></button>' +
      '<button class="burger" type="button" aria-label="Меню"><i class="ti ti-menu-2"></i></button></div></div>';
    document.body.prepend(head);
    var mnav = document.createElement("nav");
    mnav.className = "mnav";
    mnav.innerHTML = nav + '<a href="tel:+79094200420">+7' + NB + '909 420-04-20</a><a class="btn btn--primary" href="index.html#zayavka">Записаться на' + NB + "подбор</a>";
    head.after(mnav);
    $(".burger").addEventListener("click", function () {
      document.body.classList.toggle("is-menu");
      this.innerHTML = document.body.classList.contains("is-menu") ? '<i class="ti ti-x"></i>' : '<i class="ti ti-menu-2"></i>';
    });
    $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { document.body.classList.remove("is-menu"); $(".burger").innerHTML = '<i class="ti ti-menu-2"></i>'; }); });
    addEventListener("scroll", function () { head.classList.toggle("is-scrolled", scrollY > 20); }, { passive: true });

    var dr = document.createElement("div");
    dr.innerHTML = '<div class="drawer-bg" data-close></div>' +
      '<aside class="drawer" aria-label="Моя подборка"><div class="drawer__head"><div><h3>Моя подборка</h3><small>' + T("Менеджер посчитает количество и пришлёт расчёт") + '</small></div><button class="x" type="button" data-close aria-label="Закрыть"><i class="ti ti-x"></i></button></div>' +
      '<div class="drawer__list" id="pick-list"></div><div class="drawer__foot" id="pick-foot"></div></aside>' +
      '<div class="toast" role="status"><i class="ti ti-bookmark-filled"></i><span id="toast-t"></span><button type="button" data-open-pick>Открыть</button></div>';
    document.body.append(dr);

    var foot = document.createElement("footer");
    foot.className = "footer";
    var strip = ["#500B0B", "#A9824E", "#E4DBCF", "#7E8C77", "#4A4640", "#B9967A", "#EDE6DA", "#2A2725"].map(function (c) { return '<span style="background:' + c + '"></span>'; }).join("");
    foot.innerHTML = '<div class="wrap"><div class="footer__grid">' +
      '<div><a class="logo" href="index.html"><span class="logo__mark">М</span><span><span class="logo__name">МАРТдекор</span><span class="logo__sub">интерьерный салон</span></span></a>' +
      "<p>" + T("Отделочные материалы для стен в Ростове-на-Дону с 2018 года: лепнина, панели, камень, обои, фрески и краски от 90+ брендов.") + "</p>" +
      '<div class="footer__soc"><a href="https://vk.ru/martdecoronline" aria-label="ВКонтакте"><i class="ti ti-brand-vk"></i></a><a href="https://t.me/martdecorrostov" aria-label="Telegram"><i class="ti ti-brand-telegram"></i></a><a href="https://wa.me/79094200420" aria-label="WhatsApp"><i class="ti ti-brand-whatsapp"></i></a></div></div>' +
      '<div><h5>Каталог</h5>' + D.sections.slice(0, 6).map(function (s) { return '<a href="catalog.html?s=' + s.id + '">' + esc(s.name) + "</a>"; }).join("") + "</div>" +
      '<div><h5>Салон</h5><a href="index.html#kak">Как проходит подбор</a><a href="index.html#pro">Дизайнерам и мастерам</a><a href="article.html?id=primerka">Примерка на объекте</a><a href="index.html#voprosy">Частые вопросы</a><a href="index.html#salon">Как добраться</a></div>' +
      '<div><h5>Контакты</h5><a href="tel:+79094200420">+7' + NB + '909 420-04-20</a><a href="tel:+79094209420">+7' + NB + '909 420-94-20 — Екатерина</a><a href="mailto:info@martdecor.ru">info@martdecor.ru</a>' +
      '<a href="https://yandex.ru/maps/?text=' + encodeURIComponent("Ростов-на-Дону, проспект Михаила Нагибина, 30Л") + '">' + T("пр. Михаила Нагибина, 30Л, ДЦ WEST, цокольный этаж") + "</a>" +
      "<p>" + T("Пн–пт 10:00–19:00, сб–вс 10:00–17:00") + "</p></div></div>" +
      '<div class="footer__strip">' + strip + "</div>" +
      '<div class="footer__bottom"><div>' + T("ИП Арийская Людмила Руслановна, ИНН 231129240301. Прототип: фото — заглушки, наличие показано для примера, цены и характеристики взяты с martdecor.online и martdecor.ru 16.11.2026, формы ничего не отправляют.") + "</div>" +
      "<div><b>" + T("Демина Галина. Разработка сайтов для малого бизнеса") + "</b></div></div></div>";
    document.body.append(foot);

    $$("[data-close]").forEach(function (b) { b.addEventListener("click", closeAll); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
    document.addEventListener("click", function (e) {
      var o = e.target.closest("[data-open-pick]");
      if (o) { e.preventDefault(); openPick(); }
      var a = e.target.closest("[data-add]");
      if (a) { e.preventDefault(); togglePick(a.dataset.add); }
      var rm = e.target.closest("[data-remove]");
      if (rm) { e.preventDefault(); togglePick(rm.dataset.remove); }
      var dead = e.target.closest("a[href='#']");
      if (dead) { e.preventDefault(); toast("В прототипе это не подключено"); }
    });
  }
  function closeAll() { document.body.classList.remove("is-drawer", "is-filters"); }

  /* ---------- «Моя подборка» — хранится в браузере ---------- */
  var KEY = "md-pick-v2";
  function getPick() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return memPick; } }
  var memPick = [];
  function setPick(a) { memPick = a; try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} syncPick(); }
  function togglePick(id) {
    var p = getPick(), i = p.indexOf(id), it = item(id);
    if (i >= 0) { p.splice(i, 1); setPick(p); toast("Убрано из подборки"); }
    else { p.push(id); setPick(p); toast("«" + T(it.name) + "» — в подборке"); var b = $(".pick-btn b"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
  }
  function syncPick() {
    var p = getPick();
    $$(".pick-btn b").forEach(function (b) { b.textContent = p.length; b.classList.toggle("is-zero", !p.length); });
    $$("[data-add]").forEach(function (b) {
      var on = p.indexOf(b.dataset.add) >= 0;
      b.classList.toggle("is-in", on);
      if (b.classList.contains("card__add")) { b.innerHTML = on ? '<i class="ti ti-bookmark-filled"></i>' : '<i class="ti ti-bookmark-plus"></i>'; b.setAttribute("aria-label", on ? "Убрать из подборки" : "Добавить в подборку"); }
      else b.innerHTML = on ? '<i class="ti ti-check"></i>В подборке' : '<i class="ti ti-bookmark-plus"></i>' + (b.dataset.label || "В подборку");
    });
    renderPick();
  }
  function renderPick() {
    var list = $("#pick-list"), foot = $("#pick-foot");
    if (!list) return;
    var p = getPick().map(item).filter(Boolean);
    if (!p.length) {
      list.innerHTML = '<div class="drawer__empty">' + fan() + "<h4>" + T("Пока пусто") + "</h4><p>" + T("Добавляйте материалы кнопкой с закладкой — соберёте подборку для своего проекта и отправите менеджеру на расчёт.") + '</p><a class="btn btn--ghost btn--sm" href="catalog.html">Открыть каталог</a></div>';
      foot.innerHTML = ""; return;
    }
    list.innerHTML = p.map(function (it) {
      var s = sec(it.s);
      return '<div class="pick-row"><a href="item.html?id=' + it.id + '">' + ph(s, "", true) + '</a><div><b>' + t(it.name) + "</b><span>" + (it.price ? rub(it.price) + " / " + esc(it.unit) : "цена по запросу") + '</span></div><button type="button" data-remove="' + it.id + '" aria-label="Убрать"><i class="ti ti-trash"></i></button></div>';
    }).join("");
    foot.innerHTML = '<form data-demo="pick" novalidate><p>' + T(p.length + " " + plural(p.length, "позиция", "позиции", "позиций") + ". Укажите площадь или приложите проект в сообщении — посчитаем количество.") + "</p>" +
      '<div class="field-row"><label class="field">Имя<input name="name" autocomplete="name"></label>' +
      '<label class="field">Телефон<input name="phone" type="tel" inputmode="tel" placeholder="+7" required><span class="field__err">Нужен телефон, чтобы прислать расчёт</span></label></div>' +
      '<button class="btn btn--primary btn--block" type="submit"><i class="ti ti-send"></i>Отправить менеджеру на расчёт</button></form>';
    bindForms(foot);
  }
  function openPick() { document.body.classList.add("is-drawer"); }
  var tt;
  function toast(msg) {
    var el = $(".toast"); if (!el) return;
    $("#toast-t").textContent = msg;
    el.classList.add("is-on"); clearTimeout(tt);
    tt = setTimeout(function () { el.classList.remove("is-on"); }, 2600);
  }
  function plural(n, a, b, c) { n = Math.abs(n) % 100; var n1 = n % 10; if (n > 10 && n < 20) return c; if (n1 > 1 && n1 < 5) return b; if (n1 === 1) return a; return c; }

  /* ---------- формы: проверка и «спасибо» ---------- */
  function mask(inp) {
    inp.addEventListener("input", function () {
      var d = inp.value.replace(/\D/g, "").replace(/^8/, "7"); if (d && d[0] !== "7") d = "7" + d; d = d.slice(0, 11);
      var o = d ? "+7" : ""; if (d.length > 1) o += " " + d.slice(1, 4); if (d.length > 4) o += " " + d.slice(4, 7); if (d.length > 7) o += "-" + d.slice(7, 9); if (d.length > 9) o += "-" + d.slice(9, 11);
      inp.value = o; inp.closest(".field").classList.remove("is-err");
    });
  }
  function bindForms(root) {
    $$("form[data-demo]", root).forEach(function (f) {
      if (f.dataset.bound) return; f.dataset.bound = 1;
      $$("input[type=tel]", f).forEach(mask);
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var tel = $("input[type=tel]", f);
        if (tel && tel.value.replace(/\D/g, "").length < 11) { tel.closest(".field").classList.add("is-err"); tel.focus(); return; }
        var pick = f.dataset.demo === "pick";
        f.innerHTML = '<div class="thanks"><i class="ti ti-circle-check"></i><h3>' + (pick ? "Подборка отправлена" : "Спасибо, заявка принята") + "</h3><p>" +
          T("Это демонстрация: в прототипе форма никуда не отправляет. На настоящем сайте менеджер получит " + (pick ? "подборку" : "заявку") + " в мессенджер и ответит в рабочее время.") + "</p></div>";
      });
    });
    $$(".drop input", root).forEach(function (inp) {
      inp.addEventListener("change", function () { var l = inp.closest(".drop").querySelector("span"); if (inp.files[0]) l.textContent = "Прикреплено: " + inp.files[0].name; });
    });
  }

  /* ---------- «открыто сейчас»: пн–пт 10–19, сб–вс 10–17, Москва ---------- */
  function openNow() {
    var now = new Date(Date.now() + (new Date().getTimezoneOffset() + 180) * 60000);
    var d = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
    var close = (d === 0 || d === 6) ? 17 : 19, open = h >= 10 && h < close;
    var txt = open ? "Открыто до " + close + ":00" : (h < 10 ? "Откроемся сегодня в 10:00" : "Откроемся завтра в 10:00");
    $$(".open-now").forEach(function (el) { el.classList.toggle("is-closed", !open); el.lastChild.textContent = txt; });
    $$("[data-open-text]").forEach(function (el) { el.textContent = open ? "Сейчас открыто, до " + close + ":00" : txt; });
  }

  /* ---------- фрагменты ---------- */
  function ph(s, cap, small, icon) {
    var light = s.ink === "dark";
    return '<div class="ph' + (light ? " ph--light" : "") + '" style="--tone:' + s.tone + '">' + (small ? "" : '<i class="ti ti-' + (icon || "photo") + ' ph__ic"></i>') +
      (cap ? '<span class="ph__cap"><b>Нужен кадр:</b> ' + t(cap) + "</span>" : "") + "</div>";
  }
  function fan(cols) {
    cols = cols || ["#500B0B", "#A9824E", "#E4DBCF", "#7E8C77", "#2A2725"];
    return '<div class="fan" aria-hidden="true">' + cols.map(function (c, i) { return '<span style="background:' + c + '">MD–0' + (i + 1) + "</span>"; }).join("") + "</div>";
  }
  function priceHtml(it) {
    return it.price ? '<span class="price">' + rub(it.price) + "<small>/ " + esc(it.unit) + "</small></span>" : '<span class="price price--ask">' + T("Цена по запросу — пришлёт менеджер") + "</span>";
  }
  function card(it) {
    var s = sec(it.s);
    return '<article class="card reveal">' +
      '<a class="card__img" href="item.html?id=' + it.id + '" tabindex="-1" aria-hidden="true">' + ph(s, it.ph) + "</a>" +
      (it.tag ? '<span class="card__tag">' + esc(it.tag) + "</span>" : "") +
      '<button class="card__add" type="button" data-add="' + it.id + '" aria-label="Добавить в подборку"><i class="ti ti-bookmark-plus"></i></button>' +
      '<div class="card__body"><span class="card__brand">' + esc(it.brand) + "</span>" +
      '<a class="card__name" href="item.html?id=' + it.id + '">' + t(it.name) + "</a>" +
      '<span class="card__short">' + t(it.short) + "</span>" +
      '<div class="card__foot">' + priceHtml(it) + '<span class="st' + (it.status === "few" ? " st--few" : "") + '">' + (it.status === "in" ? "В наличии" : "Мало") + "</span></div></div></article>";
  }

  /* ---------- главная ---------- */
  function home() {
    $("#cats").innerHTML = D.sections.map(function (s) {
      return '<a class="cat-chip reveal" href="catalog.html?s=' + s.id + '"><div class="cat-chip__color' + (s.ink === "dark" ? " is-light" : "") + '" style="background:' + s.tone + '"><span class="swatch__code" style="color:inherit">MD–' + s.code + "</span><span>" + esc(s.count) + "</span></div>" +
        '<div class="cat-chip__body"><h3>' + t(s.name) + "</h3><p>" + t(s.fact) + "</p>" +
        '<div class="cat-chip__foot"><span>' + (s.from ? "в выборке от " + rub(s.from) + " / " + s.unit : T("цены уточняет менеджер")) + "</span><b>Смотреть →</b></div></div></a>";
    }).join("");

    var tabs = $("#style-tabs"), panels = $("#style-panels");
    tabs.innerHTML = D.styles.map(function (st, i) {
      return '<button class="style-tab' + (i ? "" : " is-on") + '" type="button" data-style="' + st.id + '"><span class="strip">' + st.palette.map(function (c) { return '<span style="background:' + c + '"></span>'; }).join("") + "</span>" + esc(st.name) + "<small>" + st.items.length + "</small></button>";
    }).join("");
    panels.innerHTML = D.styles.map(function (st, i) {
      return '<div class="style-panel' + (i ? "" : " is-on") + '" data-panel="' + st.id + '"><div class="style-head"><div><h3>' + t(st.name) + "</h3><p>" + t(st.lead) + " " + t(st.body) + '</p></div><div class="style-pal">' +
        st.palette.map(function (c) { return '<span style="background:' + c + '">' + c + "</span>"; }).join("") + '</div></div><div class="grid grid--3">' + st.items.slice(0, 3).map(function (id) { return card(item(id)); }).join("") +
        '</div><div class="style-foot"><span>Подборка стиля — по текстам салона: ' + esc(st.src) + '</span><a class="link" href="catalog.html?style=' + st.id + '">Все материалы стиля →</a></div></div>';
    }).join("");
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest(".style-tab"); if (!b) return;
      $$(".style-tab", tabs).forEach(function (x) { x.classList.toggle("is-on", x === b); });
      $$(".style-panel", panels).forEach(function (p) { p.classList.toggle("is-on", p.dataset.panel === b.dataset.style); });
      showAll(panels);
    });

    $("#featured").innerHTML = ["flex-ripple", "acoustic", "verde", "cx199", "freski-turin", "tadimi", "laconistiq", "sirpi"].map(function (id) { return card(item(id)); }).join("");

    var R = D.reviews, groups = [["pro", "Дизайнеры", R.pro, 14], ["build", "Мастера и стройкомпании", R.build, 2], ["home", "Для дома", R.home, 0]];
    var rt = $("#rv-tabs"), rl = $("#rv-list");
    rt.innerHTML = groups.map(function (g, i) { return '<button type="button" class="' + (i ? "" : "is-on") + '" data-g="' + g[0] + '">' + g[1] + "<b>" + (g[3] || g[2].length) + "</b></button>"; }).join("");
    var cols = ["#500B0B", "#A9824E", "#4A4640", "#7E8C77", "#8E7A5E", "#2A2725"];
    function rv(g) {
      var gr = groups.filter(function (x) { return x[0] === g; })[0];
      rl.innerHTML = gr[2].map(function (r, i) {
        return '<div class="rv" style="animation-delay:' + i * 60 + 'ms"><q>' + t(r.text) + '</q><div class="rv__who"><span class="rv__ava" style="background:' + cols[i % cols.length] + '">' + esc(r.name[0]) + "</span><span><b>" + t(r.name) + "</b>" + t(r.role) + "</span></div></div>";
      }).join("");
      $("#rv-note").innerHTML = g === "home" ? '<span class="need">' + T("Отзывы частных покупателей есть только на Яндекс Картах (32 отзыва, 5,0). Для сайта — разрешение показать 3–4 из них или свежие отзывы с фото ремонта.") + "</span>"
        : g === "pro" ? T("Показаны 6 из 14 отзывов дизайнеров и архитекторов со страницы martdecor.online/dizayneram.") : T("Оба отзыва со страницы martdecor.online/dizayneram.");
    }
    rt.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; $$("button", rt).forEach(function (x) { x.classList.toggle("is-on", x === b); }); rv(b.dataset.g); });
    rv("pro");

    /* ближайший ланч по средам, 14:00 */
    var now = new Date(Date.now() + (new Date().getTimezoneOffset() + 180) * 60000), d = new Date(now);
    var add = (3 - now.getDay() + 7) % 7; if (add === 0 && now.getHours() >= 14) add = 7; d.setDate(now.getDate() + add);
    var M = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    $("#lunch-date").textContent = (add === 0 ? "Сегодня" : add === 1 ? "Завтра" : "Среда") + ", " + d.getDate() + NB + M[d.getMonth()] + ", 14:00";

    $("#ideas").innerHTML = D.articles.map(function (a, i) {
      var s = { tone: a.palette[i === 1 ? 3 : 0], ink: i === 1 ? "light" : (i === 0 ? "dark" : "light") };
      return '<a class="idea reveal" href="article.html?id=' + a.id + '"><span class="strip">' + a.palette.map(function (c) { return '<span style="background:' + c + '"></span>'; }).join("") + "</span>" +
        ph(s, i === 0 ? "дизайнер с образцом молдинга у стены заказчика" : i === 1 ? "гибкий камень на колонне" : "фреска вокруг дверного проёма") +
        '<div class="idea__t"><small>' + esc(a.kicker) + "</small><h3>" + t(a.title) + "</h3><p>" + t(a.lead) + '</p><span class="link">Читать →</span></div></a>';
    }).join("");

    $("#faq").innerHTML = D.faq.map(function (f, i) { return "<details" + (i ? "" : " open") + "><summary>" + t(f[0]) + "</summary><p>" + t(f[1]) + "</p></details>"; }).join("");

    var hints = { home: "Приходите с фото комнаты или вдохновения — подберём сочетания и посчитаем количество.", pro: "Подберём по проекту, чертежам или коллажу, подготовим расчёт для вашего заказчика.", build: "Пришлите спецификацию — соберём комплектацию и доставим на объект." };
    $$(".seg").forEach(function (g) {
      g.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return; e.preventDefault();
        $$("button", g).forEach(function (x) { x.classList.toggle("is-on", x === b); });
        $("#seg-hint").textContent = T(hints[b.dataset.seg]);
      });
    });
    $("#seg-hint").textContent = T(hints.home);
  }

  /* ---------- каталог ---------- */
  function catalog() {
    var state = { q: "", s: qs.get("s") ? [qs.get("s")] : [], style: qs.get("style") || "", brand: [], wet: false, flex: false, priced: false, sort: "def" };
    $("#chips").innerHTML = '<button class="chip' + (state.style ? "" : " is-on") + '" data-style="">Все стили</button>' + D.styles.map(function (st) {
      return '<button class="chip' + (state.style === st.id ? " is-on" : "") + '" data-style="' + st.id + '"><span class="swatch-dot" style="background:' + st.palette[0] + '"></span>' + esc(st.name) + "</button>";
    }).join("");
    $("#f-sec").innerHTML = D.sections.map(function (s) {
      var n = D.items.filter(function (i) { return i.s === s.id; }).length;
      return '<label class="check"><input type="checkbox" value="' + s.id + '"' + (state.s.indexOf(s.id) >= 0 ? " checked" : "") + '><span class="swatch-dot" style="background:' + s.tone + '"></span>' + esc(s.name) + "<small>" + n + "</small></label>";
    }).join("");
    var brands = D.items.map(function (i) { return i.brand; }).filter(function (b, i, a) { return a.indexOf(b) === i && b.length < 20; });
    $("#f-brand").innerHTML = brands.map(function (b) { return '<label class="check"><input type="checkbox" value="' + esc(b) + '">' + esc(b) + "</label>"; }).join("");
    if (state.style) { var st0 = D.styles.filter(function (x) { return x.id === state.style; })[0]; if (st0) $("#cat-title").innerHTML = t("Материалы в стиле «" + st0.name + "»"); }

    function render() {
      var res = D.items.filter(function (i) {
        var st = state.style && D.styles.filter(function (x) { return x.id === state.style; })[0];
        return (!state.q || (i.name + " " + i.brand + " " + i.short + " " + sec(i.s).name).toLowerCase().indexOf(state.q) >= 0) &&
          (!state.s.length || state.s.indexOf(i.s) >= 0) && (!state.brand.length || state.brand.indexOf(i.brand) >= 0) &&
          (!st || st.items.indexOf(i.id) >= 0) && (!state.wet || i.wet) && (!state.flex || i.flex) && (!state.priced || i.price);
      });
      if (state.sort === "asc") res.sort(function (a, b) { return (a.price || 1e9) - (b.price || 1e9); });
      if (state.sort === "desc") res.sort(function (a, b) { return (b.price || 0) - (a.price || 0); });
      $("#count").innerHTML = "Найдено <b>" + res.length + "</b> " + plural(res.length, "позиция", "позиции", "позиций") + " из " + D.items.length + " в выборке";
      $("#list").innerHTML = res.length ? res.map(card).join("") :
        '<div class="empty"><i class="ti ti-zoom-question"></i><h3>Ничего не нашлось</h3><p>' + T("В прототипе 18 позиций, а в магазине салона — 84 797. Пришлите фото или артикул: найдём, даже если позицию сняли с производства.") + '</p><button class="btn btn--ghost btn--sm" type="button" data-reset>Сбросить фильтры</button></div>';
      var dirty = state.q || state.s.length || state.brand.length || state.style || state.wet || state.flex || state.priced;
      $(".filters__reset").classList.toggle("is-on", !!dirty);
      $(".search").classList.toggle("has-q", !!state.q);
      syncPick(); reveal();
    }
    function reset() {
      state = { q: "", s: [], style: "", brand: [], wet: false, flex: false, priced: false, sort: state.sort };
      $("#q").value = ""; $$(".filters input[type=checkbox]").forEach(function (i) { i.checked = false; });
      $$("#chips .chip").forEach(function (c) { c.classList.toggle("is-on", !c.dataset.style); });
      $("#cat-title").innerHTML = t("Материалы, которые можно посмотреть и потрогать в салоне");
      history.replaceState(null, "", "catalog.html"); render();
    }
    $("#q").addEventListener("input", function () { state.q = this.value.trim().toLowerCase(); render(); });
    $(".search button").addEventListener("click", function () { $("#q").value = ""; state.q = ""; render(); $("#q").focus(); });
    $(".filters").addEventListener("change", function () {
      state.s = $$("#f-sec input:checked").map(function (i) { return i.value; });
      state.brand = $$("#f-brand input:checked").map(function (i) { return i.value; });
      state.wet = $("#f-wet").checked; state.flex = $("#f-flex").checked; state.priced = $("#f-price").checked; render();
    });
    $("#chips").addEventListener("click", function (e) {
      var c = e.target.closest(".chip"); if (!c) return;
      state.style = c.dataset.style; $$("#chips .chip").forEach(function (x) { x.classList.toggle("is-on", x === c); });
      var st = D.styles.filter(function (x) { return x.id === state.style; })[0];
      $("#cat-title").innerHTML = st ? t("Материалы в стиле «" + st.name + "»") : t("Материалы, которые можно посмотреть и потрогать в салоне");
      render();
    });
    $("#sort").addEventListener("change", function () { state.sort = this.value; render(); });
    document.addEventListener("click", function (e) { if (e.target.closest("[data-reset]") || e.target.closest(".filters__reset")) reset(); });
    $(".mob-filters").addEventListener("click", function () { document.body.classList.add("is-filters"); });
    $("#f-close").addEventListener("click", closeAll);
    render();
  }

  /* ---------- карточка позиции ---------- */
  function itemPage() {
    var it = item(qs.get("id")) || D.items[0], s = sec(it.s);
    document.title = it.name + " — МАРТдекор";
    var shots = [it.ph, "фактура крупно, при дневном свете", "образец в салоне на стенде", "в интерьере заказчика"];
    var calc = "";
    if (it.calc && it.price) {
      calc = '<div class="calc"><h4><i class="ti ti-calculator"></i>Сколько понадобится</h4><div class="calc__row"><label class="field" style="margin:0">' + esc(it.calc.label) +
        '<input id="calc-in" type="number" min="0" step="0.5" value="' + (it.calc.type === "len" ? 16 : 6) + '" inputmode="decimal"></label><div class="calc__out"><b id="calc-sum">—</b><span id="calc-qty"></span></div></div>' +
        "<small>" + T("Расчёт для примера, с запасом 10%. Точное количество с учётом раскроя и раппорта посчитает менеджер.") + "</small></div>";
    }
    $("#crumbs").innerHTML = '<a href="index.html">Главная</a><span><a href="catalog.html">Каталог</a></span><span><a href="catalog.html?s=' + s.id + '">' + esc(s.name) + "</a></span>";
    $("#item").innerHTML =
      '<div class="gallery"><div class="gallery__main" id="g-main">' + ph(s, shots[0]) + '</div><div class="thumbs">' +
      shots.map(function (c, i) { return '<button type="button" class="' + (i ? "" : "is-on") + '" data-shot="' + i + '" aria-label="Фото ' + (i + 1) + '">' + ph(s, "", true) + "</button>"; }).join("") + "</div></div>" +
      '<div><span class="item__brand">' + esc(it.brand) + " · " + esc(s.name) + "</span><h1>" + t(it.name) + '</h1><p class="item__short">' + t(it.short) + "</p>" +
      '<div class="item__price">' + priceHtml(it) + '<span class="st' + (it.status === "few" ? " st--few" : "") + '">' + (it.status === "in" ? "В наличии в салоне" : "Количество ограничено") + " — для примера</span></div>" +
      (it.unit === "уточнить" ? '<span class="need">' + T("На сайте не указано, за что эта цена: за панель или за комплект") + "</span>" : "") +
      '<div class="item__btns"><button class="btn btn--primary" type="button" data-add="' + it.id + '" data-label="Добавить в подборку"></button>' +
      '<a class="btn btn--ghost" href="article.html?id=primerka"><i class="ti ti-truck"></i>Образец на объект</a></div>' + calc +
      '<table class="specs">' + it.specs.map(function (r) { return "<tr><td>" + t(r[0]) + "</td><td>" + t(r[1]) + "</td></tr>"; }).join("") + "</table>" +
      '<div class="box"><h4><i class="ti ti-sparkles"></i>Чем хорош</h4><ul>' + it.pluses.map(function (p) { return "<li>" + t(p) + "</li>"; }).join("") + "</ul></div>" +
      '<div class="box"><h4><i class="ti ti-home"></i>Куда подойдёт</h4><p>' + t(it.fit) + "</p></div>" +
      (it.needs.length ? '<div class="box"><h4><i class="ti ti-tool"></i>Что потребует</h4><ul>' + it.needs.map(function (p) { return "<li>" + t(p) + "</li>"; }).join("") + "</ul></div>" : "") +
      '<div class="box"><h4><i class="ti ti-receipt"></i>Как купить</h4><p>' + T("Добавьте в подборку и отправьте менеджеру: он уточнит наличие, посчитает количество и пришлёт счёт с QR-кодом СБП. В салоне — наличными, картой или по QR. Доставка по Ростову — Яндекс Go, по России — транспортной компанией.") + "</p></div>" +
      '<p class="src">Источник: ' + esc(it.src) + "</p></div>";
    $$(".thumbs button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".thumbs button").forEach(function (x) { x.classList.toggle("is-on", x === b); });
        $("#g-main").innerHTML = ph(s, shots[+b.dataset.shot]);
      });
    });
    var ci = $("#calc-in");
    if (ci) {
      var upd = function () {
        var v = parseFloat(ci.value.replace(",", ".")) || 0, need = v * 1.1, qty = Math.ceil(need / it.calc.per);
        var unitQ = it.unit.replace(", от", "");
        $("#calc-sum").textContent = v ? "≈ " + rub(qty * it.price) : "—";
        $("#calc-qty").textContent = v ? (it.calc.per === 1 ? qty + " м² с запасом" : qty + " " + unitQ + " с запасом") : "введите размер";
      };
      ci.addEventListener("input", upd); upd();
    }
    var rel = D.items.filter(function (i) { return i.s === it.s && i.id !== it.id; });
    D.styles.forEach(function (st) { if (st.items.indexOf(it.id) >= 0) st.items.forEach(function (id) { if (id !== it.id && rel.indexOf(item(id)) < 0) rel.push(item(id)); }); });
    $("#related").innerHTML = rel.slice(0, 4).map(card).join("");
  }

  /* ---------- статья ---------- */
  function articlePage() {
    var a = D.articles.filter(function (x) { return x.id === qs.get("id"); })[0] || D.articles[0];
    document.title = a.title + " — журнал МАРТдекор";
    $("#a-crumbs").innerHTML = '<a href="index.html">Главная</a><span><a href="index.html#zhurnal">Журнал</a></span>';
    $("#a-kicker").textContent = a.kicker;
    $("#a-title").innerHTML = t(a.title);
    $("#a-lead").innerHTML = t(a.lead);
    $("#a-cover").innerHTML = ph({ tone: a.palette[1], ink: "dark" }, a.id === "primerka" ? "образцы лепнины и выкраски на столе подбора" : a.id === "flex" ? "радиусная стена в гибком камне" : "фреска, огибающая дверной проём", false, "photo");
    var heads = a.body.filter(function (b) { return b[0]; });
    $("#toc").innerHTML = "<b>В статье</b>" + heads.map(function (b, i) { return '<a href="#p' + i + '">' + t(b[0]) + "</a>"; }).join("") + '<a href="#need">Что понадобится</a>';
    var i = 0, html = "";
    a.body.forEach(function (b, k) {
      if (b[0]) html += '<h2 id="p' + (i++) + '">' + t(b[0]) + "</h2>";
      html += "<p>" + t(b[1]) + "</p>";
      if (k === 0) html += '<blockquote class="pull"><p>' + t(a.quote[0]) + "</p><span>— " + t(a.quote[1]) + "</span></blockquote>";
    });
    html += '<div class="article__need" id="need"><h3>Что понадобится — всё есть в салоне</h3><div class="mini">' + a.need.map(function (id) {
      var it = item(id), s = sec(it.s);
      return '<a href="item.html?id=' + id + '">' + ph(s, "", true) + "<span><b>" + t(it.name) + "</b><span>" + (it.price ? rub(it.price) + " / " + esc(it.unit) : "цена по запросу") + "</span></span></a>";
    }).join("") + '</div><div class="pro__btns" style="margin-top:24px"><a class="btn btn--primary" href="index.html#zayavka">Собрать такую подборку для меня</a><a class="btn btn--ghost" href="catalog.html">Смотреть каталог</a></div></div>' +
      '<p class="src">Текст по материалам салона: ' + esc(a.src) + "</p>";
    $("#a-body").innerHTML = html;
    $("#more").innerHTML = D.articles.filter(function (x) { return x.id !== a.id; }).map(function (x) {
      return '<a class="idea reveal" href="article.html?id=' + x.id + '"><span class="strip">' + x.palette.map(function (c) { return '<span style="background:' + c + '"></span>'; }).join("") + '</span><div class="idea__t"><small>' + esc(x.kicker) + "</small><h3>" + t(x.title) + "</h3><p>" + t(x.lead) + '</p><span class="link">Читать →</span></div></a>';
    }).join("");
    var links = $$("#toc a");
    addEventListener("scroll", function () {
      var cur; links.forEach(function (l) { var el = $(l.getAttribute("href")); if (el && el.getBoundingClientRect().top < 160) cur = l; });
      links.forEach(function (l) { l.classList.toggle("is-on", l === cur); });
    }, { passive: true });
  }

  /* ---------- появление при прокрутке, с запасным вариантом ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-vis"); io.unobserve(e.target); } });
  }, { threshold: .08, rootMargin: "0px 0px -40px 0px" }) : null;
  function reveal() { $$(".reveal:not(.is-vis)").forEach(function (el) { io ? io.observe(el) : el.classList.add("is-vis"); }); setTimeout(showInView, 250); }
  function showInView() { $$(".reveal:not(.is-vis)").forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight * .96) el.classList.add("is-vis"); }); }
  function showAll(root) { $$(".reveal", root).forEach(function (el) { el.classList.add("is-vis"); }); }
  addEventListener("scroll", showInView, { passive: true });
  setTimeout(function () { showAll(document); }, 2500);

  chrome();
  if (page === "home") home();
  if (page === "catalog") catalog();
  if (page === "item") itemPage();
  if (page === "article") articlePage();
  bindForms(document); syncPick(); openNow(); setInterval(openNow, 60000); reveal();
})();
