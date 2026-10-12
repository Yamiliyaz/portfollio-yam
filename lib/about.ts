import type { Lang } from "./i18n";

// Contenido de la página About. EN sigue el brief de posicionamiento tal cual; ES es traducción para revisar.
// Las métricas se muestran SOLO con la atribución indicada en cada elemento (no mezclar iniciativas).

export type Metric = {
  /** Número visible, p. ej. "25%". */
  value: string;
  /** Lectura para lectores de pantalla cuando el símbolo no basta (p. ej. "~15%" → "Approximately 15%"). */
  valueSr?: string;
  /** Palabra que acompaña al número: "reduction", "increase"… */
  change: string;
  label: string;
  /** Iniciativa a la que pertenece la métrica. */
  context: string;
  description?: string;
  /** Resultado adicional de la misma iniciativa. */
  extra?: string;
};

export type AboutContent = {
  hero: { heading: string; paragraphs: string[]; photoAlt: string };
  impact: { title: string; items: Metric[] };
  approach: { title: string; items: { title: string; text: string }[] };
  career: { title: string; items: { company: string; role: string; period: string; description: string }[] };
  beyond: { title: string; paragraphs: string[]; caption: string; photos: { n: number; alt: string }[] };
  closing: { heading: string; email: string; linkedin: string };
};

export const about: Record<Lang, AboutContent> = {
  en: {
    hero: {
      heading: "I design financial products — and the systems that help them scale.",
      paragraphs: [
        "I'm a Principal Product Designer with 12+ years of experience across fintech, financial services, e-commerce and digital products in Latin America.",
        "I work at the intersection of product strategy, customer experience and design operations. My focus is turning complex business problems into clear, intuitive experiences while helping teams build the systems and ways of working needed to deliver better products at scale.",
        "Throughout my career, I've moved between hands-on product design, design leadership and strategic initiatives. That perspective helps me connect the details of a user journey with the broader business, technical and organizational challenges behind it.",
      ],
      photoAlt: "Close-up portrait of Yamil wearing a cap and mirrored sunglasses in front of palm leaves.",
    },
    impact: {
      title: "Selected impact",
      items: [
        {
          value: "25%",
          change: "reduction",
          label: "Design implementation time",
          context: "Konfío Design System",
          description: "Contributed to the rollout of a multi-platform Design System that helped teams work more consistently and efficiently.",
        },
        {
          value: "~15%",
          valueSr: "Approximately 15%",
          change: "improvement",
          label: "Time-to-market",
          context: "Konfío Design System",
          description: "The initiative helped accelerate product delivery by reducing repeated design work and improving collaboration between design and engineering.",
        },
        {
          value: "30%",
          change: "increase",
          label: "Customer satisfaction",
          context: "Citibanamex Business Banking redesign",
          extra: "Additional result: 10% improvement in customer retention.",
        },
      ],
    },
    approach: {
      title: "How I approach design",
      items: [
        {
          title: "Simplifying financial complexity",
          text: "Financial products involve trust, risk, business rules and operational constraints. I enjoy making these experiences easier to understand and use without losing the control and clarity customers need.",
        },
        {
          title: "Connecting design with business outcomes",
          text: "I approach design as part of product strategy, not as a layer added at the end. I work to connect customer needs, business priorities, data and technical feasibility, using evidence and iteration to inform decisions.",
        },
        {
          title: "Building for scale",
          text: "Great design shouldn't depend on individual heroics. Through Design Systems, clear principles and cross-functional collaboration, I help teams reduce duplication, improve consistency and deliver more effectively.",
        },
      ],
    },
    career: {
      title: "Career",
      items: [
        {
          company: "Aviva",
          role: "Principal Product Designer",
          period: "Oct 2024 – Present",
          description:
            "Working across lending journeys and internal sales operations, exploring how product design, data and emerging technologies can improve digital experiences and operational workflows.",
        },
        {
          company: "Konfío",
          role: "Product Design Manager",
          period: "Feb 2021 – Jan 2024",
          description:
            "Worked across payment experiences, product integration and Design Systems, connecting customer needs with product delivery and cross-functional execution.",
        },
        {
          company: "Anzen Digital",
          role: "Head of Design",
          period: "May 2014 – Feb 2021",
          description:
            "Led design initiatives for enterprise financial products, including the Citibanamex Business Banking redesign, alongside the standardization of design processes for financial-services clients.",
        },
      ],
    },
    beyond: {
      title: "Beyond work",
      paragraphs: [
        "Outside work, I'm curious about food, music and technology. I enjoy experimenting in the kitchen, putting together DJ sets, playing video games and discovering new ideas in product and design.",
        "For me, creativity isn't limited to the design process. It's a way of exploring, connecting ideas and looking at familiar problems from a different perspective.",
      ],
      caption: "Snapshots from a trip to Costa Rica.",
      photos: [
        { n: 1, alt: "Colorful mural of stacked houses and a large stylized face covering the corner of a building." },
        { n: 2, alt: "Yamil wearing a captain's cap at the helm of a boat, looking out over the sea." },
        { n: 4, alt: "Yamil taking a selfie on a beach, wearing a cap and sunglasses and making a peace sign." },
      ],
    },
    closing: {
      heading: "Interested in complex financial products, design strategy or building scalable design teams? Let's connect.",
      email: "Send an email",
      linkedin: "LinkedIn",
    },
  },
  es: {
    hero: {
      heading: "Diseño productos financieros — y los sistemas que ayudan a escalarlos.",
      paragraphs: [
        "Soy Principal Product Designer con más de 12 años de experiencia en fintech, servicios financieros, e-commerce y productos digitales en Latinoamérica.",
        "Trabajo en la intersección entre estrategia de producto, experiencia del cliente y operaciones de diseño. Mi enfoque es convertir problemas de negocio complejos en experiencias claras e intuitivas, a la vez que ayudo a los equipos a construir los sistemas y las formas de trabajo necesarios para entregar mejores productos a escala.",
        "A lo largo de mi carrera he transitado entre el diseño de producto práctico, el liderazgo de diseño y las iniciativas estratégicas. Esa perspectiva me ayuda a conectar los detalles de un recorrido del usuario con los desafíos de negocio, técnicos y organizacionales que hay detrás.",
      ],
      photoAlt: "Retrato de Yamil con gorra y lentes de espejo frente a hojas de palmera.",
    },
    impact: {
      title: "Impacto destacado",
      items: [
        {
          value: "25%",
          change: "de reducción",
          label: "Tiempo de implementación de diseño",
          context: "Design System de Konfío",
          description: "Contribuí al despliegue de un Design System multiplataforma que ayudó a los equipos a trabajar con más consistencia y eficiencia.",
        },
        {
          value: "~15%",
          valueSr: "Aproximadamente 15%",
          change: "de mejora",
          label: "Time-to-market",
          context: "Design System de Konfío",
          description: "La iniciativa ayudó a acelerar la entrega de producto al reducir el trabajo de diseño repetido y mejorar la colaboración entre diseño e ingeniería.",
        },
        {
          value: "30%",
          change: "de aumento",
          label: "Satisfacción del cliente",
          context: "Rediseño de Banca Empresarial de Citibanamex",
          extra: "Resultado adicional: 10% de mejora en la retención de clientes.",
        },
      ],
    },
    approach: {
      title: "Cómo abordo el diseño",
      items: [
        {
          title: "Simplificar la complejidad financiera",
          text: "Los productos financieros implican confianza, riesgo, reglas de negocio y restricciones operativas. Disfruto hacer estas experiencias más fáciles de entender y usar sin perder el control y la claridad que los clientes necesitan.",
        },
        {
          title: "Conectar el diseño con resultados de negocio",
          text: "Entiendo el diseño como parte de la estrategia de producto, no como una capa que se agrega al final. Trabajo para conectar las necesidades del cliente, las prioridades del negocio, los datos y la factibilidad técnica, usando evidencia e iteración para informar las decisiones.",
        },
        {
          title: "Construir para escalar",
          text: "El buen diseño no debería depender de esfuerzos heroicos individuales. A través de Design Systems, principios claros y colaboración multifuncional, ayudo a los equipos a reducir duplicidad, mejorar la consistencia y entregar con más eficacia.",
        },
      ],
    },
    career: {
      title: "Trayectoria",
      items: [
        {
          company: "Aviva",
          role: "Principal Product Designer",
          period: "Oct 2024 – Presente",
          description:
            "Trabajo en recorridos de crédito y operaciones internas de ventas, explorando cómo el diseño de producto, los datos y las tecnologías emergentes pueden mejorar las experiencias digitales y los flujos operativos.",
        },
        {
          company: "Konfío",
          role: "Product Design Manager",
          period: "Feb 2021 – Ene 2024",
          description:
            "Trabajé en experiencias de pago, integración de producto y Design Systems, conectando las necesidades del cliente con la entrega de producto y la ejecución multifuncional.",
        },
        {
          company: "Anzen Digital",
          role: "Head of Design",
          period: "May 2014 – Feb 2021",
          description:
            "Lideré iniciativas de diseño para productos financieros empresariales, incluido el rediseño de Banca Empresarial de Citibanamex, junto con la estandarización de procesos de diseño para clientes de servicios financieros.",
        },
      ],
    },
    beyond: {
      title: "Más allá del trabajo",
      paragraphs: [
        "Fuera del trabajo, soy curioso con la comida, la música y la tecnología. Disfruto experimentar en la cocina, armar sets de DJ, jugar videojuegos y descubrir ideas nuevas sobre producto y diseño.",
        "Para mí, la creatividad no se limita al proceso de diseño. Es una forma de explorar, conectar ideas y mirar problemas conocidos desde otra perspectiva.",
      ],
      caption: "Fotos de un viaje a Costa Rica.",
      photos: [
        { n: 1, alt: "Mural colorido de casas apiladas y un gran rostro estilizado que cubre la esquina de un edificio." },
        { n: 2, alt: "Yamil con gorra de capitán al timón de un barco, mirando hacia el mar." },
        { n: 4, alt: "Yamil tomándose una selfie en la playa, con gorra y lentes de sol, haciendo la señal de paz." },
      ],
    },
    closing: {
      heading: "¿Te interesan los productos financieros complejos, la estrategia de diseño o construir equipos de diseño escalables? Conectemos.",
      email: "Enviar un correo",
      linkedin: "LinkedIn",
    },
  },
};
