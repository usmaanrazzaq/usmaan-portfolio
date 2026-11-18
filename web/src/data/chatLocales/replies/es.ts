import { heroLink } from "@/data/heroChat";
import type { LocaleReplies } from "../types";

/**
 * Spanish replies. "Tú", neutral enough for Spain and Latin America.
 * First-person lines avoid gendered words ("diseñador", "orgulloso") so they
 * read the same for anyone. Commands suggested here ('sobre mí',
 * 'contacto', ...) must stay in keywords/es.ts.
 * Review: not yet reviewed by a native speaker.
 */
const es: LocaleReplies = {
  topics: {
    name: [["Usmaan. Dos a, una m. Es la errata más común en mi bandeja de entrada."]],
    who: [
      [
        "Me dedico al diseño de producto en Nueva York. Llevo los productos de la investigación al diseño y al código en producción, normalmente como la única persona de diseño del equipo.",
        "¿Quieres la versión larga?",
      ],
      ["Sigo siendo Usmaan, sigo diseñando producto.", "Escribe 'sobre mí' para la historia completa."],
    ],
    location: [["Nueva York. El reloj bajo mi nombre está en vivo, así puedes ver si es hora de dormir aquí."]],
    background: [
      [
        "Estoy estudiando un BFA en Diseño en Queens College.",
        "Desde 2021 diseño para apps de consumo, organizaciones sin fines de lucro y e-commerce, de Rented a Adsum NYC.",
      ],
    ],
    now: [
      [
        "Ahora mismo llevo el diseño de producto en Adsum NYC, una marca de ropa de Brooklyn.",
        "Y acabo de terminar Shifts, una app de turnos para equipos. ¿Te cuento sobre Adsum?",
      ],
    ],
    process: [
      [
        "De principio a fin. Empiezo con investigación, diseño en Figma y luego lo construyo yo o junto a los ingenieros.",
        "Como también entrego el código, nada se pierde entre la maqueta y el producto.",
      ],
      ["Versión corta: investigar, diseñar, construir y volver a investigar cuando lo usa gente real."],
    ],
    research: [
      [
        "Todo empieza con la investigación. Para NMYA dirigí grupos focales de distintas edades y roles; para WCM leí cientos de reseñas de la App Store.",
        "¿Te cuento sobre NMYA?",
      ],
    ],
    code: [
      [
        "Sí, programo. Este sitio está hecho con Next.js, TypeScript y Tailwind.",
        "Entregué una tienda Shopify a medida para DPR Studio y construí los sitios de NMYA y Shifts, así los ingenieros nunca tienen que adivinar lo que quise decir.",
      ],
    ],
    tools: [
      [
        "Figma para diseñar. Un editor de código para todo lo demás.",
        "Next.js, TypeScript y Tailwind para construir, y Shopify cuando hay algo que vender.",
      ],
    ],
    team: [
      [
        "Normalmente soy la única persona de diseño, trabajando codo a codo con ingenieros y fundadores.",
        "Hablar diseño y código a la vez significa menos documentos de traspaso que nadie lee.",
      ],
    ],
    mobile: [
      [
        "Bastante. Rented y Shifts son apps, y WCM Connect es el rediseño de una app para pacientes.",
        "¿Empezamos por Rented? El caso de estudio tiene un prototipo que funciona.",
      ],
    ],
    clients: [
      [
        "Apps de consumo, una organización nacional sin fines de lucro y marcas de moda y e-commerce.",
        "Adsum NYC, DPR Studio, Rented y la National Muslim Youth Association, entre otras. Escribe 'portafolio' para verlas.",
      ],
    ],
    favourite: [
      ["On The Run Studio. Es el proyecto que llevo más tiempo construyendo, desde 2021.", "¿Quieres la historia?"],
    ],
    hardest: [
      [
        "NMYA. Muchas partes interesadas, muchas opiniones y un sitio en WordPress que se había quedado pequeño.",
        "Los grupos focales le dieron a todos la misma evidencia para ponerse de acuerdo. ¿Quieres saber cómo salió?",
      ],
    ],
    inspiration: [
      [
        "Dieter Rams, Massimo Vignelli, Jan Tschichold, John Pawson, Peter Zumthor. Menos, pero mejor.",
        "El resto está en la página References. ¿Te llevo?",
      ],
    ],
    philosophy: [
      [
        "El buen diseño no es solo cómo se ve algo. Es cómo funciona y cómo hace sentir a la gente.",
        "En lo visual tiro a lo suizo: retículas, contención y nada que no se haya ganado su lugar.",
      ],
    ],
    explorations: [
      [
        "En Explorations guardo experimentos personales, como un prototipo de onboarding por géneros para GoodReads y un rediseño de la barra lateral de Claude Code.",
        "¿Te llevo?",
      ],
    ],
    references: [
      [
        "References es una colección de imágenes que me inspiran al diseñar: un retrato visual de cómo pienso el diseño.",
        "Sale de mis canales de Are.na y crece con ellos. ¿Te llevo?",
      ],
    ],
    site: [
      [
        "Lo diseñé y lo construí. Next.js por dentro, contención suiza por fuera.",
        "Este chat es un pequeño guion mío, no una línea directa a mi teléfono. Una pena, la verdad.",
      ],
    ],
    bot: [
      [
        "Respuesta honesta: estás hablando con una versión guionizada de mí.",
        "La versión real responde por el formulario de contacto. Escribe 'contacto' y se abrirá.",
      ],
    ],
    hire: [
      [
        "Estoy disponible para trabajo a tiempo completo, freelance o por contrato: presencial en Nueva York, en remoto o con mudanza.",
        "El formulario de contacto me llega directamente. ¿Lo abro?",
      ],
    ],
    rates: [
      [
        "Depende del proyecto, así que es más una conversación que una burbuja de chat.",
        "¿Abro el formulario de contacto y me cuentas en qué estás trabajando?",
      ],
    ],
    personal: [
      ["Lo personal lo dejo fuera del portafolio.", "Pero de diseño hablo todo el día."],
      ["Sigue siendo extraoficial.", "¿Me preguntas por un proyecto mejor?"],
    ],
    contact: [["El formulario de contacto llega directo a mi bandeja de entrada.", "Te lo abro."]],
    resume: [["Aquí está.", heroLink("resume")]],
    socials: [
      [
        "Elige tu plataforma:",
        heroLink("linkedin"),
        heroLink("instagram"),
        heroLink("github"),
        heroLink("x"),
      ],
    ],
    greeting: [
      [
        "¡Hola! Gracias por pasarte.",
        "Pregúntame por mi trabajo, mi proceso o cualquier proyecto. O escribe 'portafolio' para ir directo.",
      ],
      ["Hola de nuevo.", "¿Qué te gustaría saber?"],
    ],
    "how-are-you": [
      [
        "Todo bien, gracias. Entre un archivo de Figma y un pull request, como siempre.",
        "¿En qué te puedo ayudar?",
      ],
      ["Sigo bien. Sigo diseñando.", "¿Quieres saber algo del trabajo?"],
    ],
    thanks: [["Cuando quieras."], ["Faltaría más. Gracias por echar un vistazo."]],
    bye: [["Gracias por pasarte. Vuelve pronto, casi siempre hay algo nuevo."]],
    compliment: [
      ["Gracias, de verdad me alegraste el día.", "Si te gustó, los casos de estudio van más a fondo."],
      ["Qué amable. Sigue así y me lo voy a creer."],
    ],
    critique: [
      [
        "Anotado. La crítica es investigación gratis.",
        "Si tienes detalles, el formulario de contacto me los hace llegar. Escribe 'contacto'.",
      ],
    ],
    joke: [
      ["¿Cuántos diseñadores hacen falta para cambiar una bombilla?", "¿Tiene que ser una bombilla?"],
      ["Una vez le pedí a un desarrollador que centrara un div.", "Seguimos en contacto. El div, no."],
    ],
    test: [["Prueba recibida. Todo funciona, y yo también."]],
    help: [
      [
        "Pregúntame por mi proceso, un proyecto como Rented o Adsum, en qué estoy trabajando o cómo contactarme.",
        "O escribe 'portafolio', 'sobre mí', 'experimentos', 'referencias' o 'contacto'.",
      ],
    ],
    work: [["Aquí está el trabajo."]],
    "about-open": [["Te llevo a la página About."]],
    "explorations-open": [["Abriendo Explorations."]],
    "references-open": [["Abriendo References."]],
    "contact-open": [["Abriendo el formulario de contacto."]],
    affirm: [
      ["Me encanta el entusiasmo.", "Pregúntame por mi proceso, un proyecto o en qué estoy trabajando."],
      ["De acuerdo. En qué, no lo tengo claro, pero de acuerdo.", "Prueba a preguntar por un proyecto, como 'Rented' o 'Adsum'."],
    ],
    decline: [["Sin problema.", "Aquí estaré si se te ocurre algo."], ["Me parece bien."]],
  },
  projects: {
    shifts: [
      "Shifts es una app de turnos para equipos: un calendario tranquilo para planificar quién trabaja cuándo. La diseñé y la construí, así que el prototipo es el producto.",
      "El resultado: una organización local sin fines de lucro gestionó con ella a su equipo de seguridad durante cuatro días, unas 15 personas en 3 equipos y de 20 a 30 turnos, y por fin pudo ver la cobertura sin una hoja de cálculo.",
    ],
    rented: [
      "Rented es una app de alquiler entre particulares para gente de ciudad. Pedir prestado un taladro en vez de comprarlo.",
      "Llevé todo el diseño de producto junto a los fundadores y los ingenieros. Hice dos rondas de pruebas de usabilidad y construí un prototipo funcional, que corre en vivo dentro del caso de estudio.",
      "El resultado: la primera tarea pasó de un 71 % a un 100 % de éxito entre rondas, el onboarding tomaba menos de un minuto y los ingenieros recibieron más de 30 pantallas listas para desarrollo.",
    ],
    nmya: [
      "Para la National Muslim Youth Association dirigí el rediseño completo de su web y la pasé de una instalación de WordPress expuesta a malware a Webflow.",
      "Hice grupos focales con distintas edades, roles y niveles de conocimiento, y rediseñé y construí el sitio a partir de lo que escuchamos.",
      "El resultado: a los pocos meses del lanzamiento, el tráfico subió un 30 %, las páginas vistas un 15 % y los visitantes recurrentes entre un 10 y un 15 %. Las páginas clave pasaron de estar a cinco o seis clics a dos o tres.",
    ],
    adsum: [
      "Adsum NYC es una marca de ropa de Brooklyn con más de 25.000 visitantes al mes. Diseño y lanzo la tienda Shopify con el fundador, además del diseño de campañas y correos.",
      "El resultado que más destaco: un filtro de tallas que construí desde cero redujo un 35 % los clics en tallas agotadas.",
      "Y los correos de lanzamiento que diseño tienen una tasa de apertura del 43,8 %, frente a una media del sector de alrededor del 33 %.",
    ],
    dpr: [
      "DPR Studio es un estudio de producción de California: prendas, identidad de marca, dirección creativa.",
      "Rediseñé y construí su sitio Shopify a medida con el fundador, de la investigación al código en producción.",
    ],
    otrs: [
      "On The Run Studio empezó en 2021 como mi cuenta personal de moodboards. Ahí se entrenó buena parte de mi gusto.",
      "El resultado: una comunidad de 5.000 diseñadores y marcas en un año y medio, merch diseñado por mí que se vendió hasta en Francia, España y el Reino Unido y, al final, un estudio de diseño completo.",
    ],
    wcm: [
      "WCM Connect es un concepto propio: rediseñé el onboarding, el panel y las citas de una app real para pacientes.",
      "El encargo salió de sus reseñas en la App Store. Los usuarios ya habían hecho la investigación; yo solo la leí.",
      "El resultado: un onboarding más sencillo, un panel construido en torno a las tareas más comunes de los pacientes y menos fricción al pedir cita. Es un concepto, así que no hay cifras de lanzamiento, pero el caso de estudio explica cada decisión.",
    ],
  },
  misses: [
    ["Mmm, eso no está en mi guion.", "Prueba a preguntar por mi proceso, un proyecto como Rented o en qué estoy trabajando."],
    ["Soy una versión guionizada de mí, así que eso se me escapó.", "Escribe 'ayuda' para ver qué puedo responder."],
    ["Buena pregunta. Chat equivocado, eso sí.", "Prueba con 'portafolio', 'sobre mí' o 'contacto'."],
  ],
  handoff: ["Eso suena a pregunta para la versión real.", "¿Quieres que abra el formulario de contacto?"],
  ui: {
    offerCase: "¿Quieres leer el caso de estudio?",
    offerSite: "¿Quieres ver el sitio en vivo?",
    openingCase: "Abriéndolo.",
    hereYouGo: "Aquí lo tienes.",
    pageInEnglish: "Un aviso: las páginas en sí están en inglés.",
    formInEnglish: "El formulario está en inglés, pero puedes escribirme en español.",
    hello: "¡Hola!",
    link: (text) => `Enlace: ${text}.`,
  },
};

export default es;
