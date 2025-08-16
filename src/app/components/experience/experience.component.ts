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
      role: 'Hackathon Winner – Smart City App',
      logo: '/images/upc.png',
      from: 'Mar 2023',
      to: 'Jul 2023',
      cycle: '5to ciclo',
      course: 'Ingeniería de Software I',
      description: 'Lideré un equipo en un hackathon universitario desarrollando una aplicación IoT para gestión inteligente de residuos urbanos. Ganamos el 1er puesto entre 50 equipos.',
      expanded: false
    },
    {
      company: 'UPC',
      role: 'Research Assistant – AI & Data Mining',
      logo: '/images/upc.png',
      from: 'Aug 2023',
      to: 'Dec 2023',
      cycle: '6to ciclo',
      course: 'Minería de Datos',
      description: 'Participé en un proyecto de investigación aplicando modelos de Machine Learning para predecir deserción estudiantil. Publicación aceptada en congreso estudiantil de la IEEE.',
      expanded: false
    },
    {
      company: 'UPC',
      role: 'Team Leader – E-commerce Project',
      logo: '/images/upc.png',
      from: 'Mar 2024',
      to: 'Jul 2024',
      cycle: '7mo ciclo',
      course: 'Arquitectura de Software',
      description: 'Dirigí el desarrollo de una plataforma de e-commerce con arquitectura basada en microservicios. Implementación de pagos con Stripe y despliegue en AWS.',
      expanded: false
    },
    {
      company: 'UPC',
      role: 'Full-stack Developer – Internship',
      logo: '/images/upc.png',
      from: 'Aug 2024',
      to: 'Dec 2024',
      cycle: '7mo ciclo',
      course: 'Prácticas Preprofesionales',
      description: 'Trabajé en una startup desarrollando un sistema de reservas para restaurantes usando Angular y NestJS. Aprendí sobre integración continua y DevOps.',
      expanded: false
    },
    {
      company: 'UPC',
      role: 'Capstone Project – Fintech Platform',
      logo: '/images/upc.png',
      from: 'Mar 2025',
      to: 'Jul 2025',
      cycle: '8vo ciclo',
      course: 'Proyecto de Fin de Carrera',
      description: 'Lideré un equipo de 4 personas en el desarrollo de una plataforma fintech para microcréditos con autenticación biométrica. Proyecto destacado por la facultad.',
      expanded: false
    }
  ];

  toggleExpand(job: Job) {
    job.expanded = !job.expanded;
  }
}
