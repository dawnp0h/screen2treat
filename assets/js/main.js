// Site-wide scripts: shared header and footer, mobile menu, quick exit.
// Edit NAV or the footer here once, and every page updates.

(function () {
  var SITE_NAME = "Screen to Treat";

  var NAV = [
    { href: "#the-case", label: "The case" },
    { href: "#objections", label: "Common objections" },
    { href: "#evidence", label: "Latest evidence" },
    { href: "#path", label: "WHO 90-70-90" },
    { href: "#response", label: "Screen to Treat Pathway" },
    { href: "#about", label: "About" },
    { href: "#get-involved", label: "Get involved" },
    { href: "#contact", label: "Contact" },
    { href: "#references", label: "References" },
    { href: "#figures", label: "List of Figures" }
  ];
  // Menu labels always match each section's label on the page.
  NAV.forEach(function (item) {
    var el = document.querySelector(item.href + " .eyebrow");
    if (el && el.textContent.trim()) item.label = el.textContent.trim();
  });
  // Footer only. The footer's first row always mirrors NAV above.
  var LEGAL = [
    { href: "#privacy", label: "Privacy Notice" },
    { href: "#terms", label: "Terms of Use" }
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
      '    <div class="logo-wrap"><a class="logo head-logo" href="#home" aria-label="' + SITE_NAME + ', home" aria-controls="site-nav" aria-expanded="false">' + SITE_NAME + '<span class="logo-dots" aria-hidden="true"><i></i><i></i><i></i></span></a><span class="current-section" aria-hidden="true"><span class="cs-sep">·</span><span class="cs-name"></span></span>' +
      '    <nav class="site-nav" id="site-nav" aria-label="Main"><ul>' + links + '</ul><a class="logo nav-logo" href="#home" aria-label="' + SITE_NAME + ', home">' + SITE_NAME + '<span class="logo-dots" aria-hidden="true"><i></i><i></i><i></i></span></a></nav></div>' +
      '    <div class="nav-wrap"><div class="search-box" role="search"><input class="site-search" id="site-search" type="search" placeholder="Find" aria-label="Find on this site" autocomplete="off" spellcheck="false" aria-controls="search-results" aria-expanded="false"></div>' +
      '    <div class="search-results" id="search-results" role="listbox" aria-label="Search results"></div></div>' +
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
      '      <div><strong>Sections</strong><ul>' +
      NAV.map(function (item) { return '<li><a href="' + item.href + '">' + item.label + "</a></li>"; }).join("") +
      "      </ul></div>" +
      '      <div><strong>Legal</strong><ul>' +
      LEGAL.map(function (item) { return '<li><a href="' + item.href + '">' + item.label + "</a></li>"; }).join("") +
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
      var w = document.querySelector(".logo-wrap");
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
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce) and (max-width: 0px)").matches;
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
    var noMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce) and (max-width: 0px)").matches;
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
    var noMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce) and (max-width: 0px)").matches;
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

  // ---------- Dartboards for the 90 70 90 targets ----------
  (function () {
    var row = document.querySelector(".target-row");
    if (!row) return;
    var boards = Array.prototype.slice.call(row.querySelectorAll(".board"));
    if (!boards.length || !("IntersectionObserver" in window)) return;
    var run = 0;
    function count(b, token, delay) {
      var el = b.querySelector(".board-num"), target = +b.getAttribute("data-target"), start = null;
      setTimeout(function () {
        function tick(t) {
          if (token !== run) return;
          if (start === null) start = t;
          var k = Math.min(1, (t - start) / 900), e = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(target * e) + "%";
          if (k < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }, delay);
    }
    boards.forEach(function (b) { b.classList.add("armed"); });
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var token = ++run;
          boards.forEach(function (b, i) {
            
            setTimeout(function () { if (token === run) { b.classList.add("play"); } }, 0);
          });
        } else { run++; boards.forEach(function (b) { b.classList.remove("play"); }); }
      });
    }, { threshold: 0.5 }).observe(row);
  })();

  // ---------- People figure: 9 in 10 cannot access radiotherapy ----------
  (function () {
    var rows = document.querySelectorAll(".people-row");
    if (!rows.length) return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce) and (max-width: 0px)").matches) return;
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
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce) and (max-width: 0px)").matches) return;

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
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce) and (max-width: 0px)").matches) return;
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
        var cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length || 10;
        on.forEach(function (c, i) {
          var row = Math.floor(i / cols), col = i % cols;
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
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce) and (max-width: 0px)").matches;
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

/* Section menu under the header logo: hover on computers, tap on touch screens */
(function () {
  var w = document.querySelector(".logo-wrap");
  var headLogo = w && w.querySelector(".head-logo");
  var menu = w && w.querySelector(".site-nav");
  if (headLogo && menu) {
    var touch = window.matchMedia && window.matchMedia("(hover: none)");
    document.addEventListener("click", function (e) {
      if (!headLogo.contains(e.target) || !(touch && touch.matches)) return;
      if (!menu.classList.contains("open")) {
        e.preventDefault(); e.stopImmediatePropagation();
        menu.classList.add("open"); headLogo.setAttribute("aria-expanded", "true");
      } else {
        menu.classList.remove("open"); headLogo.setAttribute("aria-expanded", "false");
      }
    }, true);
  }
  if (!w) return;
  w.addEventListener("mouseleave", function () { w.classList.remove("closed"); });
  document.addEventListener("click", function (e) {
    var nav = document.querySelector(".site-nav"), t = document.querySelector(".head-logo");
    if (nav && nav.classList.contains("open") && !w.contains(e.target)) {
      nav.classList.remove("open"); if (t) t.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var nav = document.querySelector(".site-nav"), t = document.querySelector(".head-logo");
    if (nav) nav.classList.remove("open"); if (t) t.setAttribute("aria-expanded", "false");
    w.classList.add("closed"); setTimeout(function(){ w.classList.remove("closed"); }, 0);
  });
})();

/* Site search under Find: searches only the text of this website */
(function () {
  var wrap = document.querySelector(".nav-wrap");
  var input = document.getElementById("site-search");
  var box = document.getElementById("search-results");
  if (!wrap || !input || !box) return;

  var index = null;
  function clean(t) { return (t || "").replace(/\s+/g, " ").trim(); }
  function sectionTitle(el) {
    var block = el.closest(".page-block");
    var label = block && block.querySelector(".eyebrow");
    return label ? clean(label.textContent) : "";
  }
  function headingFor(el) {
    var g = el.closest("details.ground");
    if (g) { var h = g.querySelector("summary h2, summary h3"); if (h) return clean(h.textContent); }
    var node = el;
    while (node && node !== document.body) {
      var prev = node.previousElementSibling;
      while (prev) {
        if (/^H[1-4]$/.test(prev.tagName)) return clean(prev.textContent);
        var inner = prev.querySelectorAll && prev.querySelectorAll("h1,h2,h3,h4");
        if (inner && inner.length) return clean(inner[inner.length - 1].textContent);
        prev = prev.previousElementSibling;
      }
      node = node.parentElement;
      if (node && node.classList && node.classList.contains("page-block")) break;
    }
    return "";
  }
  function build() {
    index = [];
    var sel = "h1, h2, h3, h4, p, li, figcaption, summary .ground-lead, .stat-label, td, th, blockquote";
    document.querySelectorAll("main .page-block").forEach(function (block) {
      if (block.id === "references" || block.id === "figures") return;
      block.querySelectorAll(sel).forEach(function (el) {
        if (el.closest(".search-results, form, .visually-hidden, [aria-hidden='true']")) return;
        if (el.tagName === "LI" && el.querySelector("p, li")) return;
        if (el.tagName !== "FIGCAPTION" && el.closest("[role='img']")) return;
        var text = clean(el.textContent);
        if (text.length < 3) return;
        var isHead = /^H[1-4]$/.test(el.tagName);
        index.push({ el: el, text: text, lower: text.toLowerCase(), head: isHead,
          section: sectionTitle(el), title: isHead ? text : headingFor(el) });
      });
    });
  }
  function esc(t) { return t.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function snippet(text, words) {
    var lower = text.toLowerCase(), at = lower.indexOf(words[0]);
    var start = Math.max(0, at - 50), end = Math.min(text.length, at + 110);
    var out = (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
    out = esc(out);
    words.forEach(function (w) {
      var re = new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      out = out.replace(re, "<mark>$1</mark>");
    });
    return out;
  }
  var results = [], active = -1;
  function render(q) {
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) { wrap.classList.remove("searching"); box.innerHTML = ""; input.setAttribute("aria-expanded", "false"); return; }
    if (!index) build();
    wrap.classList.add("searching");
    input.setAttribute("aria-expanded", "true");
    var seen = {}, hits = [];
    index.forEach(function (it) {
      for (var i = 0; i < words.length; i++) if (it.lower.indexOf(words[i]) < 0) return;
      var key = it.text.slice(0, 80);
      if (seen[key]) return; seen[key] = 1;
      var score = (it.head ? 0 : 10) + it.lower.indexOf(words[0]) / 1000;
      hits.push({ it: it, score: score });
    });
    hits.sort(function (a, b) { return a.score - b.score; });
    results = hits.slice(0, 8).map(function (h) { return h.it; });
    active = -1;
    if (!results.length) { box.innerHTML = '<p class="search-empty">No matches on this site.</p>'; return; }
    box.innerHTML = results.map(function (it, i) {
      var meta = [it.section, it.head ? "" : it.title].filter(Boolean).filter(function (v, j, a) { return a.indexOf(v) === j; }).join(" · ");
      return '<button type="button" class="search-hit" role="option" data-i="' + i + '">' +
        (meta ? '<span class="search-where">' + esc(meta) + "</span>" : "") +
        '<span class="search-text">' + snippet(it.text, words) + "</span></button>";
    }).join("") + (hits.length > 8 ? '<p class="search-more">' + (hits.length - 8) + " more. Add a word to narrow the search.</p>" : "");
  }
  function go(i) {
    var it = results[i]; if (!it) return;
    var d = it.el.closest("details");
    if (d && !d.open) d.open = true;
    var h = document.querySelector(".site-header");
    var y = it.el.getBoundingClientRect().top + window.pageYOffset - (h ? h.getBoundingClientRect().height : 0) - 24;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce) and (max-width: 0px)").matches;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    it.el.classList.remove("search-flash"); void it.el.offsetWidth; it.el.classList.add("search-flash");
    input.value = ""; render(""); input.blur();
    wrap.classList.add("closed");
  }
  function setActive(n) {
    var btns = box.querySelectorAll(".search-hit");
    if (!btns.length) return;
    active = (n + btns.length) % btns.length;
    btns.forEach(function (b, j) { b.classList.toggle("active", j === active); b.setAttribute("aria-selected", j === active ? "true" : "false"); });
    btns[active].scrollIntoView({ block: "nearest" });
  }
  input.addEventListener("input", function () { wrap.classList.remove("closed"); render(input.value); });
  input.addEventListener("focus", function () { wrap.classList.remove("closed"); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
    else if (e.key === "Enter") { e.preventDefault(); go(active >= 0 ? active : 0); }
    else if (e.key === "Escape") { input.value = ""; render(""); input.blur(); }
  });
  box.addEventListener("mousedown", function (e) { e.preventDefault(); });
  box.addEventListener("click", function (e) {
    var b = e.target.closest(".search-hit"); if (b) go(+b.getAttribute("data-i"));
  });
  wrap.addEventListener("mouseleave", function () { if (document.activeElement !== input) wrap.classList.remove("closed"); });
})();

/* Get involved buttons preselect the matching contact topic */
document.addEventListener("click", function (e) {
  var a = e.target.closest && e.target.closest("a[data-topic]");
  var sel = document.getElementById("topic");
  if (a && sel) sel.value = a.getAttribute("data-topic");
});

/* Back to top button */
(function () {
  var b = document.createElement("button");
  b.type = "button";
  b.className = "to-top";
  b.setAttribute("aria-label", "Back to top");
  b.innerHTML = '<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false"><polygon points="16,14 6,24 7.4,25.4 16,16.8 24.6,25.4 26,24" fill="currentColor"/><rect x="4" y="8" width="24" height="2" fill="currentColor"/></svg>';
  b.insertAdjacentHTML("afterbegin", '<svg class="to-top-ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle class="ring-track" cx="50" cy="50" r="46"/><circle class="ring-fill" cx="50" cy="50" r="46" pathLength="100"/></svg>');
  document.body.appendChild(b);
  var fill = b.querySelector(".ring-fill");
  function set() {
    b.classList.toggle("on", window.scrollY > window.innerHeight);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    fill.style.strokeDashoffset = (100 - p * 100).toFixed(2);
  }
  window.addEventListener("resize", set, { passive: true });
  window.addEventListener("scroll", set, { passive: true });
  set();
  b.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
    b.blur();
  });
})();

/* Chat bubbles: sent one after the other, then delivered, then (if set) seen */
(function () {
  var heads = document.querySelectorAll("h1.chat");
  if (!heads.length) return;
  document.documentElement.classList.add("js");
  heads.forEach(function (h) {
    var bubbles = h.querySelectorAll(".bubble");
    var status = h.nextElementSibling && h.nextElementSibling.classList.contains("chat-seen") ? h.nextElementSibling : null;
    var finalText = status ? status.textContent.trim() : "";
    var played = false;
    function play() {
      if (played) return; played = true;
      var t = 250;
      bubbles.forEach(function (b, i) {
        setTimeout(function () { b.classList.add("sent"); }, t);
        if (i < bubbles.length - 1) t += 1350;
      });
      t += 650;
      setTimeout(function () { if (status) { status.textContent = "Delivered"; status.classList.add("on"); } }, t);
      if (status && finalText !== "Delivered") {
        t += 1750;
        setTimeout(function () {
          status.classList.remove("on");
          setTimeout(function () { status.textContent = finalText; status.classList.add("on"); }, 250);
        }, t);
      }
    }
    if (!("IntersectionObserver" in window)) { play(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { play(); io.disconnect(); } });
    }, { threshold: 0.6 });
    io.observe(h);
  });
})();

/* Current section name beside the header logo */
(function () {
  var box = document.querySelector(".current-section");
  var nameEl = box && box.querySelector(".cs-name");
  if (!box || !nameEl) return;
  var labels = {};
  (typeof NAV !== "undefined" ? NAV : []).forEach(function (n) { labels[n.href.slice(1)] = n.label; });
  document.querySelectorAll(".site-nav a[href^='#']").forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    if (!labels[id] && a.textContent.trim()) labels[id] = a.textContent.trim();
  });
  labels.privacy = labels.privacy || "Privacy Notice";
  labels.terms = labels.terms || "Terms of Use";
  var blocks = Array.prototype.slice.call(document.querySelectorAll("main .page-block[id]"));
  var current = null, timer = null, ticking = false;
  function pick() {
    ticking = false;
    var header = document.querySelector(".site-header");
    var line = (header ? header.getBoundingClientRect().bottom : 0) + window.innerHeight * 0.25;
    var id = null;
    blocks.forEach(function (b) { if (b.getBoundingClientRect().top <= line) id = b.id; });
    var label = id && id !== "home" ? labels[id] || "" : "";
    if (label === current) return;
    current = label;
    box.classList.remove("on");
    clearTimeout(timer);
    timer = setTimeout(function () {
      nameEl.textContent = label;
      if (label) box.classList.add("on");
    }, 180);
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(pick); } }, { passive: true });
  window.addEventListener("resize", pick);
  pick();
})();

/* Copy citation button */
document.addEventListener("click", function (e) {
  var btn = e.target.closest && e.target.closest(".copy-cite");
  if (!btn) return;
  var src = document.getElementById(btn.getAttribute("data-copy"));
  if (!src) return;
  var text = src.textContent.trim();
  function done() {
    btn.textContent = "Copied";
    btn.classList.add("done");
    setTimeout(function () { btn.textContent = "Copy citation"; btn.classList.remove("done"); }, 2000);
  }
  function fallback() {
    var t = document.createElement("textarea");
    t.value = text; t.setAttribute("readonly", ""); t.style.position = "absolute"; t.style.left = "-9999px";
    document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); done(); } catch (err) {}
    document.body.removeChild(t);
  }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done, fallback);
  } else { fallback(); }
});

/* Elimination goal chart animation */
(function () {
  var charts = document.querySelectorAll(".goal-chart");
  if (!charts.length) return;
  if (!("IntersectionObserver" in window)) { charts.forEach(function (c) { c.classList.add("play"); }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("play"); io.unobserve(e.target); } });
  }, { threshold: 0.5 });
  charts.forEach(function (c) { io.observe(c); });
})();

/* Night mode and colour-accessible palette toggles */
(function () {
  var root = document.documentElement;
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var moon = '<svg class="when-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  var sun = '<svg class="when-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/></svg>';
  var eye = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M12 9v6" /></svg>';
  var box = document.createElement("div");
  box.className = "tools";
  box.innerHTML =
    '<button type="button" class="tool-btn" id="toggle-theme" aria-pressed="false" aria-label="Night mode" title="Night mode">' + moon + sun + '</button>' +
    '<button type="button" class="tool-btn" id="toggle-palette" aria-pressed="false" aria-label="Colour-accessible palette" title="Colour-accessible palette">' + eye + '</button>';
  document.body.appendChild(box);
  var tBtn = document.getElementById("toggle-theme"), pBtn = document.getElementById("toggle-palette");
  function sync() {
    tBtn.setAttribute("aria-pressed", root.getAttribute("data-theme") === "dark" ? "true" : "false");
    pBtn.setAttribute("aria-pressed", root.getAttribute("data-palette") === "cvd" ? "true" : "false");
  }
  function animate() { root.classList.add("theme-anim"); setTimeout(function () { root.classList.remove("theme-anim"); }, 400); }
  tBtn.addEventListener("click", function () {
    animate();
    var dark = root.getAttribute("data-theme") !== "dark";
    if (dark) root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme");
    save("s2t-theme", dark ? "dark" : "light"); sync();
  });
  pBtn.addEventListener("click", function () {
    animate();
    var on = root.getAttribute("data-palette") !== "cvd";
    if (on) root.setAttribute("data-palette", "cvd"); else root.removeAttribute("data-palette");
    save("s2t-palette", on ? "cvd" : "default"); sync();
  });
  sync();
})();
