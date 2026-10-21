export const LANGS = ["en", "es"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(v: string): v is Lang {
  return (LANGS as readonly string[]).includes(v);
}

// Textos estáticos del diseño de Figma (EN es el original; ES es traducción para revisar).
export const dict = {
  en: {
    nav: { home: "Home", work: "Work", about: "About", resume: "Resume", theme: { toDark: "Switch to dark mode", toLight: "Switch to light mode" } },
    seo: {
      home: { title: "Yamil Arroyo — Principal Product Designer", description: "Principal Product Designer with 12+ years of experience designing financial products and the systems that help them scale." },
      work: { title: "Work", description: "I am passionate about creating digital products from a “user-centered” approach." },
      about: { title: "About", description: "Principal Product Designer with 12+ years of experience designing financial products and the systems that help them scale." },
    },
    hero: {
      hello: "Hi I’m Yamil!",
      nickname: "Chinno for friends",
      role: "Principal Product Designer",
      roleSub: "Product Strategy · Design Leadership · Design Systems",
      intro1:
        "I'm a Principal Product Designer with 12+ years of experience designing financial products and the systems that help them scale.",
      intro2:
        "I work at the intersection of customer experience, business strategy, and technology to simplify complex products and turn design into measurable outcomes.",
      cta: { work: "Selected work", cv: "Download CV", contact: "Contact" },
    },
    principles: {
      title: "Principles",
      lead: "I work across a variety of disciplines, bringing a diverse set of skills and a creative approach to each project.",
      items: [
        { title: "Product management", text: "I lead the design and development of innovative products, with strategic skills, leadership, and effective communication." },
        { title: "Product Design", text: "I combine creativity and user understanding to develop attractive and functional digital products throughout their lifecycle." },
        { title: "Data Driven", text: "My approach leverages data for informed design decisions and effective outcomes at every stage of the process." },
      ],
    },
    projects: { title: "Featured Projects", more: "See more projects" },
    testimonials: {
      title: "What people I've worked with say",
      lead: "Recommendations received on LinkedIn, in their original language.",
      pause: "Pause", play: "Play", opens: "(opens LinkedIn)",
    },
    about: {
      title: "A little bit about me",
      lead: "I am passionate about creating beautiful products that empower people.",
      body: [
        "I am a passionate designer with skills to create user-friendly digital products. I enjoy transforming organizations and envisioning a better future through design.",
        "Over the past 12+ years, I have worked in various sectors such as banking, insurance, retail, and e-commerce, focusing on product management and team leadership.",
        "My approach revolves around understanding user needs aligned with business goals to create solutions that deliver impactful experiences.",
      ],
      cta: "Know more about me",
    },
    work: {
      title: "Portfolio",
      lead: "I am passionate about creating digital products from a “user-centered” approach.",
      readMore: "Read more",
      gallery: {
        all: "All", platform: "Platform", level: "Type", company: "Company", status: "Status",
        featured: "Featured", recent: "Recent", more: "more", impact: "Impact",
        soon: "Coming soon", inProgress: "In progress", done: "Completed", empty: "No projects match these filters.", clear: "Clear filters", count: "projects",
        viewCase: "View case", loadMore: "Load more", showing: "Showing {n} of {total}", selected: "Selected work", filters: "Filters", showN: "Show {n} projects", close: "Close", remove: "Remove filter",
        levels: { Proyecto: "Project", Iniciativa: "Initiative", Feature: "Feature" },
        statuses: { Completado: "Completed", "En progreso": "In progress" },
        platforms: { Web: "Web", App: "App", "Web App": "Web App", TPV: "POS terminal" },
      },
    },
    footer: {
      ping: "Ping me at",
      based: ["Based in Mexico City,", "Mexico"],
      site: "Site",
      social: "Social",
      mentoring: "Mentoring",
      designedBy: "Designed by Yamil Arroyo",
      copyright: `Copyright © ${new Date().getFullYear()} Yamil Arroyo`,
    },
    project: {
      back: "Back",
      content: "Content",
      start: "Start",
      readTime: "min read",
      execution: "Execution",
      tools: "Used Tools",
      role: "My Role",
      team: "Team",
      intro: "Intro:",
      sections: {
        introduction: "Introduction",
        highlights: "Highlights",
        metrics: "Key metrics",
        targets: "Targets & expectations",
        problem: "Problem",
        research: "Research",
        solution: "Solution",
        release: "Release",
        learnings: "Learnings",
        next: "Next steps",
        related: "Related content",
      },
      present: "Present",
      prototype: "Prototype",
      targetTag: "Target",
      outcomesLabel: "Key results",
      scaleLabel: "Scale",
      figma: { fullscreen: "Full screen", exit: "Exit full screen", open: "Open in Figma" },
      facts: { company: "Company", period: "Period" },
    },
  },
  es: {
    nav: { home: "Inicio", work: "Proyectos", about: "Sobre mí", resume: "CV", theme: { toDark: "Cambiar a modo oscuro", toLight: "Cambiar a modo claro" } },
    seo: {
      home: { title: "Yamil Arroyo — Principal Product Designer", description: "Principal Product Designer con más de 12 años de experiencia diseñando productos financieros y los sistemas que ayudan a escalarlos." },
      work: { title: "Proyectos", description: "Me apasiona crear productos digitales desde un enfoque “centrado en el usuario”." },
      about: { title: "Sobre mí", description: "Principal Product Designer con más de 12 años de experiencia diseñando productos financieros y los sistemas que ayudan a escalarlos." },
    },
    hero: {
      hello: "¡Hola, soy Yamil!",
      nickname: "Chinno para los amigos",
      role: "Principal Product Designer",
      roleSub: "Estrategia de producto · Liderazgo de diseño · Design Systems",
      intro1:
        "Soy Principal Product Designer con más de 12 años de experiencia diseñando productos financieros y los sistemas que ayudan a escalarlos.",
      intro2:
        "Trabajo en la intersección entre experiencia del cliente, estrategia de negocio y tecnología para simplificar productos complejos y convertir el diseño en resultados medibles.",
      cta: { work: "Trabajo seleccionado", cv: "Descargar CV", contact: "Contacto" },
    },
    principles: {
      title: "Principios",
      lead: "Trabajo en distintas disciplinas, aportando habilidades diversas y un enfoque creativo a cada proyecto.",
      items: [
        { title: "Gestión de producto", text: "Lidero el diseño y desarrollo de productos innovadores, con visión estratégica, liderazgo y comunicación efectiva." },
        { title: "Diseño de producto", text: "Combino creatividad y comprensión del usuario para desarrollar productos digitales atractivos y funcionales durante todo su ciclo de vida." },
        { title: "Basado en datos", text: "Mi enfoque aprovecha los datos para tomar decisiones de diseño informadas y lograr resultados efectivos en cada etapa del proceso." },
      ],
    },
    projects: { title: "Proyectos destacados", more: "Ver más proyectos" },
    testimonials: {
      title: "Lo que dicen quienes han trabajado conmigo",
      lead: "Recomendaciones recibidas en LinkedIn.",
      pause: "Pausar", play: "Reproducir", opens: "(abre LinkedIn)",
    },
    about: {
      title: "Un poco sobre mí",
      lead: "Me apasiona crear productos hermosos que empoderen a las personas.",
      body: [
        "Soy un diseñador apasionado, con habilidades para crear productos digitales fáciles de usar. Disfruto transformar organizaciones e imaginar un mejor futuro a través del diseño.",
        "En más de 12 años he trabajado en sectores como banca, seguros, retail y e-commerce, enfocado en gestión de producto y liderazgo de equipos.",
        "Mi enfoque gira en torno a entender las necesidades del usuario alineadas con los objetivos del negocio para crear soluciones con experiencias de impacto.",
      ],
      cta: "Conoce más sobre mí",
    },
    work: {
      title: "Portafolio",
      lead: "Me apasiona crear productos digitales desde un enfoque “centrado en el usuario”.",
      readMore: "Leer más",
      gallery: {
        all: "Todos", platform: "Plataforma", level: "Tipo", company: "Empresa", status: "Estado",
        featured: "Destacado", recent: "Reciente", more: "más", impact: "Impacto",
        soon: "Próximamente", inProgress: "En progreso", done: "Completados", empty: "Ningún proyecto coincide con estos filtros.", clear: "Quitar filtros", count: "proyectos",
        viewCase: "Ver caso", loadMore: "Ver más", showing: "Mostrando {n} de {total}", selected: "Trabajo destacado", filters: "Filtros", showN: "Ver {n} proyectos", close: "Cerrar", remove: "Quitar filtro",
        levels: { Proyecto: "Proyecto", Iniciativa: "Iniciativa", Feature: "Feature" },
        statuses: { Completado: "Completado", "En progreso": "En progreso" },
        platforms: { Web: "Web", App: "App", "Web App": "Web App", TPV: "TPV" },
      },
    },
    footer: {
      ping: "Escríbeme a",
      based: ["Desde Ciudad de México,", "México"],
      site: "Sitio",
      social: "Social",
      mentoring: "Mentoría",
      designedBy: "Diseñado por Yamil Arroyo",
      copyright: `Copyright © ${new Date().getFullYear()} Yamil Arroyo`,
    },
    project: {
      back: "Volver",
      content: "Contenido",
      start: "Empezar",
      readTime: "min de lectura",
      execution: "Ejecución",
      tools: "Herramientas",
      role: "Mi rol",
      team: "Equipo",
      intro: "Intro:",
      sections: {
        introduction: "Introducción",
        highlights: "Resultados",
        metrics: "Métricas clave",
        targets: "Metas y expectativas",
        problem: "Problema",
        research: "Research",
        solution: "Solución",
        release: "Lanzamiento",
        learnings: "Aprendizajes",
        next: "Próximos pasos",
        related: "Contenido relacionado",
      },
      present: "Actual",
      prototype: "Prototipo",
      targetTag: "Meta",
      outcomesLabel: "Resultados clave",
      scaleLabel: "Escala",
      figma: { fullscreen: "Pantalla completa", exit: "Salir de pantalla completa", open: "Abrir en Figma" },
      facts: { company: "Empresa", period: "Periodo" },
    },
  },
};

export type Dict = (typeof dict)["en"];
