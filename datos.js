/* SAMBO · catálogo para clubes de tenis y pádel. Ilustraciones de línea en un lienzo de 120 × 100. */
(function () {
  const f = n => +n.toFixed(1);
  const PELOTA = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}"/><path d="M${f(x - r * .8)} ${f(y - r * .6)}c${f(r * .5)} ${f(r * .4)} ${f(r * .5)} ${f(r * .8)} 0 ${f(r * 1.2)}M${f(x + r * .8)} ${f(y - r * .6)}c${f(-r * .5)} ${f(r * .4)} ${f(-r * .5)} ${f(r * .8)} 0 ${f(r * 1.2)}"/>`;
  const RAQUETA = (x, y, s) => `<ellipse cx="${x}" cy="${y}" rx="${f(16 * s)}" ry="${f(20 * s)}"/><path d="M${f(x - 9 * s)} ${f(y + 16.5 * s)}L${x} ${f(y + 28 * s)}L${f(x + 9 * s)} ${f(y + 16.5 * s)}M${x} ${f(y + 28 * s)}V${f(y + 46 * s)}"/><path d="M${f(x - 8 * s)} ${f(y - 17 * s)}v${f(34 * s)}M${x} ${f(y - 20 * s)}v${f(40 * s)}M${f(x + 8 * s)} ${f(y - 17 * s)}v${f(34 * s)}M${f(x - 14 * s)} ${f(y - 8 * s)}h${f(28 * s)}M${f(x - 16 * s)} ${y}h${f(32 * s)}M${f(x - 14 * s)} ${f(y + 8 * s)}h${f(28 * s)}"/>`;
  const PALETA = (x, y, s) => `<path d="M${f(x - 14 * s)} ${y}a${f(14 * s)} ${f(16 * s)} 0 0 1 ${f(28 * s)} 0v${f(6 * s)}c0 ${f(8 * s)} ${f(-6 * s)} ${f(12 * s)} ${f(-10 * s)} ${f(14 * s)}v${f(12 * s)}h${f(-8 * s)}v${f(-12 * s)}c${f(-4 * s)} ${f(-2 * s)} ${f(-10 * s)} ${f(-6 * s)} ${f(-10 * s)} ${f(-14 * s)}z"/><circle cx="${f(x - 5 * s)}" cy="${f(y - 4 * s)}" r="${f(1.6 * s)}"/><circle cx="${f(x + 5 * s)}" cy="${f(y - 4 * s)}" r="${f(1.6 * s)}"/><circle cx="${x}" cy="${f(y + 3 * s)}" r="${f(1.6 * s)}"/>`;
  const ESCUDO = (x, y, s) => `<path d="M${f(x - 12 * s)} ${f(y - 14 * s)}h${f(24 * s)}v${f(12 * s)}c0 ${f(10 * s)} ${f(-6 * s)} ${f(16 * s)} ${f(-12 * s)} ${f(18 * s)}c${f(-6 * s)} ${f(-2 * s)} ${f(-12 * s)} ${f(-8 * s)} ${f(-12 * s)} ${f(-18 * s)}z"/>`;
  const ESTRELLA = (x, y) => `<path d="M${x} ${y - 12}l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z"/>`;
  const REJA = '<path d="M10 12l12 12 12-12 12 12 12-12 12 12 12-12 12 12 12-12"/>';
  const ETIQUETA = '<path d="M30 30h46l14 14v40H30z"/><circle cx="80" cy="44" r="4"/><path d="M84 40c8-8 16-8 22 0"/>';

  window.SAMBO = {
    rubros: [
      { id: "clubes", nombre: "Clubes de tenis y pádel", corto: "Clubes", libre: ["Color a elección", "Con el escudo del club", "Lo adaptamos al club"],
        vacio: "Estamos sumando los productos para clubes. Mientras tanto, contanos qué necesita el club por WhatsApp y lo diseñamos a medida." },
      { id: "homeoffice", nombre: "Home office", corto: "Home office", libre: ["Color a elección", "Con tu logo", "Lo adaptamos a tu marca"],
        vacio: "Estamos sumando los productos de home office. Mientras tanto, contanos qué necesita tu equipo por WhatsApp y lo diseñamos a medida." }
    ],
    categorias: [
      { rubro: "clubes", n: "01", id: "jugadores", nombre: "Jugadores", intro: "Accesorios para el bolso y la cancha que los socios usan en cada partido." },
      { rubro: "clubes", n: "02", id: "padel", nombre: "Pádel", intro: "Para las canchas de pádel del club y para quienes las juegan." },
      { rubro: "clubes", n: "03", id: "cancha", nombre: "Cancha y alambrado", intro: "Piezas para equipar cada cancha: orden, señalización y comodidad del lado del jugador. Se hacen para estar afuera, al sol y a la lluvia." },
      { rubro: "clubes", n: "04", id: "profes", nombre: "Profes y escuelita", intro: "Herramientas para dar clase y para premiar el progreso de los chicos." },
      { rubro: "clubes", n: "05", id: "torneos", nombre: "Torneos y premios", intro: "Trofeos, medallas y todo lo que hace falta para que cada torneo se recuerde." },
      { rubro: "clubes", n: "06", id: "souvenirs", nombre: "Souvenirs y merch", intro: "El escudo del club en objetos que los socios se llevan a casa." },
      { rubro: "clubes", n: "07", id: "social", nombre: "Bar y espacios comunes", intro: "Para el bar, el salón y el jardín: el club con identidad propia en cada rincón." },
      { rubro: "clubes", n: "08", id: "vestuarios", nombre: "Vestuarios y administración", intro: "Orden y señalización para vestuarios, recepción y oficina." },
      { rubro: "clubes", n: "09", id: "eventos", nombre: "Eventos y fechas especiales", intro: "Cumpleaños, fiestas y aniversarios: piezas a medida para cada fecha del club." },
      { rubro: "clubes", n: "10", id: "deco", nombre: "Decoración", intro: "Piezas para decorar el bar, el salón, el jardín y los espacios comunes del club, o la casa de cada socio, con el tenis como tema." },
      { rubro: "homeoffice", n: "01", id: "ho-escritorio", nombre: "Escritorio", intro: "Lo esencial para armar un puesto de trabajo cómodo y ordenado en casa." },
      { rubro: "homeoffice", n: "02", id: "ho-ergonomia", nombre: "Notebook y ergonomía", intro: "Para levantar la notebook a una altura cómoda cuando se trabaja y guardarla parada cuando no se usa." },
      { rubro: "homeoffice", n: "03", id: "ho-guardado", nombre: "Guardado y orden", intro: "Un lugar para cada cosa, incluso en escritorios y casas donde no sobra espacio." },
      { rubro: "homeoffice", n: "04", id: "ho-tecnologia", nombre: "Tecnología y carga", intro: "Soportes y estaciones para que cada dispositivo tenga su lugar y esté siempre cargado." },
      { rubro: "homeoffice", n: "05", id: "ho-cables", nombre: "Cables y bajo escritorio", intro: "Lo que no se ve también se ordena: cables, zapatillas y equipos fuera de la vista y de la cámara." },
      { rubro: "homeoffice", n: "06", id: "ho-videollamadas", nombre: "Videollamadas", intro: "Para verse y escucharse mejor, con la marca presente en cada pantalla." },
      { rubro: "homeoffice", n: "07", id: "ho-mate", nombre: "Pausas y bienestar", intro: "Piezas para el café, el mate y un poco de verde en el escritorio: lo que hace más llevadera la jornada." },
      { rubro: "homeoffice", n: "08", id: "ho-bienestar", nombre: "Bienestar y foco", intro: "Objetos que ayudan a concentrarse, cortar a tiempo y separar el trabajo de la casa." },
      { rubro: "homeoffice", n: "09", id: "ho-equipo", nombre: "Equipo y marca", intro: "Piezas para dar la bienvenida, reconocer logros y llevar la cultura de la empresa a cada casa." },
      { rubro: "homeoffice", n: "10", id: "ho-viaje", nombre: "Viaje y coworking", intro: "Para quienes trabajan desde un café, un coworking o en viaje: todo entra en la mochila." }
    ],
    /* Productos: se cargan a partir de las imágenes de referencia que pasa Mati. */
    productos: [
      { codigo: "03.1", cat: "cancha", nombre: "Soporte de celular para la red", descripcion: "Se engancha a la faja de la red o al poste para filmar partidos y clases desde la cancha. Los profes lo usan para corregir técnica.", personalizable: ["escudo", "color"], svg: "" },
      { codigo: "03.2", cat: "cancha", nombre: "Marcador de sets para poste", descripcion: "Marcador que se amura al poste de la red, en canchas de tenis o de pádel, para llevar los sets del partido a la vista de los dos jugadores.", personalizable: ["escudo", "colores", "cantidad de sets"], svg: "" },
      { codigo: "03.3", cat: "cancha", nombre: "Marcador para paleta o raqueta", descripcion: "Marcador que se pega en el canto de la paleta o de la raqueta para llevar puntos y games sin perder la cuenta en el partido.", personalizable: ["escudo", "colores"], svg: "" },
      { codigo: "03.4", cat: "cancha", nombre: "Gancho para mochilas y bolsos", descripcion: "Gancho que se cuelga del alambrado, la reja de pádel o el borde de un banco para dejar mochilas, bolsos y toallas fuera del piso.", personalizable: ["escudo", "medida del caño", "color"], svg: "" },
      { codigo: "05.1", cat: "torneos", nombre: "Trofeos", descripcion: "Trofeos de diseño propio para campeones, finalistas y premios especiales: con pelota, con paleta o con la figura de un jugador.", personalizable: ["nombre del torneo", "nombre del ganador", "año", "escudo", "color"], svg: "" },
      { codigo: "05.2", cat: "torneos", nombre: "Medallas", descripcion: "Medallas con cinta para el podio: primero, segundo y tercer puesto, con el número o el escudo en relieve.", personalizable: ["puesto", "escudo", "color de la cinta", "año"], svg: "" },
      { codigo: "06.1", cat: "souvenirs", nombre: "Llaveros", descripcion: "Llaveros con temática de tenis y pádel: pelota, mini raqueta, raqueta con cancha o una placa con la cancha y el tanteo. Lisos o con nombre, iniciales o escudo.", personalizable: ["modelo", "nombre", "escudo", "colores"], svg: "" },
      { codigo: "06.2", cat: "souvenirs", nombre: "Soporte de pared para raqueta", descripcion: "Soporte que sostiene la raqueta para exhibirla en la pared de casa, del vestuario o del club.", personalizable: ["escudo", "nombre", "color"], svg: "" },
      { codigo: "06.3", cat: "souvenirs", nombre: "Bowl pelota de tenis", descripcion: "Bowl con forma y textura de pelota de tenis para llaves, monedas o lo que haga falta, en casa o en la recepción del club.", personalizable: ["escudo", "nombre", "color"], svg: "" },
      { codigo: "06.4", cat: "souvenirs", nombre: "Destapador raqueta", descripcion: "Destapador con forma de raqueta y chapa metálica en el encordado, para el bar del club o como regalo.", personalizable: ["escudo", "nombre", "color"], svg: "" },
      { codigo: "06.5", cat: "souvenirs", nombre: "Portalápices de pelotas", descripcion: "Portalápices con forma de pelota de tenis, simple o con pelotas apiladas, para el escritorio de casa, la secretaría o los profes.", personalizable: ["escudo", "nombre", "color"], svg: "" },
      { codigo: "06.6", cat: "souvenirs", nombre: "Estante de paletas para trofeos", descripcion: "Repisa de pared sostenida por dos paletas para exhibir trofeos, medallas y pelotas en casa, en el salón o en la secretaría del club.", personalizable: ["escudo", "largo", "color"], svg: "" },
      { codigo: "06.7", cat: "souvenirs", nombre: "Posavasos", descripcion: "Set de posavasos con forma de pelota o con una raqueta dibujada, para el bar del club o para regalar.", personalizable: ["escudo", "diseño", "colores"], svg: "" },
      { codigo: "07.1", cat: "deco", nombre: "Maceta pelota de tenis", descripcion: "Maceta con forma y textura de pelota de tenis para suculentas y plantas chicas, en la recepción, el bar o el jardín del club.", personalizable: ["escudo", "tamaño", "color"], svg: "" },
      { codigo: "10.1", cat: "deco", nombre: "Cancha de tenis decorativa", descripcion: "Cancha de tenis en relieve con red y líneas, para apoyar en un estante o colgar en la pared con montaje opcional. Puede ser de polvo de ladrillo, césped o cemento.", personalizable: ["superficie y color", "escudo", "medidas", "montaje en pared opcional"], svg: "" },
      { codigo: "H01.1", cat: "ho-escritorio", nombre: "Soporte para celular", descripcion: "Soporte de escritorio con el ángulo justo para videollamadas, mensajes o seguir una reunión sin sostener el teléfono.", personalizable: ["logo", "nombre", "color"], svg: "" },
      { codigo: "H01.2", cat: "ho-escritorio", nombre: "Organizador con soporte para celular", descripcion: "Organizador de escritorio con portalápices, soporte para el celular y bandejas para anteojos, auriculares y clips.", personalizable: ["logo", "módulos", "color"], svg: "" },
      { codigo: "H01.3", cat: "ho-escritorio", nombre: "Mini cesto de escritorio", descripcion: "Cesto chico para papelitos, envoltorios y restos de lápiz: de apoyo, abierto o con tapa vaivén, o para colgar del borde del escritorio sin ocupar lugar.", personalizable: ["logo", "tapa", "color"], svg: "" },
      { codigo: "H01.4", cat: "ho-escritorio", nombre: "Organizador de escritorio", descripcion: "Organizador para lapiceras, tijera, notas, abrochadora y clips: con bandejas que se abren en abanico, con compartimentos fijos o con una base giratoria.", personalizable: ["logo", "compartimentos", "color"], svg: "" },
      { codigo: "H02.1", cat: "ho-ergonomia", nombre: "Elevador para notebook", descripcion: "Levanta la notebook para que la pantalla quede más cerca de la altura de los ojos y el teclado tenga mejor ángulo. Hay versiones de una pieza, mínimas o que se desarman y quedan planas para llevar.", personalizable: ["logo", "altura y ángulo", "color"], svg: "" },
      { codigo: "H03.1", cat: "ho-ergonomia", nombre: "Soporte vertical para notebook", descripcion: "Guarda la notebook parada y cerrada para liberar el escritorio, ideal si se usa con monitor externo.", personalizable: ["logo", "medida de la notebook", "textura", "color"], svg: "" },
      { codigo: "H04.1", cat: "ho-tecnologia", nombre: "Soporte de celular para monitor", descripcion: "Se engancha debajo de la pantalla para tener el celular a la vista, parado o acostado, con lugar para pasar el cable de carga.", personalizable: ["logo", "medida del monitor", "color"], svg: "" },
      { codigo: "H04.2", cat: "ho-tecnologia", nombre: "Estación de carga y organizador", descripcion: "Base para dejar el celular cargando junto con el reloj, los auriculares, las llaves y la billetera en un solo lugar.", personalizable: ["logo", "compartimentos", "color"], svg: "" },
      { codigo: "H05.1", cat: "ho-cables", nombre: "Organizador de cables y cargadores", descripcion: "Caja con celdas para guardar cables enrollados, cargadores y adaptadores, cada uno en su lugar.", personalizable: ["logo", "cantidad de celdas", "color"], svg: "" },
      { codigo: "H05.2", cat: "ho-cables", nombre: "Enrollador de cables", descripcion: "Clip que mantiene el cable enrollado y sin nudos, para el escritorio, la mochila o el kit de bienvenida.", personalizable: ["logo", "color"], svg: "" },
      { codigo: "H05.3", cat: "ho-cables", nombre: "Clips para cables", descripcion: "Se pegan en el borde del escritorio y sostienen los cables de carga, auriculares y USB para que no se caigan al piso.", personalizable: ["logo", "cantidad de ranuras", "color"], svg: "" },
      { codigo: "H05.4", cat: "ho-cables", nombre: "Organizador de cargador y cable", descripcion: "Funda que sostiene el cargador y deja el cable enrollado alrededor, para que no se enrede en el cajón, la mochila o la valija.", personalizable: ["logo", "modelo de cargador", "color"], svg: "" },
      { codigo: "H07.1", cat: "ho-mate", nombre: "Posavasos con base", descripcion: "Set de posavasos estriados que se guardan en su propia base, para la taza de café o el mate en el escritorio.", personalizable: ["logo", "cantidad", "color"], svg: "" },
      { codigo: "H08.1", cat: "ho-mate", nombre: "Mini plantas para escritorio", descripcion: "Mini suculentas decorativas en maceta, que no necesitan riego ni luz, para darle un toque verde al escritorio de cada integrante.", personalizable: ["logo en la maceta", "forma y textura de la maceta", "color"], svg: "" },
      { codigo: "H10.1", cat: "ho-viaje", nombre: "Soporte plegable de bolsillo", descripcion: "Soporte de celular que se pliega y entra en el bolsillo, con o sin llavero. Ideal para el coworking, el café o el viaje.", personalizable: ["logo", "nombre", "color", "llavero opcional"], svg: "" },
      { codigo: "H10.2", cat: "ho-viaje", nombre: "Gancho para mochila", descripcion: "Se engancha en el borde de cualquier mesa para colgar la mochila, la cartera o la bolsa de la notebook, en casa, en la oficina o en el coworking.", personalizable: ["logo", "medida de la mesa", "color"], svg: "" }
    ],
    masPedidos: { clubes: ["05.1", "05.2", "06.1", "03.1"], homeoffice: ["H01.1", "H01.4", "H07.1", "H05.2"] },
    kits: [
      { rubro: "clubes", nombre: "Kit Bienvenida", codigos: ["06.1", "06.7", "06.3", "06.5"], para: "Socios nuevos", incluye: ["Llavero", "Posavasos", "Bowl pelota de tenis", "Portalápices de pelotas"],
        texto: "Para recibir a cada socio nuevo con piezas que use en casa y en el club." },
      { rubro: "clubes", nombre: "Kit Torneo", codigos: ["05.1", "05.2", "06.1", "06.6"], para: "Torneos del club", incluye: ["Trofeos para campeón y finalista", "Medallas para el podio", "Llaveros para participantes", "Estante para exhibir los premios"],
        texto: "Todo lo que necesita un torneo, con el nombre y el año de esa edición." },
      { rubro: "clubes", nombre: "Kit Escuelita", codigos: ["05.2", "06.1", "06.5", "06.3"], para: "Fin de temporada", incluye: ["Medallas para cada alumno", "Llaveros con nombre", "Portalápices de pelotas", "Bowl pelota de tenis"],
        texto: "Para cerrar el año de la escuelita y que cada chico se lleve su premio." },
      { rubro: "clubes", nombre: "Kit Cancha", codigos: ["03.1", "03.2", "03.3", "03.4"], para: "Equipar cada cancha", incluye: ["Soporte de celular para filmar", "Marcador de sets para poste", "Marcador para paleta o raqueta", "Ganchos para mochilas y bolsos"],
        texto: "Cada cancha con su marcador, su soporte para filmar y todo en su lugar." },
      { rubro: "homeoffice", nombre: "Kit Onboarding", codigos: ["H01.1", "H05.2", "H08.1", "H01.3"], para: "Ingresos al equipo", incluye: ["Soporte para celular", "Enrolladores de cables", "Mini planta para escritorio", "Mini cesto de escritorio"],
        texto: "Para que cada persona nueva arme su escritorio en casa con la marca presente desde el primer día." },
      { rubro: "homeoffice", nombre: "Kit Fin de Año", codigos: ["H07.1", "H01.4", "H08.1", "H01.2"], para: "Regalo de fin de año", incluye: ["Posavasos con base", "Organizador de escritorio", "Mini planta para escritorio", "Organizador con soporte para celular"],
        texto: "Un regalo útil que se queda en el escritorio todo el año, con el logo de la empresa." },
      { rubro: "homeoffice", nombre: "Kit Notebook", codigos: ["H02.1", "H03.1", "H05.3", "H05.1"], para: "Equipar el puesto", incluye: ["Elevador para notebook", "Soporte vertical para notebook", "Clips para cables", "Organizador de cables y cargadores"],
        texto: "Mejor postura, la notebook en su lugar y los cables ordenados." },
      { rubro: "homeoffice", nombre: "Kit Coworking", codigos: ["H10.1", "H10.2", "H05.4", "H05.2"], para: "Trabajo en movimiento", incluye: ["Soporte plegable de bolsillo", "Gancho para mochila", "Organizador de cargador y cable", "Enrolladores de cables"],
        texto: "Para quienes trabajan desde un café, un coworking o en viaje: todo entra en la mochila." }
    ]
  };
})();
