// Language toggle, music player, screenshot lightbox and the RLS animation.
(function () {
  "use strict";

  // Norwegian copy. The English text lives in the HTML and is kept as the fallback.
  var NO = {
    "skip": "Gå til innholdet",
    "nav.case": "Case",
    "nav.projects": "Prosjekter",
    "nav.about": "Om meg",
    "nav.contact": "Kontakt",
    "intro.title": "Hei, jeg er Henrik",
    "intro.lead": "Henrik Rolland Vågseth, utvikler i Bergen. Jeg bygger webapper fra start til slutt, fra databasen til grensesnittet.",
    "intro.page": "Her viser jeg hva jeg jobber med, og hva jeg har laget før :)",
    "intro.cta": "Se Tenant Access",
    "intro.cta2": "Andre prosjekter",
    "music.title": "Nyt litt musikk mens du blar!",
    "music.load": "Last inn Spotify-spilleren",
    "music.note": "Ingenting lastes før du trykker.",
    "case.lead": "Felles innlogging for små bedrifter som drifter egne verktøy, som Grafana og Outline. En innlogging, og ett sted å se hvem som har tilgang.",
    "case.f1": "Soloprosjekt",
    "case.demo": "Åpne live-demoen",
    "case.source": "Kildekode på GitHub",
    "case.demo.note": "Ingen konto trengs. Demoen er et eksempelfirma med kun lesetilgang, og gratisserveren kan bruke 30 sekunder på å våkne.",
    "g.overview": "Oversikt",
    "g.people": "Personer og roller",
    "g.apps": "Apper og hvem som får åpne dem",
    "g.audit": "Revisjonslogg med grunner for avvisning",
    "g.org": "Domener og webhooks",
    "case.built.h": "Hva den gjør",
    "case.built.1": "Innlogging med Google eller Microsoft, koblet til firmaet via verifisert e-postdomene",
    "case.built.2": "En egen OpenID Connect-leverandør, så Grafana og Outline logger inn gjennom den",
    "case.built.3": "Tilgangsregler per app, revisjonslogg, CSV-eksport og signerte webhooks",
    "case.built.4": "Partnermodus for IT-firmaer som passer på flere bedrifter",
    "case.learned.h": "Hva jeg lærte",
    "case.learned.p": "Test med den samme databaserollen som produksjon. En sikkerhetsgaranti som bare holder i CI, er ingen garanti.",
    "case.decisions": "De vanskelige delene",
    "d1.h": "Isolasjon i databasen",
    "d1.p": "Alle kundetabeller har påtvunget row-level security, så en spørring som glemmer kundefilteret får ingenting tilbake. I produksjon var det stille slått av, fordi Neons eierrolle går forbi RLS. Nå kjører appen som en begrenset rolle og nekter å starte hvis den kan gå forbi reglene.",
    "d1.replay": "Spill av igjen",
    "d2.h": "Tetter nOAuth-hullet",
    "d2.p": "En jobb-e-post fra Microsoft teller bare når katalogen har verifisert domenet, og kontoer kobles aldri sammen bare på e-post.",
    "d3.h": "En demo ingen kan ødelegge",
    "d3.p": "En regel på serveren avviser all skriving fra en demoøkt. Apphemmelighetene ble kastet, og besøkendes IP-adresser lagres aldri.",
    "d4.h": "Webhooks som holder seg ute",
    "d4.p": "Signerte, sendt på nytt ved feil, og avvist for private eller lokale adresser, så de ikke kan undersøke serverens eget nettverk.",
    "p.title": "Andre prosjekter",
    "p.pulse": "Skrivetester med toppliste, og innlogging med Google eller GitHub.",
    "p.mush.h": "Soppklassifisering",
    "p.mush": "Bilde inn, spiselig eller giftig ut, med artsguide. Et prosjekt fra et universitetsemne.",
    "p.witch": "Spill The Witcher 3 som en Minecraft-figur. En vert i C++ kobler de to spillene sammen.",
    "p.ml.h": "Visualisering av maskinlæring",
    "p.ml": "Trener regresjons- og klassifiseringsmodeller på ekte datasett og viser hvordan de treffer.",
    "p.live": "Nettside",
    "p.code": "Kode",
    "p.video": "Video",
    "a.title": "Om meg",
    "a.p1": "Jeg fullfører bachelorgraden i informasjonsvitenskap ved Universitetet i Bergen denne høsten og liker å ta et prosjekt hele veien, fra datamodellen til driften. Jeg driver også <a href=\"https://teknologihjelpen.no\">Teknologihjelpen</a>, enkeltpersonforetaket mitt, som selger Tenant Access og fortsatt tar noen IT-oppdrag.",
    "a.cv": "Min CV (PDF)",
    "c.title": "Ta kontakt",
    "f.made": "Laget av Henvag",
    "f.privacy": "Ingen informasjonskapsler. Besøk telles med Cloudflare Web Analytics, som ikke lagrer noe på enheten din og ikke identifiserer deg."
  };


  var STORE_KEY = "henvag.lang";
  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var english = nodes.map(function (el) { return el.innerHTML; });
  // Links with a Norwegian target, like the CV, swap their href with the language.
  var hrefNodes = Array.prototype.slice.call(document.querySelectorAll("[data-href-no]"));
  var hrefEnglish = hrefNodes.map(function (el) { return el.getAttribute("href"); });

  function storedLang() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }

  function setLang(lang) {
    nodes.forEach(function (el, i) {
      var key = el.getAttribute("data-i18n");
      el.innerHTML = lang === "no" && NO[key] ? NO[key] : english[i];
    });
    hrefNodes.forEach(function (el, i) {
      el.setAttribute("href", lang === "no" ? el.getAttribute("data-href-no") : hrefEnglish[i]);
    });
    document.documentElement.lang = lang === "no" ? "nb" : "en";
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* private mode */ }
  }

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  var initial = storedLang();
  if (!initial) {
    var nav = (navigator.language || "").toLowerCase();
    initial = /^(nb|nn|no)\b/.test(nav) ? "no" : "en";
  }
  if (initial === "no") setLang("no");

  // Music, as on the old site, but only loaded on request.
  var PLAYLIST = "37i9dQZF1DXcBWIGoYBM5M"; // swap for your own playlist id
  var loadBtn = document.getElementById("music-load");
  if (loadBtn) {
    loadBtn.addEventListener("click", function () {
      var holder = document.getElementById("music-player");
      var frame = document.createElement("iframe");
      frame.src = "https://open.spotify.com/embed/playlist/" + PLAYLIST + "?utm_source=generator&theme=0";
      frame.title = "Spotify playlist";
      frame.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      frame.loading = "lazy";
      holder.innerHTML = "";
      holder.appendChild(frame);
      holder.classList.add("loaded");
    });
  }

  // Click a screenshot to see it full size.
  var box = document.querySelector(".lightbox");
  if (box && typeof box.showModal === "function") {
    var boxImg = box.querySelector("img");
    document.querySelectorAll(".zoom").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.querySelector("img");
        boxImg.src = btn.getAttribute("data-full");
        boxImg.alt = img ? img.alt : "";
        box.showModal();
      });
    });
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target === boxImg) box.close();
    });
  } else {
    document.querySelectorAll(".zoom").forEach(function (btn) {
      btn.addEventListener("click", function () { window.open(btn.getAttribute("data-full"), "_blank"); });
    });
  }

  // Play the RLS animation once when it scrolls into view.
  var video = document.querySelector(".rls-video");
  var replay = document.querySelector(".replay");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (video) {
    if (reduce) {
      video.setAttribute("controls", "");
    } else if ("IntersectionObserver" in window) {
      var played = false;
      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !played) {
            played = true;
            video.play().catch(function () { video.setAttribute("controls", ""); });
            obs.disconnect();
          }
        });
      }, { threshold: 0.6 }).observe(video);
    }
    if (replay) {
      replay.addEventListener("click", function () {
        video.currentTime = 0;
        video.play().catch(function () {});
      });
    }
  }

  // Carousels: scroll-snap does the swiping; buttons, dots, thumbnails and arrow keys move one slide.
  // Nothing moves on its own.
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector(".carousel-track");
    var slides = Array.prototype.slice.call(track.children);
    var prev = root.querySelector("[data-prev]");
    var next = root.querySelector("[data-next]");
    var pickers = Array.prototype.slice.call(root.querySelectorAll(".carousel-dots button, .carousel-thumbs button"));
    var thumbs = root.querySelector(".carousel-thumbs");
    var current = root.querySelector("[data-current]");
    var total = root.querySelector("[data-total]");
    if (total) total.textContent = String(slides.length);

    function step() {
      return slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth;
    }
    function atEnd() { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; }
    function index() {
      if (atEnd()) return slides.length - 1;
      return Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / step())));
    }
    function goTo(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft });
    }
    function update() {
      var i = index();
      if (current) current.textContent = String(i + 1);
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = atEnd();
      pickers.forEach(function (d, k) { d.setAttribute("aria-current", String(k === i)); });
      if (thumbs && pickers[i]) {
        var t = pickers[i];
        var left = t.offsetLeft - thumbs.offsetLeft;
        if (left < thumbs.scrollLeft || left + t.offsetWidth > thumbs.scrollLeft + thumbs.clientWidth) {
          thumbs.scrollTo({ left: left - 8 });
        }
      }
    }

    // Where each slide can actually be scrolled to; the last few share the end position.
    function stops() {
      var max = track.scrollWidth - track.clientWidth;
      return slides.map(function (sl) { return Math.min(sl.offsetLeft - slides[0].offsetLeft, max); });
    }
    function move(dir) {
      var at = track.scrollLeft, list = stops(), k;
      if (dir > 0) { for (k = 0; k < list.length; k++) if (list[k] > at + 4) return track.scrollTo({ left: list[k] }); }
      else { for (k = list.length - 1; k >= 0; k--) if (list[k] < at - 4) return track.scrollTo({ left: list[k] }); }
    }
    if (prev) prev.addEventListener("click", function () { move(-1); });
    if (next) next.addEventListener("click", function () { move(1); });
    pickers.forEach(function (d, k) { d.addEventListener("click", function () { goTo(k); }); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
    });
    var ticking = false;
    track.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
