/* SAMBO · probador: el club (Sport) o la empresa (Work) escribe su nombre, elige sus colores y ve piezas con su identidad.
   Cada modo guarda su elección en el navegador. Comparte el nombre con la consulta (window.SAMBO_CLUB / SAMBO_EMPRESA + evento "sambo-club").
   Cambia de modo con el evento "sambo-vista" que emite app.js. */
(function () {
  "use strict";

  const TELEFONO = "5491141754921";
  const COLORES = [
    ["bordo", "Bordó", "#7A1F2B"], ["rojo", "Rojo", "#C62828"], ["naranja", "Naranja", "#E8692A"], ["amarillo", "Amarillo", "#F2C230"],
    ["verde", "Verde", "#1F7A3A"], ["oliva", "Verde oliva", "#556125"], ["celeste", "Celeste", "#6FB3E0"], ["azul", "Azul", "#1D3E8A"],
    ["violeta", "Violeta", "#5B3A8C"], ["negro", "Negro", "#161712"], ["gris", "Gris", "#8C8F91"], ["blanco", "Blanco", "#FFFFFF"]
  ];
  const MODOS = {
    sport: { clave: "sambo-clubes-probador", inicial: { club: "", ini: "", c1: "bordo", c2: "blanco" }, defecto: "Tu Club", iniDefecto: "TC",
      placeholder: "Tu Club", marca: "escudo", catalogo: "el catálogo para clubes" },
    work: { clave: "sambo-work-probador", inicial: { club: "", ini: "", c1: "azul", c2: "blanco" }, defecto: "Tu Empresa", iniDefecto: "TE",
      placeholder: "Tu Empresa", marca: "logo", catalogo: "el catálogo de home office" }
  };
  const CHICAS = new Set(["de", "del", "la", "las", "el", "los", "y", "e", "s.a.", "srl", "sa"]);

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const hexDe = id => (COLORES.find(c => c[0] === id) || COLORES[0])[2];
  const nombreDe = id => (COLORES.find(c => c[0] === id) || COLORES[0])[1];

  /* contraste WCAG para elegir texto claro u oscuro sobre cada color */
  const lum = hex => {
    const v = hex.replace("#", "").match(/../g).map(x => parseInt(x, 16) / 255).map(c => c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4));
    return .2126 * v[0] + .7152 * v[1] + .0722 * v[2];
  };
  const contraste = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const tinta = hex => contraste(hex, "#161712") > contraste(hex, "#F7F3EA") ? "#161712" : "#F7F3EA";

  const leer = m => { try { const s = JSON.parse(localStorage.getItem(MODOS[m].clave) || "null"); if (s && typeof s === "object") return { ...MODOS[m].inicial, ...s }; } catch (e) { /* sin almacenamiento */ } return { ...MODOS[m].inicial }; };
  const estados = { sport: leer("sport"), work: leer("work") };
  let modo = "sport";
  const est = () => estados[modo];
  const cfg = () => MODOS[modo];
  const guardar = () => { try { localStorage.setItem(cfg().clave, JSON.stringify(est())); } catch (e) { /* idem */ } };

  const iniciales = nombre => nombre.split(/\s+/).filter(w => w && !CHICAS.has(w.toLowerCase())).slice(0, 3).map(w => w[0]).join("").toUpperCase();
  const nombre = () => est().club.trim() || cfg().defecto;
  const ini = () => (est().ini.trim() || iniciales(nombre()) || cfg().iniDefecto).slice(0, 4).toUpperCase();

  /* ---------- piezas (lienzo 200 × 200) ---------- */
  const TRAZO = 'stroke="#161712" stroke-width="4" stroke-linejoin="round"';
  const ARGOLLA = '<circle cx="100" cy="24" r="14" fill="none" stroke="#8C8F91" stroke-width="5"/><path d="M100 38v10" stroke="#8C8F91" stroke-width="5"/>';
  const letras = (x, y, size, fill, txt) => `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Bagel Fat One, sans-serif" font-size="${size}" fill="${fill}">${txt}</text>`;

  function piezasSport(c1, c2, t1, t2, i, tam) {
    return [
      ["Llavero con escudo", `${ARGOLLA}
        <path d="M52 48h96v48c0 40-24 64-48 72-24-8-48-32-48-72z" fill="${c1}"/><path d="M52 48h96v18H52z" fill="${c2}"/>
        <path d="M52 48h96v48c0 40-24 64-48 72-24-8-48-32-48-72z" fill="none" ${TRAZO}/>
        ${letras(100, 112, Math.round(Math.min(tam * 0.8, 38)), t1, i)}`],
      ["Trofeo", `<path d="M66 40H50a16 16 0 0 0 18 30M134 40h16a16 16 0 0 1-18 30" fill="none" stroke="${c2}" stroke-width="9" stroke-linecap="round"/>
        <path d="M62 26h76v36a38 38 0 0 1-76 0z" fill="${c1}" ${TRAZO}/>
        <path d="M100 42l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="${c2}"/>
        <rect x="92" y="100" width="16" height="22" fill="${c2}" ${TRAZO}/><rect x="66" y="122" width="68" height="14" rx="3" fill="${c1}" ${TRAZO}/>
        <rect x="46" y="136" width="108" height="46" rx="6" fill="${c2}" ${TRAZO}/>
        ${letras(100, 160, Math.round(Math.min(tam * 0.7, 28)), t2, i)}`],
      ["Medalla de torneo", `<path d="M66 8l34 84 16-8L90 8z" fill="${c1}" ${TRAZO}/><path d="M134 8l-34 84-16-8 26-76z" fill="${c2}" ${TRAZO}/>
        <circle cx="100" cy="128" r="54" fill="${c1}" ${TRAZO}/><circle cx="100" cy="128" r="42" fill="none" stroke="${c2}" stroke-width="5"/>
        ${letras(100, 122, Math.round(Math.min(tam * 0.8, 32)), t1, i)}
        <text x="100" y="152" text-anchor="middle" font-family="Figtree, sans-serif" font-weight="800" font-size="11" fill="${t1}">CAMPEÓN</text>`],
      ["Llavero pelota", `${ARGOLLA}
        <circle cx="100" cy="112" r="62" fill="${c1}" ${TRAZO}/>
        <path d="M50 76c24 20 24 52 0 72M150 76c-24 20-24 52 0 72" fill="none" stroke="${c2}" stroke-width="7" stroke-linecap="round"/>
        ${letras(100, 114, Math.round(Math.min(tam * 0.65, 28)), t1, i)}`]
    ];
  }

  function piezasWork(c1, c2, t1, t2, i, tam) {
    const ranuras = Array.from({ length: 13 }, (_, k) => `<path d="M${66 + k * 6} 70v96" stroke="${t1}" stroke-opacity=".18" stroke-width="2"/>`).join("");
    const estrias = Array.from({ length: 36 }, (_, k) => { const a = k * Math.PI / 18, r1 = 70, r2 = 78;
      return `<path d="M${(100 + r1 * Math.cos(a)).toFixed(1)} ${(100 + r1 * Math.sin(a)).toFixed(1)}L${(100 + r2 * Math.cos(a)).toFixed(1)} ${(100 + r2 * Math.sin(a)).toFixed(1)}" stroke="${t1}" stroke-opacity=".25" stroke-width="2"/>`; }).join("");
    return [
      ["Soporte para celular", `<path d="M74 150L94 58h12l-8 92z" fill="${c1}" ${TRAZO}/>
        <rect x="64" y="22" width="72" height="128" rx="12" fill="#161712" stroke="#8C8F91" stroke-width="3"/><rect x="70" y="30" width="60" height="110" rx="7" fill="#33372A"/>
        <rect x="30" y="148" width="140" height="34" rx="8" fill="${c1}" ${TRAZO}/>
        <rect x="54" y="136" width="20" height="16" rx="4" fill="${c1}" ${TRAZO}/><rect x="126" y="136" width="20" height="16" rx="4" fill="${c1}" ${TRAZO}/>
        <rect x="30" y="172" width="140" height="10" rx="4" fill="${c2}"/>
        ${letras(100, 162, Math.round(Math.min(tam * 0.5, 20)), t1, i)}`],
      ["Posavasos", `<circle cx="100" cy="100" r="80" fill="${c1}" ${TRAZO}/>${estrias}
        <circle cx="100" cy="100" r="58" fill="none" stroke="${c2}" stroke-width="6"/>
        ${letras(100, 102, Math.round(Math.min(tam * 0.9, 40)), t1, i)}`],
      ["Organizador", `<path d="M40 104l-6-74M50 104l2-80M60 104l8-70" stroke="#161712" stroke-width="6" stroke-linecap="round"/>
        <circle cx="34" cy="30" r="4" fill="${c2}"/><circle cx="52" cy="24" r="4" fill="${c2}"/><circle cx="68" cy="34" r="4" fill="${c2}"/>
        <rect x="128" y="64" width="40" height="40" rx="3" fill="#F2E7A6" transform="rotate(-6 148 84)"/>
        <rect x="22" y="70" width="60" height="110" rx="10" fill="${c1}" ${TRAZO}/>
        <rect x="76" y="100" width="104" height="80" rx="10" fill="${c1}" ${TRAZO}/>
        <rect x="76" y="162" width="104" height="10" fill="${c2}"/>
        ${letras(128, 134, Math.round(Math.min(tam * 0.6, 26)), t1, i)}`],
      ["Mini cesto", `<rect x="52" y="34" width="96" height="14" rx="6" fill="${c2}" ${TRAZO}/>
        <path d="M58 48h84l-8 126H66z" fill="${c1}" ${TRAZO}/>${ranuras}
        <circle cx="100" cy="112" r="26" fill="${c2}" ${TRAZO}/>
        ${letras(100, 113, Math.round(Math.min(tam * 0.5, 20)), t2, i)}`]
    ];
  }

  function piezas() {
    const e = est(), c1 = hexDe(e.c1), c2 = hexDe(e.c2), t1 = tinta(c1), t2 = tinta(c2);
    const i = esc(ini());
    const tam = i.length > 3 ? 30 : i.length > 2 ? 36 : 46;
    const lista = modo === "work" ? piezasWork(c1, c2, t1, t2, i, tam) : piezasSport(c1, c2, t1, t2, i, tam);
    return lista.map(([titulo, cuerpo]) => `<figure class="pieza"><svg viewBox="0 0 200 200" role="img" aria-label="${titulo} con las iniciales ${i} en ${nombreDe(e.c1).toLowerCase()} y ${nombreDe(e.c2).toLowerCase()}">${cuerpo}</svg><figcaption>${titulo}</figcaption></figure>`).join("");
  }

  function wa() {
    const e = est(), quien = modo === "work" ? `somos ${nombre()}` : `somos ${nombre()}`;
    const msj = `Hola, ${quien}. Vimos ${cfg().catalogo} de SAMBO y queremos productos con nuestro ${cfg().marca}, en ${nombreDe(e.c1).toLowerCase()} y ${nombreDe(e.c2).toLowerCase()}. ¿Nos pasan ideas y un presupuesto?`;
    return "https://wa.me/" + TELEFONO + "?text=" + encodeURIComponent(msj);
  }

  /* ---------- controles ---------- */
  const pClub = $("pClub"), pIni = $("pIni");
  const swatches = (cont, campo, sel) => {
    cont.innerHTML = COLORES.map(([id, etiqueta, hex]) => `<label class="sw" title="${etiqueta}">
      <input type="radio" name="${campo}" value="${id}"${id === sel ? " checked" : ""}>
      <span class="sw-c" style="--c:${hex}"></span><span class="solo-lector">${etiqueta}</span></label>`).join("");
  };
  function cargarControles() {
    const e = est();
    swatches($("sw1"), "c1", e.c1);
    swatches($("sw2"), "c2", e.c2);
    pClub.value = e.club;
    pClub.placeholder = cfg().placeholder;
    pIni.value = e.ini;
    pIni.placeholder = iniciales(nombre()) || cfg().iniDefecto;
  }

  function aplicar() {
    $("probadorVista").innerHTML = piezas();
    $("probadorWa").href = wa();
    $("probadorNombre").textContent = nombre();
    window.SAMBO_CLUB = { club: estados.sport.club.trim(), colores: [nombreDe(estados.sport.c1), nombreDe(estados.sport.c2)] };
    window.SAMBO_EMPRESA = { club: estados.work.club.trim(), colores: [nombreDe(estados.work.c1), nombreDe(estados.work.c2)] };
    dispatchEvent(new Event("sambo-club"));
    guardar();
  }

  pClub.addEventListener("input", () => { est().club = pClub.value; pIni.placeholder = iniciales(nombre()) || cfg().iniDefecto; aplicar(); });
  pIni.addEventListener("input", () => { est().ini = pIni.value.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 4); pIni.value = est().ini; aplicar(); });
  $("probadorForm").addEventListener("change", e => {
    if (e.target.name === "c1") est().c1 = e.target.value;
    if (e.target.name === "c2") est().c2 = e.target.value;
    aplicar();
  });
  $("probadorForm").addEventListener("submit", e => e.preventDefault());

  addEventListener("sambo-vista", e => {
    const v = e.detail === "work" ? "work" : "sport";
    if (v === modo && $("probadorVista").innerHTML) return;
    modo = v; cargarControles(); aplicar();
  });

  cargarControles();
  aplicar();
})();
