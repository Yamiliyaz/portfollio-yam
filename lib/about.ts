import type { Lang } from "./i18n";

// Contenido de la página About, tomado del frame "Portfolio / About" del Figma (EN).
// El ES es traducción para revisar.
type Block = { title: string; paras: string[] };

export type AboutContent = {
  hero: { heading: string; sub: string; ctas: { id: string; label: string; icon: string }[] };
  story: { title: string; sub: string; left: Block[]; right: Block[] };
  experienceTitle: string;
  experience: { role: string; company: string; period: string }[];
  methodology: {
    title: string;
    sub: string;
    center: string;
    piece: { dataAnalysis: string; approach: string; framework: string; outer: string };
    top: [string, string];
    bottom: [string, string];
    steps: string[];
  };
  skillsTitle: string;
  skillsSub: string;
  skills: { icon: string; title: string; text: string }[];
};

const experience = [
  { role: "Product Design Manager", company: "Konfio", period: "Sep 2022 – Dec 2023" },
  { role: "Product Design Lead", company: "Konfio", period: "Feb 2021 – Aug 2022" },
  { role: "Design Director", company: "AgileThought (before Anzen Digital)", period: "Mar 2020 – Feb 2021" },
  { role: "Product Design Lead", company: "Citibanamex Empresarial (by Anzen Digital)", period: "Apr 2018 – Mar 2020" },
  { role: "UX/UI Designer", company: "Citibanamex Personal (by Anzen Digital)", period: "Jan 2017 – Apr 2018" },
  { role: "UX/UI Designer", company: "Anzen Digital", period: "May 2014 – Dec 2016" },
];

const icons = ["folder-managed", "strategy", "inventory", "toys-games", "donut", "architecture", "design-services", "animation", "data-loss"];

export const about: Record<Lang, AboutContent> = {
  en: {
    hero: {
      heading: "I am passionate about creating functional products that empower people.",
      sub: "I love design, food, and playing music. Choose what else you would like to know about me:",
      ctas: [
        { id: "experience", label: "Experience", icon: "cta-experience" },
        { id: "methodology", label: "Methodology", icon: "cta-methodology" },
        { id: "skills", label: "Skills", icon: "cta-skills" },
      ],
    },
    story: {
      title: "This is my story",
      sub: "With some snapshots from my recent trip to Costa Rica.",
      left: [
        {
          title: "The Evolution of Design: UX and More",
          paras: [
            "I come from a time when the term UX or product design didn't exist; it was simply being a web/app designer. Fortunately, I have witnessed and been part of the evolution of digital design in Mexico.",
            "The discipline of experience design, combined with a user-centered methodology, has helped me better understand user needs and align them with business objectives through viable technological solutions.",
          ],
        },
        {
          title: "In moments of relaxation",
          paras: [
            "When I'm not immersed in design, I dedicate my time to continue learning about design and product management. I read various articles about technology and enjoy my free time with video games, culinary experiments, or putting together DJ sets to liven up a good party.",
          ],
        },
      ],
      right: [
        {
          title: "Story of a Passion: Journey in Design",
          paras: [
            "Talking about myself is usually uncomfortable, but during high school, a hidden fascination was revealed: design. Computer science sparked my interest in digital tools like Photoshop and Macromedia Flash, triggering my desire to explore more in this field.",
            "In September 2013, I graduated in Digital Graphic Design. The job opportunity came quickly, leading me into the world of web design. Modularity, adaptability, and digital composition of web pages became my constant fascinations.",
          ],
        },
        {
          title: "Life between Design and Management",
          paras: [
            "Throughout my 11 years of experience, I have evolved from being a design area director to becoming a product manager, designing products in a different way. Why not both?",
            "Although the role of the designer is sometimes underestimated, applying management skills, data analysis, and product vision (Design Ops) has positively impacted how I design experiences and communicate results within the organization, improving user satisfaction.",
          ],
        },
      ],
    },
    experienceTitle: "Experience",
    experience,
    methodology: {
      title: "Work Methodology",
      sub: "The experience within each touchpoint creates emotions.",
      center: "Product Design",
      piece: { dataAnalysis: "Data analysis", approach: "HCD - Approach", framework: "Design Thinking - Framework", outer: "SD" },
      top: ["Product Management", "Design Ops Strategy"],
      bottom: ["Data Analysis", "Iteration process"],
      steps: ["Empathize", "Define", "Ideate", "Prototype", "Test"],
    },
    skillsTitle: "Skills",
    skillsSub:
      "I work in a variety of disciplines, bringing a diverse set of skills, constantly learning new concepts, staying up-to-date with the technology industry, digital products, and research and management methodologies.",
    skills: [
      ["Product Management", "Project management with an Agile/SCRUM approach, unifying execution and communication throughout the product lifecycle and the areas involved in it."],
      ["Product Strategy", "I help define goals and actions for product development and positioning in the market, focusing on user needs and implementing effective marketing and communication strategies."],
      ["Product design", "I provide end-to-end seamless experiences by considering user needs, business goals, and technological constraints in planning and execution."],
      ["Design Systems", "I apply my experience to lead the development of efficient design systems that ensure consistency in digital products using the atomic design methodology."],
      ["Data Driven", "My approach uses qualitative and quantitative data for informed design decisions and effective outcomes at every stage of the process."],
      ["UX Strategy", "Strategic planning with a methodology focused on universal design principles to obtain high-value qualitative and quantitative data."],
      ["UI Design", "Designing visually appealing and user-friendly interfaces following fundamental rules. By adopting these principles, the product will be well on its way to success."],
      ["Interaction Design", "Intuitive design of effective interactions tailored to user needs, thus contributing to the creation of memorable and user-centered digital experiences."],
      ["User Research", "Research planning with a methodology focused on asking the right questions and gathering user feedback, ensuring the creation of valuable insights."],
    ].map(([title, text], i) => ({ icon: icons[i], title, text })),
  },
  es: {
    hero: {
      heading: "Me apasiona crear productos funcionales que empoderen a las personas.",
      sub: "Me encantan el diseño, la comida y tocar música. Elige qué más te gustaría saber de mí:",
      ctas: [
        { id: "experience", label: "Experiencia", icon: "cta-experience" },
        { id: "methodology", label: "Metodología", icon: "cta-methodology" },
        { id: "skills", label: "Habilidades", icon: "cta-skills" },
      ],
    },
    story: {
      title: "Esta es mi historia",
      sub: "Con algunas fotos de mi reciente viaje a Costa Rica.",
      left: [
        {
          title: "La evolución del diseño: UX y más",
          paras: [
            "Vengo de una época en la que el término UX o diseño de producto no existía; simplemente eras diseñador web o de apps. Afortunadamente, he sido testigo y parte de la evolución del diseño digital en México.",
            "La disciplina del diseño de experiencia, combinada con una metodología centrada en el usuario, me ha ayudado a entender mejor sus necesidades y alinearlas con los objetivos de negocio mediante soluciones tecnológicas viables.",
          ],
        },
        {
          title: "En momentos de descanso",
          paras: [
            "Cuando no estoy inmerso en el diseño, dedico mi tiempo a seguir aprendiendo sobre diseño y gestión de producto. Leo artículos de tecnología y disfruto mi tiempo libre con videojuegos, experimentos culinarios o armando sets de DJ para animar una buena fiesta.",
          ],
        },
      ],
      right: [
        {
          title: "Historia de una pasión: mi camino en el diseño",
          paras: [
            "Hablar de mí suele ser incómodo, pero en la preparatoria se reveló una fascinación oculta: el diseño. La informática despertó mi interés por herramientas digitales como Photoshop y Macromedia Flash, y con ello mis ganas de explorar más este campo.",
            "En septiembre de 2013 me gradué en Diseño Gráfico Digital. La oportunidad laboral llegó pronto y me llevó al mundo del diseño web. La modularidad, la adaptabilidad y la composición digital de páginas web se volvieron mis fascinaciones constantes.",
          ],
        },
        {
          title: "Una vida entre el diseño y la gestión",
          paras: [
            "A lo largo de mis 11 años de experiencia, pasé de ser director de un área de diseño a ser product manager, diseñando productos de otra manera. ¿Por qué no ambos?",
            "Aunque el rol del diseñador a veces se subestima, aplicar habilidades de gestión, análisis de datos y visión de producto (Design Ops) ha impactado positivamente cómo diseño experiencias y comunico resultados dentro de la organización, mejorando la satisfacción de los usuarios.",
          ],
        },
      ],
    },
    experienceTitle: "Experiencia",
    experience: [
      { role: "Product Design Manager", company: "Konfio", period: "Sep 2022 – Dic 2023" },
      { role: "Product Design Lead", company: "Konfio", period: "Feb 2021 – Ago 2022" },
      { role: "Design Director", company: "AgileThought (antes Anzen Digital)", period: "Mar 2020 – Feb 2021" },
      { role: "Product Design Lead", company: "Citibanamex Empresarial (por Anzen Digital)", period: "Abr 2018 – Mar 2020" },
      { role: "UX/UI Designer", company: "Citibanamex Personal (por Anzen Digital)", period: "Ene 2017 – Abr 2018" },
      { role: "UX/UI Designer", company: "Anzen Digital", period: "May 2014 – Dic 2016" },
    ],
    methodology: {
      title: "Metodología de trabajo",
      sub: "La experiencia en cada punto de contacto genera emociones.",
      center: "Diseño de producto",
      piece: { dataAnalysis: "Análisis de datos", approach: "HCD - Enfoque", framework: "Design Thinking - Marco", outer: "SD" },
      top: ["Gestión de producto", "Estrategia de Design Ops"],
      bottom: ["Análisis de datos", "Proceso de iteración"],
      steps: ["Empatizar", "Definir", "Idear", "Prototipar", "Probar"],
    },
    skillsTitle: "Habilidades",
    skillsSub:
      "Trabajo en distintas disciplinas, aportando habilidades diversas, aprendiendo conceptos nuevos de forma constante y manteniéndome al día con la industria tecnológica, los productos digitales y las metodologías de investigación y gestión.",
    skills: [
      ["Gestión de producto", "Gestión de proyectos con enfoque Agile/SCRUM, unificando ejecución y comunicación durante todo el ciclo de vida del producto y las áreas involucradas."],
      ["Estrategia de producto", "Ayudo a definir objetivos y acciones para el desarrollo y posicionamiento del producto en el mercado, enfocándome en las necesidades del usuario e implementando estrategias efectivas de marketing y comunicación."],
      ["Diseño de producto", "Ofrezco experiencias integrales y fluidas considerando necesidades del usuario, objetivos de negocio y restricciones tecnológicas en la planeación y la ejecución."],
      ["Design Systems", "Aplico mi experiencia para liderar el desarrollo de design systems eficientes que aseguran consistencia en los productos digitales con la metodología de diseño atómico."],
      ["Basado en datos", "Mi enfoque usa datos cualitativos y cuantitativos para tomar decisiones de diseño informadas y lograr resultados efectivos en cada etapa del proceso."],
      ["Estrategia UX", "Planeación estratégica con una metodología basada en principios de diseño universal para obtener datos cualitativos y cuantitativos de alto valor."],
      ["Diseño UI", "Diseño de interfaces atractivas y fáciles de usar siguiendo reglas fundamentales. Al adoptar estos principios, el producto va por buen camino hacia el éxito."],
      ["Diseño de interacción", "Diseño intuitivo de interacciones efectivas a la medida de las necesidades del usuario, contribuyendo a experiencias digitales memorables y centradas en las personas."],
      ["User Research", "Planeación de investigación con una metodología enfocada en hacer las preguntas correctas y recopilar retroalimentación de los usuarios, asegurando insights valiosos."],
    ].map(([title, text], i) => ({ icon: icons[i], title, text })),
  },
};
