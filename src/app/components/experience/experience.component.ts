import { Component } from '@angular/core';

interface Job {
  company: string;
  role: string;
  logo: string;
  from: string;
  to?: string;
  cycle: string;
  course: string;
  description: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  jobs: Job[] = [
    {
      company: 'UPC',
      role: 'Líder de Proyecto – Transformación Digital',
      logo: '/images/upc.png',
      from: 'Mar 2025',
      to: 'Jul 2025',
      cycle: '8vo ciclo',
      course: 'Gerencia de proyectos en computación',
      description: 'Como líder de proyecto, gestioné un equipo multidisciplinario para implementar un sistema de gestión académica digital con metodologías ágiles (Scrum). Logramos entregar un MVP funcional en tiempo récord a pesar de cambios de alcance constantes.',
      expanded: false
    },
    {
      company: 'UPC',
      role: 'Arquitecto de Software – Plataforma Escalable',
      logo: '/images/upc.png',
      from: 'Mar 2025',
      to: 'Jul 2025',
      cycle: '8vo ciclo',
      course: 'Fundamentos de arquitectura de software',
      description: 'Diseñé la arquitectura de un sistema financiero simulado utilizando microservicios y contenedores Docker. Lideré la toma de decisiones sobre patrones de diseño y logré que el sistema soportara pruebas de alta concurrencia sin caídas.',
      expanded: false
    },
    {
      company: 'UPC',
      role: 'Investigador – Ingeniería de Software Empírica',
      logo: '/images/upc.png',
      from: 'Aug 2024',
      to: 'Dec 2024',
      cycle: '8vo ciclo',
      course: 'Diseño de experimentos de ingeniería de software',
      description: 'Conduje un experimento controlado para evaluar la productividad de equipos utilizando pair programming vs. trabajo individual. Presenté los resultados en un congreso estudiantil y fui reconocido por el rigor metodológico.',
      expanded: false
    },
    {
      company: 'UPC',
      role: 'Líder Financiero – Proyecto de Evaluación Económica',
      logo: '/images/upc.png',
      from: 'Mar 2024',
      to: 'Jul 2024',
      cycle: '7mo ciclo',
      course: 'Finanzas e ingeniería económica',
      description: 'Encabecé el análisis financiero de un sistema de transporte inteligente. Modelé proyecciones de ROI y análisis de riesgo con escenarios inflacionarios, mostrando viabilidad de inversión a largo plazo.',
      expanded: false
    },
    {
      company: 'UPC',
      role: 'Team Leader – IoT Smart Campus',
      logo: '/images/upc.png',
      from: 'Mar 2024',
      to: 'Jul 2024',
      cycle: '7mo ciclo',
      course: 'Desarrollo de soluciones IoT',
      description: 'Coordiné el desarrollo de una solución IoT para monitoreo ambiental en aulas universitarias (temperatura, CO₂). Implementamos dashboards en tiempo real y optimizamos la comunicación entre dispositivos usando MQTT.',
      expanded: false
    },
    {
      company: 'UPC',
      role: 'Full-stack Developer – App de Delivery Universitario',
      logo: '/images/upc.png',
      from: 'Mar 2024',
      to: 'Jul 2024',
      cycle: '7mo ciclo',
      course: 'Aplicaciones para dispositivos móviles',
      description: 'Diseñé y desarrollé una aplicación móvil híbrida (Ionic + Angular) para pedidos dentro del campus. Superamos el reto de la geolocalización en interiores e implementamos notificaciones push en tiempo real.',
      expanded: false
    },
    {
      company: 'UPC',
      role: 'Network Engineer – Simulación de Infraestructura',
      logo: '/images/upc.png',
      from: 'Aug 2023',
      to: 'Dec 2023',
      cycle: '6to ciclo',
      course: 'Redes y comunicaciones de datos',
      description: 'Lideré la configuración de una red simulada con protocolos de enrutamiento dinámico (OSPF y BGP). Logré que el diseño soportara tolerancia a fallos y demostré un 99.9% de disponibilidad en pruebas de estrés.',
      expanded: false
    }
  ];

  toggleExpand(job: Job) {
    job.expanded = !job.expanded;
  }
}
