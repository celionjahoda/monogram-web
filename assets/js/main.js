(function () {
  "use strict";

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ICON = {
    play: '<svg class="i-play" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 1.2v9.6L10.5 6z" fill="currentColor"/></svg>',
    pause: '<svg class="i-pause" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 1.5h2.4v9H2.5zM7.1 1.5h2.4v9H7.1z" fill="currentColor"/></svg>'
  };

  /* ---------- Smooth scroll ---------- */

  var lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({
      duration: 1.1,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true
    });
    var raf = function (time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // In-page anchor links glide to their target, landing just below the sticky header
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href*="#"]');
    if (!a || a.target === "_blank") return;
    var url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash === "#") return;
    var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    var offset = -(document.querySelector(".site-header") || { offsetHeight: 0 }).offsetHeight - 16;
    if (lenis) lenis.scrollTo(target, { offset: offset });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: reduceMotion ? "auto" : "smooth" });
    history.pushState(null, "", url.hash);
  });

  // Arriving from another page with a #hash: settle on the target after layout
  if (location.hash && lenis) {
    window.addEventListener("load", function () {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) lenis.scrollTo(t, { offset: -(document.querySelector(".site-header").offsetHeight + 16), immediate: true });
    });
  }

  /* ---------- Mobile navigation ---------- */

  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    var setNav = function (open) {
      doc.classList.toggle("nav-open", open);
      if (lenis) open ? lenis.stop() : lenis.start();
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
    };
    toggle.addEventListener("click", function () {
      setNav(!doc.classList.contains("nav-open"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && doc.classList.contains("nav-open")) setNav(false);
    });
    window.matchMedia("(min-width: 961px)").addEventListener("change", function (e) {
      if (e.matches) setNav(false);
    });
  }

  /* ---------- Concerts ---------- */

  var MONTHS = ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro"];
  var DAYS = ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"];

  function parseDate(s) {
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }
  function fmtDate(c) {
    var d = parseDate(c.date);
    var out = pad(d.getDate()) + ". " + pad(d.getMonth() + 1) + ".";
    if (c.end) {
      var e = parseDate(c.end);
      out = d.getMonth() === e.getMonth()
        ? pad(d.getDate()) + ".–" + pad(e.getDate()) + ". " + pad(e.getMonth() + 1) + "."
        : out + " – " + pad(e.getDate()) + ". " + pad(e.getMonth() + 1) + ".";
    }
    return out;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }
  function showHTML(c, withYear) {
    var d = parseDate(c.date);
    var dow = c.end ? "víkend" : DAYS[d.getDay()];
    if (withYear) dow += " " + d.getFullYear();
    var title = esc(c.title);
    if (c.url) title = '<a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + title + "</a>";
    return (
      '<li class="show">' +
      '<div class="show-date"><time datetime="' + c.date + '">' + fmtDate(c) + "</time>" +
      '<span class="dow">' + dow + (c.time ? " · " + esc(c.time) : "") + "</span></div>" +
      '<div class="show-title">' + title +
      (c.type === "festival" ? '<span class="show-tag">· festival</span>' : "") +
      (c.note ? '<span class="show-note">' + esc(c.note) + "</span>" : "") +
      "</div>" +
      '<div class="show-place"><strong>' + esc(c.place) + "</strong>" + (c.venue ? esc(c.venue) : "") + "</div>" +
      "</li>"
    );
  }

  var all = (window.KONCERTY || []).slice().sort(function (a, b) {
    return a.date < b.date ? -1 : 1;
  });
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var upcoming = all.filter(function (c) {
    return parseDate(c.end || c.date) >= today;
  });
  var past = all.filter(function (c) {
    return parseDate(c.end || c.date) < today;
  }).reverse();

  // Upcoming list (concerts page + home page)
  document.querySelectorAll("[data-shows-upcoming]").forEach(function (el) {
    var limit = +el.getAttribute("data-limit") || Infinity;
    if (!upcoming.length) {
      el.innerHTML =
        '<div class="empty"><p>Teď zrovna nemáme nic v kalendáři.</p>' +
        '<span>Nové termíny přidáváme průběžně – nebo sledujte náš <a href="https://www.facebook.com/monogramband" target="_blank" rel="noopener">Facebook</a>.</span></div>';
      return;
    }
    el.innerHTML = '<ol class="shows">' + upcoming.slice(0, limit).map(function (c) {
      return showHTML(c, true);
    }).join("") + "</ol>";
  });

  // Next show strip (home)
  var nextEl = document.querySelector("[data-next-show]");
  if (nextEl) {
    if (upcoming.length) {
      var n = upcoming[0];
      var nd = parseDate(n.date);
      nextEl.innerHTML =
        "<strong>Příště hrajeme " + fmtDate(n) + " " + nd.getFullYear() + "</strong>" +
        esc(n.title) + ", " + esc(n.place) + (n.venue ? " – " + esc(n.venue) : "") + (n.time ? ", začátek " + esc(n.time) : "") +
        '. <a href="vystoupeni.html">Další termíny</a>';
    } else {
      nextEl.innerHTML =
        "<strong>Teď nemáme v kalendáři žádný koncert.</strong>" +
        'Nové termíny brzy přidáme. Mezitím se můžete podívat, <a href="vystoupeni.html">kde jsme hráli</a>.';
    }
  }

  // Past concerts with year tabs
  var pastEl = document.querySelector("[data-shows-past]");
  var tabsEl = document.querySelector("[data-year-tabs]");
  if (pastEl && tabsEl) {
    var years = [];
    past.forEach(function (c) {
      var y = c.date.slice(0, 4);
      if (years.indexOf(y) === -1) years.push(y);
    });
    var countEl = document.querySelector("[data-shows-count]");
    var renderYear = function (y) {
      var list = past.filter(function (c) {
        return c.date.slice(0, 4) === y;
      });
      pastEl.innerHTML = '<ol class="shows shows--past">' + list.map(function (c) {
        return showHTML(c, false);
      }).join("") + "</ol>";
      if (countEl) {
        countEl.textContent = list.length + " vystoupení v roce " + y;
      }
      tabsEl.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-selected", String(b.dataset.year === y));
        b.tabIndex = b.dataset.year === y ? 0 : -1;
      });
    };
    tabsEl.innerHTML = years.map(function (y) {
      return '<button type="button" role="tab" class="year-tab" data-year="' + y + '">' + y + "</button>";
    }).join("");
    tabsEl.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-year]");
      if (b) renderYear(b.dataset.year);
    });
    tabsEl.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var btns = Array.prototype.slice.call(tabsEl.querySelectorAll("button"));
      var i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      var next = btns[(i + (e.key === "ArrowRight" ? 1 : -1) + btns.length) % btns.length];
      next.focus();
      renderYear(next.dataset.year);
    });
    if (years.length) renderYear(years[0]);
  }

  /* ---------- Audio player ---------- */

  var audio = null;
  var current = null;

  function fmtTime(s) {
    if (!isFinite(s)) return "";
    s = Math.round(s);
    return Math.floor(s / 60) + ":" + pad(s % 60);
  }

  document.querySelectorAll(".player-track").forEach(function (btn) {
    var icon = document.createElement("span");
    icon.className = "player-icon";
    icon.innerHTML = ICON.play + ICON.pause;
    btn.prepend(icon);
    var bar = document.createElement("span");
    bar.className = "player-progress";
    bar.innerHTML = "<i></i>";
    btn.appendChild(bar);

    btn.addEventListener("click", function () {
      if (!audio) {
        audio = new Audio();
        audio.preload = "none";
        audio.addEventListener("timeupdate", function () {
          if (!current || !audio.duration) return;
          current.querySelector(".player-progress i").style.transform = "scaleX(" + audio.currentTime / audio.duration + ")";
          current.querySelector(".player-time").textContent = fmtTime(audio.currentTime) + " / " + fmtTime(audio.duration);
        });
        audio.addEventListener("ended", function () {
          var list = Array.prototype.slice.call(current.closest(".player").querySelectorAll(".player-track"));
          var i = list.indexOf(current);
          reset(current);
          if (list[i + 1]) list[i + 1].click();
          else current = null;
        });
        audio.addEventListener("pause", function () {
          if (current) {
            current.classList.remove("is-playing");
            current.classList.add("is-paused");
          }
        });
        audio.addEventListener("play", function () {
          if (current) {
            current.classList.add("is-playing");
            current.classList.remove("is-paused");
          }
        });
      }
      if (current === btn) {
        if (audio.paused) audio.play();
        else audio.pause();
        return;
      }
      if (current) reset(current);
      current = btn;
      audio.src = btn.dataset.src;
      audio.play();
    });
  });

  function reset(btn) {
    btn.classList.remove("is-playing", "is-paused");
    btn.querySelector(".player-progress i").style.transform = "scaleX(0)";
    var t = btn.querySelector(".player-time");
    t.textContent = t.dataset.len || "";
  }
  document.querySelectorAll(".player-time").forEach(function (t) {
    t.dataset.len = t.textContent;
  });

  /* ---------- Video (load YouTube only on click) ---------- */

  // Large first video: upgrade thumbnail to HD when YouTube has one (missing ones come back as a 120px placeholder)
  document.querySelectorAll(".video-play img[data-hd]").forEach(function (img) {
    var hd = new Image();
    hd.onload = function () {
      if (hd.naturalWidth > 120) img.src = hd.src;
    };
    hd.src = img.src.replace("hqdefault", "maxresdefault");
  });

  document.querySelectorAll(".video-play").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.dataset.id;
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.title = btn.getAttribute("aria-label") || "Video";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      btn.replaceWith(f);
    });
  });

  /* ---------- Gallery lightbox ---------- */

  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var box = document.querySelector(".lightbox");
  if (items.length && box) {
    var img = box.querySelector(".lightbox-img");
    var count = box.querySelector(".lightbox-count");
    var idx = 0;
    var show = function (i, animate) {
      idx = (i + items.length) % items.length;
      var src = items[idx].dataset.full;
      var alt = items[idx].querySelector("img").alt;
      if (animate && !reduceMotion) {
        box.classList.add("is-entering");
        requestAnimationFrame(function () {
          img.src = src;
          img.alt = alt;
          var done = function () {
            requestAnimationFrame(function () {
              box.classList.remove("is-entering");
            });
          };
          if (img.complete) done();
          else img.onload = done;
        });
      } else {
        // Keyboard / arrow navigation: no animation, it should feel instant
        img.src = src;
        img.alt = alt;
      }
      count.textContent = idx + 1 + " / " + items.length;
    };
    items.forEach(function (it, i) {
      it.addEventListener("click", function () {
        if (lenis) lenis.stop();
        box.showModal();
        show(i, true);
      });
    });
    box.addEventListener("close", function () {
      if (lenis) lenis.start();
    });
    box.querySelector(".lightbox-prev").addEventListener("click", function () { show(idx - 1); });
    box.querySelector(".lightbox-next").addEventListener("click", function () { show(idx + 1); });
    box.querySelector(".lightbox-close").addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("lightbox-inner")) box.close();
    });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
    // Swipe on touch
    var sx = null;
    box.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) sx = e.touches[0].clientX;
    }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ---------- Bio language switch ---------- */

  document.querySelectorAll(".lang-switch").forEach(function (sw) {
    sw.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-lang]");
      if (!b) return;
      var lang = b.dataset.lang;
      sw.querySelectorAll("button").forEach(function (x) {
        x.setAttribute("aria-pressed", String(x === b));
      });
      document.querySelectorAll("[data-lang-block]").forEach(function (blk) {
        blk.hidden = blk.dataset.langBlock !== lang;
      });
    });
  });

  /* ---------- Shop ---------- */

  var form = document.querySelector("[data-order-form]");
  if (form) {
    var COD = 80;
    var products = Array.prototype.slice.call(document.querySelectorAll(".product"));
    var money = function (n) {
      return n.toLocaleString("cs-CZ") + " Kč";
    };
    var recalc = function () {
      var sum = 0;
      var pieces = 0;
      products.forEach(function (p) {
        var input = p.querySelector("input");
        var q = Math.max(0, Math.min(20, parseInt(input.value, 10) || 0));
        input.value = q;
        p.querySelector("[data-dec]").disabled = q === 0;
        sum += q * +p.dataset.price;
        pieces += q;
      });
      document.querySelector("[data-sum]").textContent = money(sum);
      document.querySelector("[data-cod]").textContent = pieces ? money(COD) : "—";
      document.querySelector("[data-total]").textContent = money(pieces ? sum + COD : 0);
      return pieces;
    };
    products.forEach(function (p) {
      var input = p.querySelector("input");
      p.querySelector("[data-inc]").addEventListener("click", function () {
        input.value = (+input.value || 0) + 1;
        recalc();
      });
      p.querySelector("[data-dec]").addEventListener("click", function () {
        input.value = (+input.value || 0) - 1;
        recalc();
      });
      input.addEventListener("input", recalc);
    });
    recalc();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      if (form.querySelector(".hp input").value) return;
      if (!recalc()) {
        status.textContent = "Vyberte prosím alespoň jedno CD.";
        return;
      }
      var fd = new FormData(form);
      var lines = ["Objednávka CD z webu monogram.cz", ""];
      products.forEach(function (p) {
        var q = +p.querySelector("input").value;
        if (q) lines.push(q + "× " + p.dataset.name + " (" + money(+p.dataset.price) + "/ks)");
      });
      lines.push("Dobírka: " + money(COD));
      lines.push("Celkem: " + document.querySelector("[data-total]").textContent, "");
      lines.push(fd.get("jmeno") + " " + fd.get("prijmeni"));
      lines.push(fd.get("ulice"));
      lines.push(fd.get("psc") + " " + fd.get("mesto"));
      lines.push("E-mail: " + fd.get("email"));
      if (fd.get("telefon")) lines.push("Telefon: " + fd.get("telefon"));
      if (fd.get("zprava")) lines.push("", "Zpráva:", fd.get("zprava"));
      var body = lines.join("\n");

      var endpoint = form.getAttribute("data-endpoint");
      if (endpoint) {
        // Napojení na formulářovou službu (např. Formspree) – stačí doplnit data-endpoint
        status.textContent = "Odesílám…";
        fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ _subject: "Objednávka CD – " + fd.get("prijmeni"), email: fd.get("email"), objednavka: body })
        }).then(function (r) {
          if (!r.ok) throw new Error();
          form.reset();
          products.forEach(function (p) { p.querySelector("input").value = 0; });
          recalc();
          status.textContent = "Díky! Objednávku jsme přijali, ozveme se e-mailem.";
        }).catch(function () {
          status.textContent = "Odeslání se nepovedlo. Napište nám prosím přímo na " + form.dataset.mail + ".";
        });
      } else {
        window.location.href =
          "mailto:" + form.dataset.mail +
          "?subject=" + encodeURIComponent("Objednávka CD – " + fd.get("prijmeni")) +
          "&body=" + encodeURIComponent(body);
        status.textContent = "Otevřeli jsme váš e-mailový program s připravenou objednávkou – stačí ji odeslat.";
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */

  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("is-in"); });
  }

  var y = document.querySelector("[data-current-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
