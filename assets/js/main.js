// Site-wide scripts: shared header and footer, mobile menu, quick exit.
// Edit NAV or the footer here once, and every page updates.

(function () {
  var SITE_NAME = "Screen to Treat";

  var NAV = [
    { href: "#the-case", label: "The case" },
    { href: "#objections", label: "Objections" },
    { href: "#evidence", label: "Evidence" },
    { href: "#about", label: "About" },
    { href: "#get-involved", label: "Get involved" },
    { href: "#contact", label: "Contact" }
  ];


  // ---------- Header ----------
  var headerSlot = document.querySelector('[data-include="header"]');
  if (headerSlot) {
    var links = NAV.map(function (item) {
      return '<li><a href="' + item.href + '">' + item.label + "</a></li>";
    }).join("");

    headerSlot.outerHTML =
      '<header class="site-header">' +
      '  <div class="container header-inner">' +
      '    <a class="logo" href="#home" aria-label="' + SITE_NAME + ', home">' + SITE_NAME + '<span class="logo-dots" aria-hidden="true"><i></i><i></i><i></i></span></a>' +
      '    <div class="nav-wrap"><button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Find</button>' +
      '    <nav class="site-nav" id="site-nav" aria-label="Main"><ul>' + links + '</ul><a class="logo nav-logo" href="#home" aria-label="' + SITE_NAME + ', home">' + SITE_NAME + '<span class="logo-dots" aria-hidden="true"><i></i><i></i><i></i></span></a></nav></div>' +
      "  </div>" +
      "</header>";
  }

  // ---------- Footer ----------
  var footerSlot = document.querySelector('[data-include="footer"]');
  if (footerSlot) {
    footerSlot.outerHTML =
      '<footer class="site-footer">' +
      '  <div class="container">' +
      '    <div class="footer-grid">' +
      "      <div><strong>" + SITE_NAME + "</strong>" +
      "        <p>The ethical case for eliminating cervical cancer.</p></div>" +
      '      <div><strong>The argument</strong><ul>' +
      '        <li><a href="#the-case">The case</a></li>' +
      '        <li><a href="#objections">Objections</a></li>' +
      '        <li><a href="#evidence">Evidence</a></li>' +
      "      </ul></div>" +
      '      <div><strong>Organisation</strong><ul>' +
      '        <li><a href="#about">About</a></li>' +
      '        <li><a href="#get-involved">Get involved</a></li>' +
      '        <li><a href="#contact">Contact</a></li>' +
      '        <li><a href="#privacy">Privacy</a></li>' +
      '        <li><a href="#references">References</a></li>' +
      "      </ul></div>" +
      "    </div>" +
      '    <div class="footer-bottom">© ' + new Date().getFullYear() + " <span class=\"brand\">" + SITE_NAME + "</span>" +
      ". Educational content, not medical advice.</div>" +
      "  </div>" +
      "</footer>";
  }

  // ---------- Mobile navigation ----------
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Close the mobile menu after choosing a section
  document.querySelectorAll(".site-nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      if (nav) nav.classList.remove("open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      var w = document.querySelector(".nav-wrap");
      if (w) { w.classList.add("closed"); if (document.activeElement) document.activeElement.blur(); }
    });
  });

  // ---------- Highlight the section in view ----------
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a"));
  var blocks = document.querySelectorAll(".page-block");
  if ("IntersectionObserver" in window && blocks.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navLinks.forEach(function (a) {
          if (a.getAttribute("href") === id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    blocks.forEach(function (b) { observer.observe(b); });
  }

  // ---------- Smooth, eased scrolling to sections ----------
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function easeInOutCubic(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function headerOffset() {
    var h = document.querySelector(".site-header");
    return h ? h.getBoundingClientRect().height + 16 : 0;
  }
  function scrollToTarget(target, hash) {
    var start = window.pageYOffset;
    var end = target.getBoundingClientRect().top + start - headerOffset();
    if (target.id === "home") end = 0;
    var distance = end - start;
    if (reduceMotion || Math.abs(distance) < 2) {
      window.scrollTo(0, end);
    } else {
      var duration = Math.min(1100, Math.max(450, Math.abs(distance) * 0.25));
      var t0 = null;
      var step = function (now) {
        if (t0 === null) t0 = now;
        var p = Math.min((now - t0) / duration, 1);
        window.scrollTo(0, start + distance * easeInOutCubic(p));
        if (p < 1) requestAnimationFrame(step);
        else target.classList.add("arrived");
      };
      requestAnimationFrame(step);
    }
    if (history.pushState) history.pushState(null, "", hash);
    setTimeout(function () { target.classList.remove("arrived"); }, 2200);
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var hash = a.getAttribute("href");
    if (hash.length < 2) return;
    var target = document.getElementById(hash.slice(1));
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target, hash);
  });

  // ---------- Count-up numbers in the Evidence section ----------
  (function () {
    var stats = document.querySelectorAll("#evidence .stat:not(.flip)");
    if (!stats.length || !("IntersectionObserver" in window)) return;
    var noMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) return;
    var NUM = /\d[\d,]*(?:\.\d+)?/g;

    function format(value, template) {
      var decimals = (template.split(".")[1] || "").length;
      var fixed = value.toFixed(decimals);
      if (template.indexOf(",") === -1) return fixed;
      var parts = fixed.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }

    function animate(el) {
      var original = el.getAttribute("data-final");
      var tokens = original.match(NUM) || [];
      var targets = tokens.map(function (tk) { return parseFloat(tk.replace(/,/g, "")); });
      var duration = 1600, t0 = null;
      function frame(now) {
        if (t0 === null) t0 = now;
        var p = Math.min((now - t0) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var k = 0;
        el.textContent = original.replace(NUM, function (tk) {
          var v = targets[k++] * eased;
          return format(v, tk);
        });
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = original;
      }
      requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        animate(entry.target);
      });
    }, { threshold: 0.6 });

    stats.forEach(function (el) {
      var original = el.textContent;
      if (!NUM.test(original)) return;
      NUM.lastIndex = 0;
      el.setAttribute("data-final", original);
      el.setAttribute("aria-label", original);
      el.textContent = original.replace(NUM, function (tk) { return format(0, tk); });
      io.observe(el);
    });
  })();

  // ---------- Split-flap scoreboard for the 90 70 90 targets ----------
  (function () {
    var row = document.querySelector(".target-row");
    if (!row) return;
    var cards = Array.prototype.slice.call(row.querySelectorAll(".stat.flip"));
    if (!cards.length) return;
    var noMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var STEP = 300;

    function half(cls, ch) {
      var h = document.createElement("span");
      h.className = "half " + cls;
      var s = document.createElement("span");
      s.textContent = ch;
      h.appendChild(s);
      return h;
    }
    function makeFlap(ch) {
      var f = document.createElement("span");
      f.className = "flap";
      f.setAttribute("aria-hidden", "true");
      f.appendChild(half("up", ch));
      f.appendChild(half("down", ch));
      f.dataset.value = ch;
      return f;
    }
    function setStatic(f, ch) {
      f.querySelector(".half.up span").textContent = ch;
      f.querySelector(".half.down span").textContent = ch;
      f.dataset.value = ch;
    }
    function flipTo(f, ch) {
      var from = f.dataset.value;
      if (from === ch) return;
      f.querySelectorAll(".anim").forEach(function (n) { n.remove(); });
      f.querySelector(".half.up span").textContent = ch;
      var topLeaf = half("up anim", from);
      var bottomLeaf = half("down anim", ch);
      f.appendChild(topLeaf);
      f.appendChild(bottomLeaf);
      f.dataset.value = ch;
      setTimeout(function () {
        f.querySelector(".half.down span").textContent = ch;
        topLeaf.remove();
        bottomLeaf.remove();
      }, STEP);
    }

    var boards = cards.map(function (el) {
      var target = el.getAttribute("data-target");
      el.textContent = "";
      var wrap = document.createElement("span");
      wrap.className = "flip-num";
      var flaps = target.split("").map(function (d) { var f = makeFlap(d); wrap.appendChild(f); return f; });
      var pct = document.createElement("span");
      pct.className = "flip-pct";
      pct.setAttribute("aria-hidden", "true");
      pct.textContent = "%";
      wrap.appendChild(pct);
      el.appendChild(wrap);
      return { target: target, flaps: flaps };
    });
    if (noMotion || !("IntersectionObserver" in window)) return;

    var run = 0;
    function reset() {
      boards.forEach(function (b) { b.flaps.forEach(function (f) { setStatic(f, "0"); }); });
    }
    function play() {
      var token = ++run;
      reset();
      var delay = 300;
      boards.forEach(function (b) {
        b.flaps.forEach(function (f, i) {
          var digit = b.target.charAt(i);
          setTimeout(function () { if (token === run) flipTo(f, digit); }, delay);
        });
        delay += 550;
      });
    }
    reset();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) play();
        else { run++; reset(); }
      });
    }, { threshold: 0.5 });
    io.observe(row);
  })();

  // ---------- People figure: 9 in 10 cannot access radiotherapy ----------
  (function () {
    var rows = document.querySelectorAll(".people-row");
    if (!rows.length) return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    rows.forEach(function (row) {
      var people = Array.prototype.slice.call(row.querySelectorAll(".human"));
      var no = people.filter(function (h) { return h.classList.contains("no"); });
      var timers = [];
      function clear() { timers.forEach(clearTimeout); timers = []; }
      function reset() { people.forEach(function (h) { h.classList.remove("in", "lit", "pulse"); }); }
      function cycle() {
        reset();
        people.forEach(function (h, i) { timers.push(setTimeout(function () { h.classList.add("in"); }, 120 * i)); });
        var start = 120 * people.length + 500;
        no.forEach(function (h, i) {
          timers.push(setTimeout(function () { h.classList.add("lit"); }, start + 180 * i));
        });
        timers.push(setTimeout(cycle, start + 180 * no.length + 3500));
      }
      row.classList.add("animated");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          clear();
          if (entry.isIntersecting) cycle();
          else { reset(); }
        });
      }, { threshold: 0.4 });
      io.observe(row);
    });
  })();

  // ---------- Contact form: show the chosen file name ----------
  (function () {
    var input = document.getElementById("attachment");
    var label = document.getElementById("attachment-name");
    if (!input || !label) return;
    var hint = label.textContent;
    input.addEventListener("change", function () {
      var file = input.files && input.files[0];
      if (file && file.size > 10 * 1024 * 1024) {
        input.value = "";
        label.textContent = "The file is larger than 10 MB. Please choose a smaller file.";
        label.classList.remove("chosen");
        return;
      }
      label.textContent = file ? file.name : hint;
      label.classList.toggle("chosen", !!file);
    });
  })();

  // ---------- Contact form: the privacy tick is required ----------
  (function () {
    var box = document.getElementById("consent");
    if (!box) return;
    var label = box.closest("label");
    var msg = "Please tick to accept the privacy notice before sending.";
    function check() {
      box.setCustomValidity(box.checked ? "" : msg);
      if (box.checked) label.classList.remove("invalid");
    }
    check();
    box.addEventListener("change", check);
    box.addEventListener("invalid", function () { label.classList.add("invalid"); });
  })();

  // ---------- The six grounds open as dropdowns; links to a ground open it ----------
  (function () {
    function openFor(hash) {
      if (!hash) return;
      var el = document.getElementById(hash.slice(1));
      var d = el && (el.matches("details.ground") ? el : el.querySelector("details.ground"));
      if (d) d.open = true;
    }
    openFor(location.hash);
    window.addEventListener("hashchange", function () { openFor(location.hash); });
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (a) openFor(a.getAttribute("href"));
    }, true);
  })();

  // ---------- Count how often each ground is opened (off until a GoatCounter code is set) ----------
  (function () {
    var GOATCOUNTER_CODE = ""; // e.g. "screentotreat" for https://screentotreat.goatcounter.com
    if (!GOATCOUNTER_CODE) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", "https://" + GOATCOUNTER_CODE + ".goatcounter.com/count");
    document.head.appendChild(s);
    document.querySelectorAll("details.ground").forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (!d.open || !window.goatcounter || !window.goatcounter.count) return;
        window.goatcounter.count({ path: "open-ground-" + d.getAttribute("data-ground"), title: "Opened ground: " + d.getAttribute("data-ground"), event: true });
      });
    });
  })();

  // ---------- Bars grow to their final length when scrolled into view ----------
  (function () {
    var bars = document.querySelectorAll(".hbar-fill, .thr-fill, .target-bar span");
    if (!bars.length || !("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var group = entry.target.querySelectorAll("[data-final-width]");
        group.forEach(function (bar, i) {
          setTimeout(function () { bar.style.width = bar.getAttribute("data-final-width"); }, i * 120);
        });
      });
    }, { threshold: 0.4 });

    var containers = new Set();
    bars.forEach(function (bar) {
      var w = bar.style.width;
      if (!w) return;
      bar.setAttribute("data-final-width", w);
      bar.style.width = "0%";
      bar.classList.add("grow");
      containers.add(bar.closest("figure, .target-row") || bar.parentNode);
    });
    containers.forEach(function (c) { io.observe(c); });
  })();

  // ---------- Looping waffle animation (inequity) ----------
  (function () {
    var grid = document.querySelector(".waffle-grid");
    if (!grid || !("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var on = Array.prototype.slice.call(grid.querySelectorAll(".on"));
    var timers = [], running = false;
    grid.classList.add("animated");

    function clear() { timers.forEach(clearTimeout); timers = []; }
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    function cycle() {
      on.forEach(function (c) { c.classList.remove("lit", "pulse"); c.style.animationDelay = ""; });
      grid.classList.remove("settled");
      // 1. Fill the 94 squares one by one
      on.forEach(function (c, i) { later(function () { c.classList.add("lit"); }, 200 + i * 16); });
      var filled = 200 + on.length * 16;
      // 2. A wave runs across the 94 squares, then the 6 empty squares fade back
      later(function () {
        grid.classList.add("settled");
        on.forEach(function (c, i) {
          var row = Math.floor(i / 10), col = i % 10;
          c.style.animationDelay = ((row + col) * 45) + "ms";
          c.classList.add("pulse");
        });
      }, filled + 300);
      // 3. Hold, then repeat
      later(cycle, filled + 4200);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !running) { running = true; cycle(); }
        else if (!entry.isIntersecting && running) { running = false; clear(); }
      });
    }, { threshold: 0.3 });
    io.observe(grid);
  })();

  // ---------- Screening maps: constant fill loop showing 84% against 9% ----------
  (function () {
    var maps = document.querySelectorAll(".smap");
    if (!maps.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var setup = Array.prototype.map.call(maps, function (m) {
      var dots = Array.prototype.slice.call(m.querySelectorAll(".m-dot"));
      var rate = parseFloat(m.getAttribute("data-rate"));
      var n = Math.round(dots.length * rate / 100);
      return { dots: dots, n: n, rate: rate, pct: m.querySelector(".smap-pct") };
    });
    if (reduce || !("IntersectionObserver" in window)) {
      setup.forEach(function (s) { s.dots.slice(0, s.n).forEach(function (d) { d.classList.add("on"); }); });
      return;
    }
    var timers = [], running = false;
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    var FILL = 2200, HOLD = 2600, CLEAR = 900;
    function cycle() {
      setup.forEach(function (s) {
        s.dots.forEach(function (d) { d.classList.remove("on"); });
        s.pct.textContent = "0%";
        var pick = shuffle(s.dots).slice(0, s.n);
        pick.forEach(function (d, i) { later(function () { d.classList.add("on"); }, (i / pick.length) * FILL * (s.rate / 84)); });
        var steps = 30;
        for (var k = 1; k <= steps; k++) (function (k) {
          later(function () { s.pct.textContent = Math.round(s.rate * k / steps) + "%"; }, (k / steps) * FILL * (s.rate / 84));
        })(k);
      });
      later(function () { setup.forEach(function (s) { s.dots.forEach(function (d) { d.classList.remove("on"); }); }); }, FILL + HOLD);
      later(cycle, FILL + HOLD + CLEAR);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !running) { running = true; cycle(); }
        else if (!e.isIntersecting && running) { running = false; timers.forEach(clearTimeout); timers = []; }
      });
    }, { threshold: 0.25 });
    io.observe(maps[0].closest("figure"));
  })();

  // ---------- Quick exit ----------
  // Leaves for a neutral site and replaces this page in the tab history,
  // so Back doesn't return here. It cannot erase browser history.
  var EXIT_URL = "https://www.google.com/search?q=weather";

  function quickExit() {
    try { document.body.innerHTML = ""; } catch (e) {}
    window.location.replace(EXIT_URL);
  }

  var exitButtons = document.querySelectorAll("[data-quick-exit]");
  exitButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      quickExit();
    });
  });
  if (exitButtons.length) {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") quickExit();
    });
  }
})();

/* Header becomes semi-translucent after scrolling */
(function () {
  var h = document.querySelector(".site-header");
  if (!h) return;
  function set() { h.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", set, { passive: true });
  set();
})();

/* Find menu: let hover reopen it once the cursor leaves after a choice */
(function () {
  var w = document.querySelector(".nav-wrap");
  if (!w) return;
  w.addEventListener("mouseleave", function () { w.classList.remove("closed"); });
  document.addEventListener("click", function (e) {
    var nav = document.querySelector(".site-nav"), t = document.querySelector(".nav-toggle");
    if (nav && nav.classList.contains("open") && !w.contains(e.target)) {
      nav.classList.remove("open"); if (t) t.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var nav = document.querySelector(".site-nav"), t = document.querySelector(".nav-toggle");
    if (nav) nav.classList.remove("open"); if (t) t.setAttribute("aria-expanded", "false");
    w.classList.add("closed"); setTimeout(function(){ w.classList.remove("closed"); }, 0);
  });
})();
