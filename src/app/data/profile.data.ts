// Fuente: PROYECTOS PERSONALES/Edery_Abanto_Documentacion_Completa.md (actualizado 2026-09-21).
// Todo el contenido de la web sale de aquí: si cambia algo del CV, se edita solo este archivo.

export const PROFILE = {
  name: 'Edery Abanto',
  fullName: 'Edery Renzo Abanto Vicente',
  initials: 'EA',
  headline: 'Software Engineer · Full Stack · IA aplicada',
  location: 'Lima, Perú',
  modality: 'Remoto / Híbrido',
  status: 'Disponible para prácticas preprofesionales',
  email: 'ederyrav@gmail.com',
  phone: '+51 904 676 103',
  whatsapp: 'https://wa.me/51904676103',
  linkedin: 'https://www.linkedin.com/in/edery-renzo-abanto-vicente-3ba96a1aa',
  github: 'https://github.com/EderyRAV',
  cv: '/cv/Edery_Abanto_CV.pdf',
  summary:
    'Estudiante de último ciclo de Ingeniería de Software en la UPC. Desarrollo soluciones web y automatizaciones que resuelven procesos reales de negocio de punta a punta: desde el levantamiento del proceso hasta el despliegue en producción.',
  roles: ['que resuelve procesos reales.', 'potenciado con IA.', 'full stack, de punta a punta.', 'que automatiza lo repetitivo.', 'que la gente usa a diario.'],
  languages: [
    { name: 'Español', level: 'Nativo' },
    { name: 'Inglés', level: 'Intermedio (B1) · ICPNA' },
  ],
};

export const STATS = [
  { value: 3, suffix: '', label: 'empresas donde aporté' },
  { value: 4, suffix: '', label: 'módulos internos creados en Bienestar' },
  { value: 29, suffix: '', label: 'certificaciones' },
  { value: 10, suffix: '.º', label: 'ciclo en la UPC' },
];

export interface Capability {
  id: string;
  icon: string;
  title: string;
  pitch: string;
  tags: string[];
  proof: string;
  proofSource: string;
  size: 'lg' | 'md' | 'sm';
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'fullstack',
    icon: '⌘',
    title: 'Desarrollo Full Stack',
    pitch: 'Interfaces web claras conectadas a APIs REST y bases de datos, listas para usuarios no técnicos.',
    tags: ['React', 'Angular', 'TypeScript', 'Spring Boot', 'Flask', 'APIs REST'],
    proof: 'Ecosistema de apps internas con backend en Python, interfaz web y PostgreSQL desplegado en Railway.',
    proofSource: 'Bienestar · 2026',
    size: 'lg',
  },
  {
    id: 'auto',
    icon: '⟳',
    title: 'Automatización de procesos',
    pitch: 'Si una tarea se repite, la convierto en un flujo automático que reduce errores.',
    tags: ['Python', 'Playwright', 'Power Automate', 'VBA', 'Pandas'],
    proof: 'Extracción de datos con Python + Playwright y reportes diarios de cobranza automáticos.',
    proofSource: 'Bienestar · 2026',
    size: 'md',
  },
  {
    id: 'ia',
    icon: '✦',
    title: 'IA aplicada',
    pitch: 'Integro modelos y agentes de IA en flujos de trabajo reales, con criterio y verificación.',
    tags: ['Claude Code', 'Codex', 'APIs de IA', 'NLP / Chatbots', 'TensorFlow'],
    proof: '5 cursos de Machine Learning de Google Cloud y desarrollo diario con agentes de código.',
    proofSource: 'Formación + práctica',
    size: 'md',
  },
  {
    id: 'qa',
    icon: '✓',
    title: 'QA y testing',
    pitch: 'Pruebas funcionales y de APIs para que lo que se entrega funcione a la primera.',
    tags: ['Postman', 'Karate', 'Playwright', 'JUnit', 'Selenium'],
    proof: 'Validación de datos a gran escala con plazos operativos estrictos para el sector seguros.',
    proofSource: 'NTT DATA · 2022',
    size: 'sm',
  },
  {
    id: 'data',
    icon: '▦',
    title: 'Datos y reportes',
    pitch: 'Ordeno, consolido y convierto datos en reportes que ayudan a decidir.',
    tags: ['PostgreSQL', 'SQL', 'Excel avanzado', 'CSV', 'SharePoint'],
    proof: 'Plataforma para procesar, buscar y distribuir resultados de Microsoft Forms.',
    proofSource: 'Limtek · 2025',
    size: 'sm',
  },
  {
    id: 'cloud',
    icon: '☁',
    title: 'Cloud y soporte TI',
    pitch: 'Despliego, almaceno y mantengo: también resuelvo lo que pasa en la oficina.',
    tags: ['Railway', 'Cloudflare R2', 'Docker', 'Azure', 'AWS', 'Git'],
    proof: 'Documentos en Cloudflare R2, servicios en Railway y soporte TI presencial.',
    proofSource: 'Bienestar · 2026',
    size: 'md',
  },
];

export interface Job {
  company: string;
  companyShort: string;
  role: string;
  period: string;
  duration: string;
  place: string;
  current?: boolean;
  summary: string;
  bullets: string[];
  tags: string[];
  previousRole?: { role: string; period: string };
}

// Orden: del más reciente al más antiguo.
export const JOBS: Job[] = [
  {
    company: 'Bienestar Espacio Psicológico',
    companyShort: 'Bienestar',
    role: 'Desarrollador Fullstack Freelancer · Consultor TI',
    period: 'mar. 2026 – actualidad',
    duration: 'en la empresa desde feb. 2026',
    place: 'Miraflores, Lima · Remoto',
    current: true,
    summary:
      'Asumí las funciones de TI y automatización en una empresa de ~15 personas sin área de sistemas, y gestioné todo el ciclo de desarrollo de forma independiente.',
    bullets: [
      'Automaticé agenda, caja, facturación y comprobantes con aplicaciones internas propias.',
      'Construí una capa en Python + Playwright para la extracción inteligente de datos de plataformas externas.',
      'Desarrollé interfaces web y APIs REST, con reportes diarios de cobranza y alertas de disponibilidad para WhatsApp.',
      'Entregué un ejecutable (.exe) adaptado al negocio y di soporte TI: equipos, impresoras e incidencias.',
    ],
    tags: ['Python', 'Playwright', 'JavaScript', 'PostgreSQL', 'Railway', 'Cloudflare R2'],
    previousRole: { role: 'Asistente de Atención al Cliente y Soporte Tecnológico', period: 'feb. 2026 – mar. 2026' },
  },
  {
    company: 'Limtek',
    companyShort: 'Limtek',
    role: 'Practicante de Capacitación y Desarrollo (Desarrollador y Automatización)',
    period: 'sep. 2025 – ene. 2026',
    duration: '5 meses',
    place: 'Chorrillos, Lima',
    summary:
      'Diseñé y desarrollé aplicaciones para Windows con Python orientadas a reducir errores de digitación y aumentar la precisión operativa.',
    bullets: [
      'Desarrollé aplicaciones para producción que mejoraron la precisión operativa.',
      'Diseñé flujos de datos automatizados con Power Automate para reducir tareas manuales.',
      'Participé en la integración y migración de sistemas legados.',
      'Implementé soluciones conectadas a bases de datos relacionales con integridad de la información.',
    ],
    tags: ['Python', 'Flask', 'Power Automate', 'SharePoint', 'SQL'],
  },
  {
    company: 'NTT DATA Europe & Latam',
    companyShort: 'NTT DATA',
    role: 'Process Support',
    period: 'dic. 2022 – mar. 2023',
    duration: '4 meses',
    place: 'San Isidro, Lima · Cliente: Pacífico Seguros',
    summary: 'Análisis y control de facturas para Pacífico Seguros, con gestión de datos a gran escala y plazos estrictos.',
    bullets: [
      'Ejecuté procesos de análisis y control de datos para el sector seguros.',
      'Gestioné información a gran escala y aseguré el cumplimiento de plazos operativos.',
      'Automaticé tareas repetitivas con Excel avanzado, tablas dinámicas y macros VBA.',
    ],
    tags: ['Excel avanzado', 'VBA', 'JIRA', 'CSV'],
  },
];

export interface BienestarModule {
  id: 'sunat' | 'agendas' | 'finanzas' | 'informes';
  name: string;
  status: 'producción' | 'en desarrollo';
  desc: string;
}

export const BIENESTAR_MODULES: BienestarModule[] = [
  {
    id: 'sunat',
    name: 'BIENESTAR-SUNAT',
    status: 'producción',
    desc: 'Genera la factura o boleta en PDF a partir del DNI y el monto, lista para enviar al cliente.',
  },
  {
    id: 'agendas',
    name: 'BIENESTAR-AGENDAS',
    status: 'producción',
    desc: 'Consolida las agendas de los terapeutas, detecta pagos pendientes y arma mensajes listos para WhatsApp.',
  },
  {
    id: 'finanzas',
    name: 'BIENESTAR-FINANZAS',
    status: 'producción',
    desc: 'Analiza la caja y la clasifica por efectivo, tarjeta, transferencia y extornos, con consolidados por período.',
  },
  {
    id: 'informes',
    name: 'BIENESTAR-INFORMES',
    status: 'en desarrollo',
    desc: 'Plataforma para que los terapeutas registren evaluaciones y las conviertan en dashboards e informes exportables.',
  },
];

export interface Project {
  title: string;
  org: string;
  year: string;
  desc: string;
  bullets: string[];
  tags: string[];
  accent: string;
  emoji: string;
}

// Orden: del más reciente al más antiguo (el ecosistema Bienestar va destacado aparte).
export const PROJECTS: Project[] = [
  {
    title: 'Este portafolio',
    org: 'Proyecto personal',
    year: '2026',
    desc: 'CV web interactivo con personaje 2.5D, fotocheck 3D con físicas y motion design, construido con agentes de IA.',
    bullets: ['Angular 19 con signals', 'Animaciones con GSAP y scroll suave', 'Desarrollado con Claude Code'],
    tags: ['Angular', 'TypeScript', 'GSAP', 'Claude Code'],
    accent: 'var(--lime)',
    emoji: '🪪',
  },
  {
    title: 'Indicadores y gestión documental',
    org: 'Limtek',
    year: '2025',
    desc: 'Plataforma creada desde cero para procesar, buscar y distribuir los resultados de Microsoft Forms del área de capacitación.',
    bullets: [
      'Backend local con Python + Flask e interfaz HTML/JS',
      'Integración con SharePoint y Power Automate vía HTTP',
      'Herramientas extra reutilizando la misma arquitectura (Excel → PDF)',
    ],
    tags: ['Python', 'Flask', 'Power Automate', 'SharePoint', 'REST'],
    accent: 'var(--cyan)',
    emoji: '📊',
  },
  {
    title: 'Automatización de procesos operativos',
    org: 'NTT DATA · Pacífico Seguros',
    year: '2022',
    desc: 'Herramientas internas para transformar, consolidar y validar datos operativos, usando JIRA como fuente.',
    bullets: [
      'Macros VBA y tablas dinámicas para tareas repetitivas',
      'Validación y consolidación de archivos CSV',
      'Análisis del flujo de punta a punta para detectar lo automatizable',
    ],
    tags: ['Excel avanzado', 'VBA', 'JIRA', 'CSV'],
    accent: 'var(--orange)',
    emoji: '⚙️',
  },
  {
    title: 'FastGym',
    org: 'Proyecto académico · UPC',
    year: 'UPC',
    desc: 'App móvil de productos deportivos con recomendaciones y rutinas personalizadas según los datos del usuario.',
    bullets: ['Desarrollo móvil multiplataforma', 'Rutinas personalizadas', 'Recomendaciones de productos'],
    tags: ['Flutter', 'Dart'],
    accent: 'var(--violet)',
    emoji: '🏋️',
  },
];

export type StackCategory = 'Frontend' | 'Backend' | 'Datos' | 'Automatización' | 'QA' | 'Cloud' | 'IA' | 'Móvil';

export const STACK: { name: string; cat: StackCategory }[] = [
  { name: 'React', cat: 'Frontend' },
  { name: 'Angular', cat: 'Frontend' },
  { name: 'TypeScript', cat: 'Frontend' },
  { name: 'JavaScript', cat: 'Frontend' },
  { name: 'HTML5', cat: 'Frontend' },
  { name: 'CSS3', cat: 'Frontend' },
  { name: 'Python', cat: 'Backend' },
  { name: 'Java', cat: 'Backend' },
  { name: 'Spring Boot', cat: 'Backend' },
  { name: 'Node.js', cat: 'Backend' },
  { name: 'Flask', cat: 'Backend' },
  { name: 'APIs REST', cat: 'Backend' },
  { name: 'PostgreSQL', cat: 'Datos' },
  { name: 'MySQL', cat: 'Datos' },
  { name: 'SQL', cat: 'Datos' },
  { name: 'Excel avanzado', cat: 'Datos' },
  { name: 'Pandas', cat: 'Automatización' },
  { name: 'Playwright', cat: 'Automatización' },
  { name: 'Power Automate', cat: 'Automatización' },
  { name: 'VBA / Macros', cat: 'Automatización' },
  { name: 'openpyxl', cat: 'Automatización' },
  { name: 'Postman', cat: 'QA' },
  { name: 'Karate', cat: 'QA' },
  { name: 'JUnit', cat: 'QA' },
  { name: 'Selenium', cat: 'QA' },
  { name: 'Railway', cat: 'Cloud' },
  { name: 'Cloudflare R2', cat: 'Cloud' },
  { name: 'Docker', cat: 'Cloud' },
  { name: 'Azure', cat: 'Cloud' },
  { name: 'AWS', cat: 'Cloud' },
  { name: 'Git / GitHub', cat: 'Cloud' },
  { name: 'Claude Code', cat: 'IA' },
  { name: 'Codex', cat: 'IA' },
  { name: 'APIs de IA', cat: 'IA' },
  { name: 'TensorFlow', cat: 'IA' },
  { name: 'NLP / Chatbots', cat: 'IA' },
  { name: 'Flutter', cat: 'Móvil' },
  { name: 'Dart', cat: 'Móvil' },
];

export const METHODS = ['Scrum', 'Agile', 'Git Flow', 'Code Review', 'Clean Code', 'DDD', 'JIRA', 'Documentación técnica'];

export const EDUCATION = [
  {
    org: 'Universidad Peruana de Ciencias Aplicadas (UPC)',
    title: 'Ingeniería de Software',
    period: '2018 – 2026',
    detail: 'Último ciclo (décimo)',
    progress: 1,
  },
  {
    org: 'ICPNA',
    title: 'Inglés · Ciclo 11 Avanzado',
    period: '2020 – 2025',
    detail: 'Nivel intermedio (B1)',
    progress: 1,
  },
  {
    org: 'Benjamín Cordero',
    title: 'Curso Claude Code 2026',
    period: '2026',
    detail: 'Desarrollo con agentes de IA',
    progress: 1,
  },
];

export interface Cert {
  title: string;
  org: string;
  date: string;
  id: string;
  featured?: boolean;
}

export const CERTS: Cert[] = [
  { title: 'Arduino y algunas aplicaciones', org: 'UNAM', date: 'jun. 2024', id: '4NUPA7MY7PZM' },
  { title: 'Incident Response and Digital Forensics', org: 'IBM', date: 'jun. 2024', id: 'NVBDKHYCQHS2', featured: true },
  { title: 'An Introduction to Accessibility and Inclusive Design', org: 'U. Illinois', date: 'may. 2024', id: '9B38857XJRYT' },
  { title: 'Combining Scrum with Other Agile Methodologies', org: 'LearnQuest', date: 'may. 2024', id: 'MMAU8YV4FGKC' },
  { title: 'Computer Networks and Network Security', org: 'IBM', date: 'may. 2024', id: 'HS9MMBR8P8WH' },
  { title: 'Cybersecurity Assessment: CompTIA Security+ & CYSA+', org: 'IBM', date: 'may. 2024', id: 'VUYDYMBADGEM' },
  { title: 'Cybersecurity Compliance Framework, Standards & Regulations', org: 'IBM', date: 'may. 2024', id: 'V7HCRZ43859F', featured: true },
  { title: 'Introduction to Cybersecurity Tools & Cyberattacks', org: 'IBM', date: 'may. 2024', id: 'J9VLRV7DMM8W' },
  { title: 'Introduction to Scrum Master Training', org: 'LearnQuest', date: 'may. 2024', id: 'RW4XRTVGH8DY' },
  { title: 'Operating Systems: Overview, Administration, and Security', org: 'IBM', date: 'may. 2024', id: 'ZDP636T5BD9K', featured: true },
  { title: 'Penetration Testing, Threat Hunting, and Cryptography', org: 'IBM', date: 'may. 2024', id: '98ELK26DVLZD' },
  { title: 'Scrum Master Certification: Scaling Agile and the Team-of-Teams', org: 'LearnQuest', date: 'may. 2024', id: 'TMFPYLJ6HH6M' },
  { title: 'Scrum Master Certification: Scrum Methodologies', org: 'LearnQuest', date: 'may. 2024', id: '2F72H7UMFCUC' },
  { title: '¡A Programar! Una introducción a la programación', org: 'U. of Edinburgh', date: 'may. 2024', id: 'KNFNXYDHNHAT' },
  { title: '¿Cómo (nos) cambia la Tecnología?', org: 'U. de Chile', date: 'may. 2024', id: '4N46F5NR7G84', featured: true },
  { title: 'Aspectos básicos de la asistencia técnica', org: 'Crece con Google', date: 'oct. 2023', id: '5JBAFZGKTDCC' },
  { title: 'Los bits y bytes de las redes informáticas', org: 'Crece con Google', date: 'oct. 2023', id: '2GSVWR6GMJKB', featured: true },
  { title: 'Sistemas operativos y tú: Convertirse en un usuario avanzado', org: 'Crece con Google', date: 'oct. 2023', id: 'A4HHP9GQLGSB' },
  { title: 'Art and Science of Machine Learning', org: 'Google Cloud', date: 'may. 2023', id: 'TUPQ6PK3BJLE' },
  { title: 'Feature Engineering', org: 'Google Cloud', date: 'may. 2023', id: 'VMB285T5BMJF' },
  { title: 'How Google does Machine Learning', org: 'Google Cloud', date: 'may. 2023', id: 'X7R9EQWE75FD' },
  { title: 'Intro to TensorFlow', org: 'Google Cloud', date: 'may. 2023', id: 'PQ7VKFVU2ZW2' },
  { title: 'Launching into Machine Learning', org: 'Google Cloud', date: 'may. 2023', id: '2ZEWK5KYRUY3' },
  { title: 'Introduction to Programming with MATLAB', org: 'Vanderbilt', date: 'jun. 2022', id: 'KZDP7J4CMADP' },
  { title: 'Capstone: Retrieving, Processing, and Visualizing Data with Python', org: 'U. Michigan', date: 'nov. 2021', id: 'PNAE4MEE92T3' },
  { title: 'Using Databases with Python', org: 'U. Michigan', date: 'nov. 2021', id: 'FUPJSAXLR9FB' },
  { title: 'Using Python to Access Web Data', org: 'U. Michigan', date: 'oct. 2021', id: '9KX6LQSPNYMT' },
  { title: 'Python Data Structures', org: 'U. Michigan', date: 'sept. 2021', id: '69GTUL9UVVSB' },
  { title: 'Programming for Everybody (Getting Started with Python)', org: 'U. Michigan', date: 'ago. 2021', id: '8BQV924CKDJ3' },
];

export const SECTIONS = [
  { id: 'inicio', label: 'Inicio', icon: '⌂' },
  { id: 'fotocheck', label: 'Fotocheck', icon: '🪪' },
  { id: 'servicios', label: 'Qué hago', icon: '⌘' },
  { id: 'ia', label: 'IA', icon: '✦' },
  { id: 'experiencia', label: 'Experiencia', icon: '◷' },
  { id: 'proyectos', label: 'Proyectos', icon: '▣' },
  { id: 'stack', label: 'Stack', icon: '≡' },
  { id: 'formacion', label: 'Formación', icon: '◎' },
  { id: 'contacto', label: 'Contacto', icon: '✉' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];
