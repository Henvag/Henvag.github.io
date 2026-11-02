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
    "intro.kicker": "Hei, jeg er",
    "intro.lead": "Utvikler og student i informasjonsvitenskap ved Universitetet i Bergen. Jeg bygger webapplikasjoner fra start til slutt, fra regler i databasen til grensesnittet, og trives best med innlogging, data for mange kunder i samme system og de delene som må være riktige.",
    "intro.page": "Denne siden er hovedsakelig for å vise hva jeg jobber med, og hva jeg har gjort tidligere :)",
    "intro.cta": "Se Tenant Access",
    "intro.cta2": "Alle prosjekter",
    "music.title": "Nyt litt musikk mens du blar!",
    "music.load": "Last inn Spotify-spilleren",
    "music.note": "Laster inn en spilleliste fra Spotify. Ingenting lastes før du trykker.",
    "case.label": "Utvalgt case",
    "case.lead": "Felles innlogging og tilgangsstyring for små bedrifter som drifter egne verktøy, som Grafana, Outline og Gitea. Folk logger inn med Google eller Microsoft, administratorer bestemmer hvem som får åpne hvilken app, og hver innlogging og avvisning blir logget.",
    "case.role": "Rolle",
    "case.role.v": "Soloprosjekt, fra skjema til drift",
    "case.stack": "Teknologi",
    "case.hosting": "Kjører på",
    "case.demo": "Åpne live-demoen",
    "case.source": "Kildekode på GitHub",
    "case.demo.note": "Demoen krever ingen konto. Du logges inn som eier av et eksempelfirma, kun med lesetilgang. Gratis hosting kan bruke rundt 30 sekunder på å våkne.",
    "case.problem.h": "Problemet",
    "case.problem.p": "Et firma på 5 til 50 personer som drifter egne verktøy, ender opp med en egen innlogging for hvert av dem, og ingen samlet oversikt over hvem som har tilgang, eller noe sted å stenge noen ute. De store identitetsproduktene løser dette, men de er priset og laget for mye større organisasjoner.",
    "case.built.h": "Hva jeg bygde",
    "case.built.1": "Innlogging med Google eller Microsoft, koblet til riktig firma via det verifiserte e-postdomenet",
    "case.built.2": "En egen OpenID Connect-leverandør, slik at apper som Grafana logger inn gjennom den (code flow med PKCE, RS256-tokens, JWKS)",
    "case.built.3": "Tilgangsregler per app, revisjonslogg med CSV-eksport og signerte webhooks",
    "case.built.4": "Partnermodus, slik at et eksternt IT-firma kan administrere flere kundefirmaer",
    "case.built.5": "Betaling med Stripe, grensesnitt på norsk og engelsk, og en offentlig demo med kun lesetilgang",
    "case.decisions": "Valg det er verdt å snakke om",
    "d1.h": "Isolasjon som databasen håndhever, ikke koden",
    "d1.p1": "Den klassiske feilen i systemer med mange kunder er én spørring som glemmer <code>WHERE tenant_id = ?</code>. Jeg la regelen i Postgres i stedet: alle kundetabeller har row-level security, påtvunget selv for tabelleieren, og hver forespørsel setter kunden for sin transaksjon. Uten kunde satt blir lesing tom og skriving avvist.",
    "d1.p2": "Så oppdaget jeg at produksjon hoppet stille over alt sammen. Neons standard eierrolle har <code>BYPASSRLS</code>, så alle reglene ble ignorert. Testene fanget det ikke fordi de kjørte som en vanlig rolle. Løsningen ble en begrenset rolle for appen, en egen for migreringer, og en sjekk ved oppstart som nekter å kjøre hvis appens rolle kan gå forbi reglene.",
    "d1.cap": "Samme idé som animasjon på forsiden til Tenant Access.",
    "d1.replay": "Spill av igjen",
    "d2.h": "Stenger nOAuth-overtakelsen",
    "d2.p": "Med Microsofts innlogging for flere organisasjoner kan hvem som helst opprette en katalog og gi en bruker en hvilken som helst e-postadresse. Å stole på den adressen ville latt en fremmed logge inn som kollegaen din. E-post fra jobbkontoer teller bare når tokenet sier at katalogen har verifisert domenet, og en eksisterende konto kobles aldri til en ny identitet bare på grunn av e-post.",
    "d3.h": "En offentlig demo ingen kan ødelegge",
    "d3.p": "Anonyme besøkende får en administratorplass i et eksempelfirma, så plassen må være ufarlig på serveren, ikke bare i grensesnittet. Én felles avhengighet avviser all skriving fra en demoøkt, demoappenes hemmeligheter ble kastet da dataene ble lagt inn, og besøkendes IP-adresser lagres aldri.",
    "d4.h": "Webhooks som ikke kan rettes innover",
    "d4.p": "Hendelser i revisjonsloggen legger leveransene sine i kø i samme transaksjon som hendelsen, og en bakgrunnsjobb signerer dem med Standard Webhooks-headere og prøver på nytt i omtrent sju timer. Private og lokale adresser avvises før hver sending, og omdirigeringer følges ikke, så en webhook kan ikke brukes til å undersøke serverens eget nettverk.",
    "case.gallery": "Fra demofirmaet",
    "g.people": "Personer og roller",
    "g.apps": "Apper og hvem som får åpne dem",
    "g.audit": "Revisjonslogg med grunner for avvisning",
    "g.org": "Domener bevist med DNS, og webhooks",
    "case.learned.h": "Hva jeg tok med meg",
    "case.learned.p": "Test mot den samme databaserollen som produksjon bruker. En sikkerhetsegenskap som bare holder i CI, er ingen egenskap. Jeg lærte også å holde omfanget lite med vilje: to roller pluss en eier, én container, ett domene, én cookie.",
    "case.next.h": "Hva jeg ville gjort videre",
    "case.next.p": "Automatisk brukeropprettelse (SCIM) fra Google Workspace og Entra, en skjerm for å rotere signeringsnøklene, og betalt hosting uten kaldstart når de første firmaene tar det i bruk.",
    "p.label": "Andre prosjekter",
    "p.title": "Mindre ting jeg har laget",
    "p.pulse": "En side for skrivehastighet med toppliste. Logg inn med Google eller GitHub for å ta vare på resultatene dine.",
    "p.mush.h": "Soppklassifisering",
    "p.mush.badge": "Spiselig",
    "p.mush": "Last opp et bilde og få spiselig eller giftig, med sikkerhet, pluss en søkbar artsguide. Laget i et universitetsemne (INFO212).",
    "p.witch": "Et eksperiment som lar deg spille The Witcher 3 som en Minecraft-figur, med bevegelse, inventar og bygging fra Minecraft inne i Witcher-verdenen. En vert skrevet i C++ snakker med en Minecraft-mod over nettverksprotokollen dens.",
    "p.ml.h": "Visualisering av maskinlæring",
    "p.ml": "En webapp som trener regresjons- og klassifiseringsmodeller på flere datasett og viser hvordan de treffer, på norsk og engelsk.",
    "p.live": "Nettside",
    "p.code": "Kode",
    "p.video": "Video",
    "a.label": "Om meg",
    "a.title": "Litt om meg",
    "a.p1": "Jeg studerer informasjonsvitenskap ved Universitetet i Bergen. Jeg liker å ta et prosjekt hele veien: designe datamodellen, skrive backend og grensesnitt, og få det ut i drift for ekte brukere.",
    "a.p2": "Ved siden av driver jeg <a href=\"https://teknologihjelpen.no\">Teknologihjelpen</a>, mitt eget enkeltpersonforetak, som tilbyr hjelp med teknologi.",
    "s.lang": "Språk",
    "s.back": "Backend",
    "s.front": "Frontend",
    "s.id": "Identitet",
    "s.ops": "Drift",
    "c.title": "Ta kontakt",
    "c.p": "Jeg er åpen for utviklerstillinger og internship. Den enkleste måten å nå meg på står under.",
    "f.made": "Laget av Henvag",
    "f.note": "Ren HTML, CSS og litt JavaScript, på GitHub Pages."
  };

  var STORE_KEY = "henvag.lang";
  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var english = nodes.map(function (el) { return el.innerHTML; });

  function storedLang() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }

  function setLang(lang) {
    nodes.forEach(function (el, i) {
      var key = el.getAttribute("data-i18n");
      el.innerHTML = lang === "no" && NO[key] ? NO[key] : english[i];
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

  // Projects carousel: scroll-snap does the swiping; buttons, dots and arrow keys move one card.
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector(".carousel-track");
    var slides = Array.prototype.slice.call(track.children);
    var prev = root.querySelector("[data-prev]");
    var next = root.querySelector("[data-next]");
    var dots = Array.prototype.slice.call(root.querySelectorAll(".carousel-dots button"));
    var current = root.querySelector("[data-current]");
    var total = root.querySelector("[data-total]");
    if (total) total.textContent = String(slides.length);

    function step() {
      return slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth;
    }
    function index() {
      return Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / step())));
    }
    function goTo(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft });
    }
    function update() {
      var i = index();
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (atEnd) i = slides.length - 1;
      if (current) current.textContent = String(i + 1);
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = atEnd;
      dots.forEach(function (d, k) { d.setAttribute("aria-current", String(k === i)); });
    }

    if (prev) prev.addEventListener("click", function () { goTo(index() - 1); });
    if (next) next.addEventListener("click", function () { goTo(index() + 1); });
    dots.forEach(function (d, k) { d.addEventListener("click", function () { goTo(k); }); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(index() + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index() - 1); }
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
