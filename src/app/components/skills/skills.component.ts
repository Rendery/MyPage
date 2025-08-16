import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
  technical = [
    'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3',
    'Node.js', 'Express.js', 'React', 'Next.js',
    'SQL', 'Firebase',
    'Git & GitHub', 'REST APIs', 'IoT Development',
    'Cloud Basics (AWS, GCP)', 'Scrum & Agile'
  ];

  soft = [
    'Liderazgo en proyectos',
    'Comunicación efectiva',
    'Resolución de problemas',
    'Trabajo en equipo',
    'Adaptabilidad',
    'Gestión del tiempo',
    'Pensamiento crítico',
    'Proactividad'
  ];
}
