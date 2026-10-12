export const LANGS = ["en", "es"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(v: string): v is Lang {
  return (LANGS as readonly string[]).includes(v);
}

// Textos estáticos del diseño de Figma (EN es el original; ES es traducción para revisar).
export const dict = {
  en: {
    nav: { home: "Home", work: "Work", about: "About", resume: "Resume" },
    seo: {
      home: { title: "Yamil Arroyo — Product Designer", description: "I am a digital product designer with over 11 years of experience, passionate about transforming organizations and building an exceptional digital future." },
      work: { title: "Work", description: "I am passionate about creating digital products from a “user-centered” approach." },
      about: { title: "About", description: "Principal Product Designer with 12+ years of experience designing financial products and the systems that help them scale." },
    },
    hero: {
      hello: "Hi I’m Yamil!",
      nickname: "Chinno for friends",
      role: "Product Designer",
      roleSub: "Product - Design - User Experience",
      intro1:
        "I am a digital product designer with over 11 years of experience, passionate about transforming organizations and building an exceptional digital future.",
      intro2:
        "I am excited about the opportunity to contribute my experience and passion to a visionary team. My ability to lead innovative projects and my strategic approach are valuable assets for any project I take on.",
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
    about: {
      title: "A little bit about me",
      lead: "I am passionate about creating beautiful products that empower people.",
      body: [
        "I am a passionate designer with skills to create user-friendly digital products. I enjoy transforming organizations and envisioning a better future through design.",
        "Over the past 11 years, I have worked in various sectors such as banking, insurance, retail, and e-commerce, focusing on product management and team leadership.",
        "My approach revolves around understanding user needs aligned with business goals to create solutions that deliver impactful experiences.",
      ],
      cta: "Know more about me",
    },
    work: {
      title: "Portfolio",
      lead: "I am passionate about creating digital products from a “user-centered” approach.",
      readMore: "Read more",
      gallery: {
        all: "All", level: "Type", company: "Company", status: "Status",
        featured: "Featured", recent: "Recent", more: "more", impact: "Impact",
        soon: "Coming soon", inProgress: "In progress", done: "Completed", empty: "No projects match these filters.", clear: "Clear filters", count: "projects",
        levels: { Proyecto: "Project", Iniciativa: "Initiative", Feature: "Feature" },
        statuses: { Completado: "Completed", "En progreso": "In progress" },
      },
    },
    footer: {
      ping: "Ping me at",
      based: ["Based in Mexico City,", "Mexico"],
      site: "Site",
      social: "Social",
      mentoring: "Mentoring",
      designedBy: "Designed by Yamil Arroyo",
      copyright: "Copyright © 2024 Yamil Arroyo",
    },
    project: {
      back: "Back",
      content: "Content",
      start: "Start",
      execution: "Execution",
      tools: "Used Tools",
      role: "My Role",
      team: "Team",
      intro: "Intro:",
      sections: {
        introduction: "Introduction",
        highlights: "Highlights",
        metrics: "Key metrics",
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
      figma: { fullscreen: "Full screen", exit: "Exit full screen", open: "Open in Figma" },
      facts: { company: "Company", period: "Period" },
    },
  },
  es: {
    nav: { home: "Inicio", work: "Proyectos", about: "Sobre mí", resume: "CV" },
    seo: {
      home: { title: "Yamil Arroyo — Product Designer", description: "Soy diseñador de producto digital con más de 11 años de experiencia, apasionado por transformar organizaciones y construir un futuro digital excepcional." },
      work: { title: "Proyectos", description: "Me apasiona crear productos digitales desde un enfoque “centrado en el usuario”." },
      about: { title: "Sobre mí", description: "Principal Product Designer con más de 12 años de experiencia diseñando productos financieros y los sistemas que ayudan a escalarlos." },
    },
    hero: {
      hello: "¡Hola, soy Yamil!",
      nickname: "Chinno para los amigos",
      role: "Product Designer",
      roleSub: "Producto - Diseño - Experiencia de usuario",
      intro1:
        "Soy diseñador de producto digital con más de 11 años de experiencia, apasionado por transformar organizaciones y construir un futuro digital excepcional.",
      intro2:
        "Me entusiasma la oportunidad de aportar mi experiencia y pasión a un equipo visionario. Mi capacidad para liderar proyectos innovadores y mi enfoque estratégico son activos valiosos para cualquier proyecto que emprendo.",
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
    about: {
      title: "Un poco sobre mí",
      lead: "Me apasiona crear productos hermosos que empoderen a las personas.",
      body: [
        "Soy un diseñador apasionado, con habilidades para crear productos digitales fáciles de usar. Disfruto transformar organizaciones e imaginar un mejor futuro a través del diseño.",
        "En los últimos 11 años he trabajado en sectores como banca, seguros, retail y e-commerce, enfocado en gestión de producto y liderazgo de equipos.",
        "Mi enfoque gira en torno a entender las necesidades del usuario alineadas con los objetivos del negocio para crear soluciones con experiencias de impacto.",
      ],
      cta: "Conoce más sobre mí",
    },
    work: {
      title: "Portafolio",
      lead: "Me apasiona crear productos digitales desde un enfoque “centrado en el usuario”.",
      readMore: "Leer más",
      gallery: {
        all: "Todos", level: "Tipo", company: "Empresa", status: "Estado",
        featured: "Destacado", recent: "Reciente", more: "más", impact: "Impacto",
        soon: "Próximamente", inProgress: "En progreso", done: "Completados", empty: "Ningún proyecto coincide con estos filtros.", clear: "Quitar filtros", count: "proyectos",
        levels: { Proyecto: "Proyecto", Iniciativa: "Iniciativa", Feature: "Feature" },
        statuses: { Completado: "Completado", "En progreso": "En progreso" },
      },
    },
    footer: {
      ping: "Escríbeme a",
      based: ["Desde Ciudad de México,", "México"],
      site: "Sitio",
      social: "Social",
      mentoring: "Mentoría",
      designedBy: "Diseñado por Yamil Arroyo",
      copyright: "Copyright © 2024 Yamil Arroyo",
    },
    project: {
      back: "Volver",
      content: "Contenido",
      start: "Empezar",
      execution: "Ejecución",
      tools: "Herramientas",
      role: "Mi rol",
      team: "Equipo",
      intro: "Intro:",
      sections: {
        introduction: "Introducción",
        highlights: "Resultados",
        metrics: "Métricas clave",
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
      figma: { fullscreen: "Pantalla completa", exit: "Salir de pantalla completa", open: "Abrir en Figma" },
      facts: { company: "Empresa", period: "Periodo" },
    },
  },
};

export type Dict = (typeof dict)["en"];
