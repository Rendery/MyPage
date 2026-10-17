// Fuente: PROYECTOS PERSONALES/Edery_Abanto_Documentacion_Completa.md (actualizado 2026-09-21).
// Aquí van los datos que no cambian con el idioma (enlaces, tecnologías, fechas, ids).
// Los textos de cada idioma están en src/app/i18n/ (es.ts, en.ts, pt.ts), con las mismas claves.

export const PROFILE = {
  name: 'Edery Abanto',
  fullName: 'Edery Renzo Abanto Vicente',
  initials: 'EA',
  email: 'ederyrav@gmail.com',
  phone: '+51 904 676 103',
  whatsapp: 'https://wa.me/51904676103',
  linkedin: 'https://www.linkedin.com/in/edery-renzo-abanto-vicente-3ba96a1aa',
  github: 'https://github.com/EderyRAV',
  cv: '/cv/Edery_Abanto_CV.pdf',
};

/** Valores de las cifras del hero (sus textos están en i18n → stats, en el mismo orden). */
export const STATS = [{ value: 3 }, { value: 4 }, { value: 29 }, { value: 10 }];

export type CapabilityId = 'fullstack' | 'auto' | 'ia' | 'qa' | 'data' | 'cloud';

export const CAPABILITIES: { id: CapabilityId; icon: string; size: 'lg' | 'md' | 'sm'; tags: string[] }[] = [
  { id: 'fullstack', icon: '⌘', size: 'lg', tags: ['React', 'Angular', 'TypeScript', 'Spring Boot', 'Flask', 'APIs REST'] },
  { id: 'auto', icon: '⟳', size: 'md', tags: ['Python', 'Playwright', 'Power Automate', 'VBA', 'Pandas'] },
  { id: 'ia', icon: '✦', size: 'md', tags: ['Claude Code', 'Codex', 'APIs de IA', 'NLP / Chatbots', 'TensorFlow'] },
  { id: 'qa', icon: '✓', size: 'sm', tags: ['Postman', 'Karate', 'Playwright', 'JUnit', 'Selenium'] },
  { id: 'data', icon: '▦', size: 'sm', tags: ['PostgreSQL', 'SQL', 'Excel avanzado', 'CSV', 'SharePoint'] },
  { id: 'cloud', icon: '☁', size: 'md', tags: ['Railway', 'Cloudflare R2', 'Docker', 'Azure', 'AWS', 'Git'] },
];

export type JobId = 'bienestar' | 'limtek' | 'nttdata';

// Orden: del más reciente al más antiguo.
export const JOBS: { id: JobId; company: string; companyShort: string; current?: boolean; tags: string[] }[] = [
  {
    id: 'bienestar',
    company: 'Bienestar Espacio Psicológico',
    companyShort: 'Bienestar',
    current: true,
    tags: ['Python', 'Playwright', 'JavaScript', 'PostgreSQL', 'Railway', 'Cloudflare R2'],
  },
  { id: 'limtek', company: 'Limtek', companyShort: 'Limtek', tags: ['Python', 'Flask', 'Power Automate', 'SharePoint', 'SQL'] },
  { id: 'nttdata', company: 'NTT DATA Europe & Latam', companyShort: 'NTT DATA', tags: ['Excel avanzado', 'VBA', 'JIRA', 'CSV'] },
];

export type ModuleId = 'sunat' | 'agendas' | 'finanzas' | 'informes';

export const BIENESTAR_MODULES: { id: ModuleId; name: string; inProduction: boolean }[] = [
  { id: 'sunat', name: 'BIENESTAR-SUNAT', inProduction: true },
  { id: 'agendas', name: 'BIENESTAR-AGENDAS', inProduction: true },
  { id: 'finanzas', name: 'BIENESTAR-FINANZAS', inProduction: true },
  { id: 'informes', name: 'BIENESTAR-INFORMES', inProduction: false },
];

export type ProjectId = 'portfolio' | 'limtek' | 'nttdata' | 'fastgym';

// Orden: del más reciente al más antiguo (el ecosistema Bienestar va destacado aparte).
export const PROJECTS: { id: ProjectId; year: string; tags: string[]; accent: string; emoji: string }[] = [
  { id: 'portfolio', year: '2026', tags: ['Angular', 'TypeScript', 'GSAP', 'Claude Code'], accent: 'var(--lime)', emoji: '🪪' },
  { id: 'limtek', year: '2025', tags: ['Python', 'Flask', 'Power Automate', 'SharePoint', 'REST'], accent: 'var(--cyan)', emoji: '📊' },
  { id: 'nttdata', year: '2022', tags: ['Excel avanzado', 'VBA', 'JIRA', 'CSV'], accent: 'var(--orange)', emoji: '⚙️' },
  { id: 'fastgym', year: 'UPC', tags: ['Flutter', 'Dart'], accent: 'var(--violet)', emoji: '🏋️' },
];

export type StackCategory = 'frontend' | 'backend' | 'data' | 'automation' | 'qa' | 'cloud' | 'ai' | 'mobile';

export const STACK: { name: string; cat: StackCategory }[] = [
  { name: 'React', cat: 'frontend' },
  { name: 'Angular', cat: 'frontend' },
  { name: 'TypeScript', cat: 'frontend' },
  { name: 'JavaScript', cat: 'frontend' },
  { name: 'HTML5', cat: 'frontend' },
  { name: 'CSS3', cat: 'frontend' },
  { name: 'Python', cat: 'backend' },
  { name: 'Java', cat: 'backend' },
  { name: 'Spring Boot', cat: 'backend' },
  { name: 'Node.js', cat: 'backend' },
  { name: 'Flask', cat: 'backend' },
  { name: 'APIs REST', cat: 'backend' },
  { name: 'PostgreSQL', cat: 'data' },
  { name: 'MySQL', cat: 'data' },
  { name: 'SQL', cat: 'data' },
  { name: 'Excel avanzado', cat: 'data' },
  { name: 'Pandas', cat: 'automation' },
  { name: 'Playwright', cat: 'automation' },
  { name: 'Power Automate', cat: 'automation' },
  { name: 'VBA / Macros', cat: 'automation' },
  { name: 'openpyxl', cat: 'automation' },
  { name: 'Postman', cat: 'qa' },
  { name: 'Karate', cat: 'qa' },
  { name: 'JUnit', cat: 'qa' },
  { name: 'Selenium', cat: 'qa' },
  { name: 'Railway', cat: 'cloud' },
  { name: 'Cloudflare R2', cat: 'cloud' },
  { name: 'Docker', cat: 'cloud' },
  { name: 'Azure', cat: 'cloud' },
  { name: 'AWS', cat: 'cloud' },
  { name: 'Git / GitHub', cat: 'cloud' },
  { name: 'Claude Code', cat: 'ai' },
  { name: 'Codex', cat: 'ai' },
  { name: 'APIs de IA', cat: 'ai' },
  { name: 'TensorFlow', cat: 'ai' },
  { name: 'NLP / Chatbots', cat: 'ai' },
  { name: 'Flutter', cat: 'mobile' },
  { name: 'Dart', cat: 'mobile' },
];

export interface Cert {
  title: string;
  org: string;
  /** Año y mes (AAAA-MM); se muestra en el formato de cada idioma. */
  date: string;
  id: string;
}

// Los títulos son los nombres oficiales de cada curso, por eso no se traducen.
export const CERTS: Cert[] = [
  { title: 'Arduino y algunas aplicaciones', org: 'UNAM', date: '2024-06', id: '4NUPA7MY7PZM' },
  { title: 'Incident Response and Digital Forensics', org: 'IBM', date: '2024-06', id: 'NVBDKHYCQHS2' },
  { title: 'An Introduction to Accessibility and Inclusive Design', org: 'U. Illinois', date: '2024-05', id: '9B38857XJRYT' },
  { title: 'Combining Scrum with Other Agile Methodologies', org: 'LearnQuest', date: '2024-05', id: 'MMAU8YV4FGKC' },
  { title: 'Computer Networks and Network Security', org: 'IBM', date: '2024-05', id: 'HS9MMBR8P8WH' },
  { title: 'Cybersecurity Assessment: CompTIA Security+ & CYSA+', org: 'IBM', date: '2024-05', id: 'VUYDYMBADGEM' },
  { title: 'Cybersecurity Compliance Framework, Standards & Regulations', org: 'IBM', date: '2024-05', id: 'V7HCRZ43859F' },
  { title: 'Introduction to Cybersecurity Tools & Cyberattacks', org: 'IBM', date: '2024-05', id: 'J9VLRV7DMM8W' },
  { title: 'Introduction to Scrum Master Training', org: 'LearnQuest', date: '2024-05', id: 'RW4XRTVGH8DY' },
  { title: 'Operating Systems: Overview, Administration, and Security', org: 'IBM', date: '2024-05', id: 'ZDP636T5BD9K' },
  { title: 'Penetration Testing, Threat Hunting, and Cryptography', org: 'IBM', date: '2024-05', id: '98ELK26DVLZD' },
  { title: 'Scrum Master Certification: Scaling Agile and the Team-of-Teams', org: 'LearnQuest', date: '2024-05', id: 'TMFPYLJ6HH6M' },
  { title: 'Scrum Master Certification: Scrum Methodologies', org: 'LearnQuest', date: '2024-05', id: '2F72H7UMFCUC' },
  { title: '¡A Programar! Una introducción a la programación', org: 'U. of Edinburgh', date: '2024-05', id: 'KNFNXYDHNHAT' },
  { title: '¿Cómo (nos) cambia la Tecnología?', org: 'U. de Chile', date: '2024-05', id: '4N46F5NR7G84' },
  { title: 'Aspectos básicos de la asistencia técnica', org: 'Crece con Google', date: '2023-10', id: '5JBAFZGKTDCC' },
  { title: 'Los bits y bytes de las redes informáticas', org: 'Crece con Google', date: '2023-10', id: '2GSVWR6GMJKB' },
  { title: 'Sistemas operativos y tú: Convertirse en un usuario avanzado', org: 'Crece con Google', date: '2023-10', id: 'A4HHP9GQLGSB' },
  { title: 'Art and Science of Machine Learning', org: 'Google Cloud', date: '2023-05', id: 'TUPQ6PK3BJLE' },
  { title: 'Feature Engineering', org: 'Google Cloud', date: '2023-05', id: 'VMB285T5BMJF' },
  { title: 'How Google does Machine Learning', org: 'Google Cloud', date: '2023-05', id: 'X7R9EQWE75FD' },
  { title: 'Intro to TensorFlow', org: 'Google Cloud', date: '2023-05', id: 'PQ7VKFVU2ZW2' },
  { title: 'Launching into Machine Learning', org: 'Google Cloud', date: '2023-05', id: '2ZEWK5KYRUY3' },
  { title: 'Introduction to Programming with MATLAB', org: 'Vanderbilt', date: '2022-06', id: 'KZDP7J4CMADP' },
  { title: 'Capstone: Retrieving, Processing, and Visualizing Data with Python', org: 'U. Michigan', date: '2021-11', id: 'PNAE4MEE92T3' },
  { title: 'Using Databases with Python', org: 'U. Michigan', date: '2021-11', id: 'FUPJSAXLR9FB' },
  { title: 'Using Python to Access Web Data', org: 'U. Michigan', date: '2021-10', id: '9KX6LQSPNYMT' },
  { title: 'Python Data Structures', org: 'U. Michigan', date: '2021-09', id: '69GTUL9UVVSB' },
  { title: 'Programming for Everybody (Getting Started with Python)', org: 'U. Michigan', date: '2021-08', id: '8BQV924CKDJ3' },
];

export const SECTIONS = [
  { id: 'inicio', icon: '⌂' },
  { id: 'fotocheck', icon: '🪪' },
  { id: 'servicios', icon: '⌘' },
  { id: 'ia', icon: '✦' },
  { id: 'experiencia', icon: '◷' },
  { id: 'proyectos', icon: '▣' },
  { id: 'stack', icon: '≡' },
  { id: 'formacion', icon: '◎' },
  { id: 'contacto', icon: '✉' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];
