/* SAMBO · catálogo para clubes: filtros, búsqueda, tarjetas, consulta por WhatsApp. Datos en datos.js; fotos registradas en img/imagenes.js. */
(function () {
  "use strict";

  const D = window.SAMBO;
  const FOTOS = window.SAMBO_IMAGENES || {};            // código → [{ m: "a", nombre, color, hex }, …] referencias 1, 2 y 3
  const TELEFONO = "5491141754921";
  const GENERAL = "Hola, me gustaría recibir más información sobre los productos personalizados de SAMBO.";
  const CLAVE = "sambo-clubes-consulta";
  /* Trabajos entregados: pedidos reales, con datos que dio el cliente o que se ven en las fotos (nada inventado).
     Fotos en img/entregados/, preparadas con herramientas/preparar_entregados.py. Para sumar un pedido, agregar un bloque.
     grande: la primera foto va ancha arriba y las demás cuadradas abajo; sin grande, todas en una fila a su proporción. */
  const CASOS = [];   // sección de trabajos entregados quitada en esta web
  const ENTREGADOS = Object.fromEntries(CASOS.map(c => [c.producto, c]));   // producto del catálogo → su pedido entregado

  const wa = texto => "https://wa.me/" + TELEFONO + "?text=" + encodeURIComponent(texto);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const svg = (contenido, clase) => `<svg${clase ? ` class="${clase}"` : ""} aria-hidden="true" viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${contenido}</svg>`;
  const icoWa = '<svg class="ico-wa" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24"><use href="#i-wa"/></svg>';
  const foto = (codigo, m) => `img/${codigo}-${m}.jpg`;
  const numero = m => "abcdef".indexOf(m) + 1;            // los archivos usan a/b/c; en la página se ven como referencia 1, 2 y 3
  const modelos = codigo => FOTOS[codigo] || [];
  const elegido = codigo => { const ms = modelos(codigo); return ms.find(x => x.m === modeloElegido[codigo]) || ms[0]; };
  const conModelo = (p, mo) => mo ? `${p.nombre}, referencia ${numero(mo.m)} «${mo.nombre}»` : `${p.nombre}`;
  const mensaje = p => `Hola, me gustaría consultar por ${conModelo(p, elegido(p.codigo))} del catálogo de SAMBO (${rubroDe(p).nombre}).`;

  const RUBROS = D.rubros;
  const CATS = D.categorias.filter(c => D.productos.some(p => p.cat === c.id));   // solo categorías con productos
  const rubroDe = p => RUBROS.find(r => r.id === (CATS.find(c => c.id === p.cat) || {}).rubro) || RUBROS[0];
  const PRODUCTOS = D.productos.map(p => ({ ...p, catNombre: CATS.find(c => c.id === p.cat).nombre,
    clave: norm(p.nombre + " " + p.descripcion + " " + CATS.find(c => c.id === p.cat).nombre) }));

  document.querySelectorAll(".wa-general").forEach(a => (a.href = wa(GENERAL)));
  document.querySelectorAll("[data-total]").forEach(el => (el.textContent = D.productos.length || "—"));
  if (!D.productos.length) document.querySelectorAll(".btn-borde[href='#catalogo']").forEach(a => (a.textContent = "Ver el catálogo"));
  document.querySelectorAll("[data-cats]").forEach(el => (el.textContent = CATS.filter(c => c.rubro === "clubes").length));
  document.querySelectorAll("[data-kits]").forEach(el => (el.textContent = D.kits.filter(k => (k.rubro || "clubes") === "clubes").length));

  /* ---------- estado ---------- */
  let activa = "todos";
  /* vistas: inicio (portada de la marca), sport (clubes) y work (home office) */
  const VISTAS = { sport: "clubes", work: "homeoffice" };
  const vistaDeHash = h => ({ "#sport": "sport", "#clubes": "sport", "#work": "work", "#homeoffice": "work" })[h] || "inicio";
  let vista = vistaDeHash(location.hash);
  let rubro = VISTAS[vista] || RUBROS[0].id;
  const catsRubro = () => CATS.filter(c => c.rubro === rubro);
  const prodsRubro = () => PRODUCTOS.filter(p => catsRubro().some(c => c.id === p.cat));
  let elegidos = [];
  const modeloElegido = {};
  try {
    const s = JSON.parse(localStorage.getItem(CLAVE) || "[]");
    if (Array.isArray(s)) elegidos = s.filter(id => PRODUCTOS.some(p => p.codigo === id));
  } catch (e) { /* sin almacenamiento: la consulta vive solo en esta visita */ }
  const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(elegidos)); } catch (e) { /* idem */ } };

  /* ---------- hero: mosaico de productos ---------- */
  const DESTACADOS = ["05.1", "02.1", "03.4", "01.1", "06.1", "03.1"];
  const mosaico = document.getElementById("mosaico");
  if (mosaico) mosaico.innerHTML = DESTACADOS.map(cod => {
    const p = PRODUCTOS.find(x => x.codigo === cod);
    const f = modelos(cod).length ? `<img src="${foto(cod, modelos(cod)[0].m)}" alt="" width="640" height="480">` : "";
    return `<div class="tesela">${f || svg(p.svg)}</div>`;
  }).join("");

  /* ---------- chips ---------- */
  const chips = document.getElementById("chips");
  const q = document.getElementById("q");
  function pintarChips() {
    const ps = prodsRubro();
    chips.hidden = !ps.length;
    const datosChips = [{ id: "todos", nombre: "Todos", n: ps.length }]
      .concat(catsRubro().map(c => ({ id: c.id, nombre: c.nombre, n: ps.filter(p => p.cat === c.id).length })));
    chips.innerHTML = datosChips.map(c =>
      `<button class="chip" type="button" data-cat="${c.id}" aria-pressed="${c.id === activa}">${esc(c.nombre)}<span class="n">${c.n}</span></button>`).join("");
  }
  /* rubros: clubes / home office */
  const rubrosEl = document.getElementById("rubros");
  function pintarRubros() {
    q.placeholder = rubro === "homeoffice" ? "Buscar: soporte, mate, cables…" : "Buscar: trofeos, llaveros, marcador…";
    rubrosEl.innerHTML = RUBROS.map(r => { const n = PRODUCTOS.filter(p => rubroDe(p).id === r.id).length;
      return `<button class="rubro" type="button" data-rubro="${r.id}" aria-pressed="${r.id === rubro}">${esc(r.nombre)}<span class="n">${n}</span></button>`; }).join("");
  }
  rubrosEl.addEventListener("click", e => {
    const b = e.target.closest(".rubro"); if (!b || b.dataset.rubro === rubro) return;
    rubro = b.dataset.rubro; activa = "todos"; q.value = "";
    try { history.replaceState(null, "", "#" + rubro); } catch (err) { /* sin historial */ }
    pintarRubros(); pintarChips(); pintar();
  });
  pintarRubros(); pintarChips();
  chips.addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    activa = b.dataset.cat;
    chips.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    pintar();
    document.getElementById("catalogo").scrollIntoView({ block: "start" });
  });

  q.addEventListener("input", pintar);

  /* ---------- tarjetas ---------- */
  function tarjeta(p) {
    const sumado = elegidos.includes(p.codigo);
    const ms = modelos(p.codigo);
    const mo = elegido(p.codigo);
    const img = mo ? `<img class="foto" src="${foto(p.codigo, mo.m)}" alt="${esc(p.nombre)}, referencia ${numero(mo.m)}: ${esc(mo.nombre)}" loading="lazy" width="640" height="480">` : "";
    const selector = ms.length > 1 ? `<div class="modelos">
        <div class="selector" role="group" aria-label="Referencias de ${esc(p.nombre)}">${ms.map(x =>
          `<button class="modelo" type="button" data-id="${p.codigo}" data-m="${x.m}" aria-pressed="${x === mo}" aria-label="Referencia ${numero(x.m)}: ${esc(x.nombre)}">${numero(x.m)}</button>`).join("")}</div>
        <button class="ver-todas" type="button" data-galeria="${p.codigo}" aria-label="Ver las ${ms.length} referencias de ${esc(p.nombre)}" title="Ver todas"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></button>
      </div>` : "";
    return `<article class="tarjeta" data-producto="${p.codigo}">
      ${img ? `<button class="caratula con-foto" type="button" data-galeria="${p.codigo}" aria-label="Ver las referencias de ${esc(p.nombre)}">${img}${mo.autor ? `<span class="credito">${esc(mo.autor)} · ${esc(mo.licencia || "")}</span>` : ""}</button>`
             : `<div class="caratula">${svg(p.svg)}</div>`}${selector}
      <div class="cuerpo">
        <span class="codigo">${esc(p.catNombre)}</span>
        <h4>${esc(p.nombre)}</h4>
        <p>${esc(p.descripcion)}</p>
        ${ENTREGADOS[p.codigo] ? `<a class="entregado" href="#caso-${ENTREGADOS[p.codigo].id}" data-caso="${ENTREGADOS[p.codigo].id}">Ver el pedido que entregamos a ${esc(ENTREGADOS[p.codigo].cliente)}</a>` : ""}
        <ul class="tags" aria-label="Personalizable">${p.personalizable.map(t => `<li class="tag">${esc(t)}</li>`).join("")}</ul>
        <div class="acciones">
          <button class="sumar" type="button" data-id="${p.codigo}" aria-pressed="${sumado}">${sumado ? "En tu consulta ✓" : "Sumar a mi consulta"}</button>
          <a class="wa" href="${wa(mensaje(p))}" target="_blank" rel="noopener" aria-label="Consultar ${esc(p.nombre)} por WhatsApp">${icoWa}</a>
        </div>
      </div>
    </article>`;
  }

  const resultados = document.getElementById("resultados");
  const intro = document.getElementById("catIntro");

  function pintar() {
    const termino = norm(q.value.trim());
    const ps = prodsRubro();
    const lista = ps.filter(p => (activa === "todos" || p.cat === activa) && (!termino || p.clave.includes(termino)));
    if (!ps.length) {
      resultados.innerHTML = `<p class="vacio">${esc(RUBROS.find(r => r.id === rubro).vacio)}</p>`;
    } else if (!lista.length) {
      resultados.innerHTML = `<p class="vacio">No encontramos ese producto. Escribinos igual: si no está en el catálogo, lo diseñamos.</p>`;
    } else if (activa === "todos" && !termino) {
      resultados.innerHTML = catsRubro().map(c => `<section class="grupo" aria-labelledby="g-${c.id}">
          <div class="franja sin-numero"><h3 id="g-${c.id}">${esc(c.nombre)}</h3><p>${esc(c.intro)}</p></div>
          <div class="grilla">${lista.filter(p => p.cat === c.id).map(tarjeta).join("")}</div>
        </section>`).join("");
    } else {
      resultados.innerHTML = `<div class="grilla">${lista.map(tarjeta).join("")}</div>`;
    }
    document.getElementById("contador").textContent = `${lista.length} ${lista.length === 1 ? "producto" : "productos"}`;
    const c = CATS.find(x => x.id === activa);
    intro.hidden = !c;
    intro.innerHTML = c ? `<h3>${esc(c.nombre)}</h3><p>${esc(c.intro)}</p>` : "";
  }

  const destacados = document.getElementById("destacados");
  const masPedidos = () => ((D.masPedidos || {})[rubro] || []).map(c => PRODUCTOS.find(p => p.codigo === c)).filter(Boolean);
  const pintarDestacados = () => {
    const MAS_PEDIDOS = masPedidos();
    if (!destacados) return;
    destacados.closest(".mas-pedidos").hidden = !MAS_PEDIDOS.length;
    destacados.innerHTML = MAS_PEDIDOS.map(tarjeta).join("");
  };

  function alClic(e) {
    const cont = e.currentTarget;
    const abre = e.target.closest("[data-galeria]");
    if (abre) { abrirGaleria(abre.dataset.galeria, abre); return; }
    const b0 = e.target.closest(".modelo");
    if (b0) { elegirModelo(b0.dataset.id, b0.dataset.m); const f = cont.querySelector(`.modelo[data-id="${b0.dataset.id}"][data-m="${b0.dataset.m}"]`); if (f) f.focus(); return; }
    const b = e.target.closest(".sumar"); if (!b) return;
    alternar(b.dataset.id);
  }
  resultados.addEventListener("click", alClic);
  if (destacados) destacados.addEventListener("click", alClic);

  /* elegir la referencia 1, 2 o 3 de un producto: se redibuja su tarjeta y se actualizan galería y consulta */
  function elegirModelo(id, m) {
    modeloElegido[id] = m;
    const p = PRODUCTOS.find(x => x.codigo === id);
    document.querySelectorAll(`.tarjeta[data-producto="${id}"]`).forEach(art => (art.outerHTML = tarjeta(p)));
    if (galeria.open && galSumar.dataset.id === id) marcarGaleria(p);
    pintarConsulta();
  }

  /* sumar o quitar un producto, y reflejarlo en su tarjeta y en la galería */
  function alternar(id) {
    elegidos = elegidos.includes(id) ? elegidos.filter(x => x !== id) : elegidos.concat(id);
    guardar();
    const on = elegidos.includes(id);
    document.querySelectorAll(`.sumar[data-id="${id}"]`).forEach(b => {
      b.setAttribute("aria-pressed", String(on));
      b.textContent = on ? "En tu consulta ✓" : "Sumar a mi consulta";
    });
    pintarConsulta();
  }

  /* ---------- galería: las tres referencias de un producto, juntas; tocar una la elige ---------- */
  const galeria = document.getElementById("galeria");
  const galSumar = document.getElementById("galeriaSumar");
  const galFotos = document.getElementById("galeriaFotos");
  let volverA = null;

  function abrirGaleria(id, origen) {
    const p = PRODUCTOS.find(x => x.codigo === id);
    const ms = modelos(id);
    if (!p || !ms.length) return;
    document.getElementById("galeriaCod").textContent = p.catNombre;
    document.getElementById("galeriaTit").textContent = p.nombre;
    document.getElementById("galeriaDesc").textContent = p.descripcion + " Las fotos son referencias, no piezas terminadas: elegí la que más se acerque a lo que buscan y la diseñamos para el club, con su escudo, sus colores y las medidas que necesiten.";
    galFotos.innerHTML = ms.map(x => `<figure>
        <button class="elegir" type="button" data-m="${x.m}" aria-pressed="false" aria-label="Elegir la referencia ${numero(x.m)}: ${esc(x.nombre)}">
          <img src="${foto(id, x.m)}" alt="${esc(p.nombre)}, referencia ${numero(x.m)}: ${esc(x.nombre)}" width="640" height="480"></button>
        <figcaption><span><b>Referencia ${numero(x.m)}</b> · ${esc(x.nombre)}</span>${x.autor ? `<a class="en-foto" href="${esc(x.fuente)}" target="_blank" rel="noopener">Foto: ${esc(x.autor)} · ${esc(x.licencia || "")}</a>` : x.color ? `<span class="en-foto"><span class="muestra" style="--c:${x.hex}"></span>En la foto: ${esc(x.color.toLowerCase())}</span>` : ""}</figcaption>
      </figure>`).join("");
    galSumar.dataset.id = id;
    marcarGaleria(p);
    volverA = origen;
    galeria.showModal();
    document.getElementById("galeriaCerrar").focus();
  }
  function marcarGaleria(p) {
    const mo = elegido(p.codigo);
    galFotos.querySelectorAll(".elegir").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.m === mo.m)));
    const on = elegidos.includes(p.codigo);
    galSumar.setAttribute("aria-pressed", String(on));
    galSumar.textContent = on ? "En tu consulta ✓" : "Sumar a mi consulta";
    document.getElementById("galeriaWa").href = wa(mensaje(p));
  }
  galFotos.addEventListener("click", e => {
    const b = e.target.closest(".elegir"); if (!b) return;
    elegirModelo(galSumar.dataset.id, b.dataset.m);
  });
  const cerrarGaleria = () => galeria.close();
  document.getElementById("galeriaCerrar").addEventListener("click", cerrarGaleria);
  galeria.addEventListener("click", e => { if (e.target === galeria) cerrarGaleria(); });   // clic fuera del panel
  galeria.addEventListener("close", () => {
    // la tarjeta pudo redibujarse mientras la galería estaba abierta: volver a su carátula actual
    const id = galSumar.dataset.id;
    const destino = volverA && volverA.isConnected ? volverA : resultados.querySelector(`.tarjeta[data-producto="${id}"] .caratula`);
    if (destino) destino.focus();
  });
  galSumar.addEventListener("click", () => alternar(galSumar.dataset.id));

  /* ---------- consulta ---------- */
  const consulta = document.getElementById("consulta");
  const listaC = document.getElementById("consultaLista");
  const ver = document.getElementById("consultaVer");

  function pintarConsulta() {
    consulta.hidden = elegidos.length === 0;
    document.body.classList.toggle("con-consulta", elegidos.length > 0);
    document.getElementById("consultaCuenta").textContent = `${elegidos.length} ${elegidos.length === 1 ? "producto" : "productos"} en tu consulta`;
    const items = elegidos.map(id => PRODUCTOS.find(p => p.codigo === id));
    listaC.innerHTML = items.map(p => { const mo = elegido(p.codigo);
      return `<li><span>${esc(p.nombre)}${mo ? ` <small>· referencia ${numero(mo.m)}</small>` : ""}</span><button type="button" data-quitar="${p.codigo}" aria-label="Quitar ${esc(p.nombre)}">Quitar</button></li>`; }).join("");
    const deClubes = items.some(p => rubroDe(p).id === "clubes"), deWork = items.some(p => rubroDe(p).id !== "clubes");
    const nombreClub = window.SAMBO_CLUB && window.SAMBO_CLUB.club;
    const cierre = deClubes && !deWork ? (nombreClub ? `Somos ${nombreClub} y necesitamos aproximadamente ___ unidades.` : "Somos el club ___ y necesitamos aproximadamente ___ unidades.")
      : deWork && !deClubes ? `Somos ${window.SAMBO_EMPRESA && window.SAMBO_EMPRESA.club ? window.SAMBO_EMPRESA.club : "la empresa ___"}, un equipo de ___ personas, y necesitamos aproximadamente ___ unidades.`
      : "Somos ___ y necesitamos aproximadamente ___ unidades.";
    const msj = "Hola, me gustaría recibir información sobre estos productos del catálogo de SAMBO:\n" +
      items.map(p => `- ${conModelo(p, elegido(p.codigo))}`).join("\n") + "\n\n" + cierre;
    document.getElementById("consultaEnviar").href = wa(msj);
    if (!elegidos.length) { listaC.hidden = true; ver.setAttribute("aria-expanded", "false"); ver.textContent = "Ver lista"; }
  }
  ver.addEventListener("click", () => {
    const abrir = listaC.hidden;
    listaC.hidden = !abrir;
    ver.setAttribute("aria-expanded", String(abrir));
    ver.textContent = abrir ? "Ocultar" : "Ver lista";
  });
  listaC.addEventListener("click", e => {
    const b = e.target.closest("[data-quitar]"); if (!b) return;
    elegidos = elegidos.filter(x => x !== b.dataset.quitar);
    guardar(); pintarConsulta(); pintar(); pintarDestacados();
  });



  /* ---------- kits ---------- */
  const pintarKits = () => (document.getElementById("kitsGrilla").innerHTML = D.kits.filter(k => (k.rubro || "clubes") === rubro).map(k => `<article class="kit aparece">
      <div class="kit-piezas" aria-hidden="true">${(k.codigos || []).map(c => { const p = PRODUCTOS.find(x => x.codigo === c); return p && modelos(c).length ? `<span><img src="${foto(c, modelos(c)[0].m)}" alt="" loading="lazy"></span>` : ""; }).join("")}</div>
      <span class="para">${esc(k.para)}</span>
      <h3>${esc(k.nombre)}</h3>
      <p>${esc(k.texto)}</p>
      <ul>${k.incluye.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
      <a class="btn btn-wa" href="${wa(`Hola, me interesa el ${k.nombre} del catálogo de SAMBO. ¿Me pasan más información?`)}" target="_blank" rel="noopener">${icoWa} Consultar este kit</a>
    </article>`).join(""));
  pintarKits();

  /* ---------- copiar número ---------- */
  const copiar = document.getElementById("copiar");
  const seleccionar = () => {
    const r = document.createRange(); r.selectNodeContents(document.getElementById("telefono"));
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  };
  copiar.addEventListener("click", () => {
    const t = document.getElementById("telefono").textContent;
    const listo = () => { copiar.textContent = "Copiado"; setTimeout(() => (copiar.textContent = "Copiar"), 1800); };
    try { navigator.clipboard.writeText(t).then(listo, seleccionar); } catch (e) { seleccionar(); }
  });

  addEventListener("sambo-club", pintarConsulta);
  pintarDestacados();
  pintar();
  pintarConsulta();

  /* ---------- vistas ---------- */
  document.querySelectorAll("[data-cuenta]").forEach(el => (el.textContent = PRODUCTOS.filter(p => rubroDe(p).id === el.dataset.cuenta).length));
  function irA(v, conScroll) {
    vista = v;
    document.body.dataset.vista = v;
    dispatchEvent(new CustomEvent("sambo-vista", { detail: v }));
    document.querySelectorAll("[data-solo]").forEach(el => (el.hidden = !el.dataset.solo.split(" ").includes(v)));
    document.querySelectorAll("[data-vista-link]").forEach(a => a.toggleAttribute("aria-current", a.dataset.vistaLink === v && v !== "inicio"));
    if (VISTAS[v] && VISTAS[v] !== rubro) {
      rubro = VISTAS[v]; activa = "todos"; q.value = "";
      pintarRubros(); pintarChips(); pintar(); pintarKits(); pintarDestacados();
    }
    if (VISTAS[v]) document.querySelectorAll("[data-total]").forEach(el => (el.textContent = prodsRubro().length));
    document.title = v === "sport" ? "SAMBO Sport" : v === "work" ? "SAMBO Work" : "SAMBO Sport y Work";
    if (conScroll) scrollTo({ top: 0, behavior: "instant" });
  }
  irA(vista, false);
  addEventListener("hashchange", () => { const v = vistaDeHash(location.hash); if (location.hash === "" || location.hash === "#inicio" || v !== "inicio") irA(v, true); });
  /* los enlaces internos (#catalogo, #contacto…) desplazan sin cambiar la dirección, así no se pierde la vista */
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]'); if (!a || a.hasAttribute("data-vista-link")) return;
    const destino = document.getElementById(a.getAttribute("href").slice(1));
    if (!destino) return;
    e.preventDefault();
    destino.scrollIntoView({ block: "start" });
  });
})();
