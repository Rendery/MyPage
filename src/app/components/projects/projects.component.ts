import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects = [
    {
      title: 'Powerful Design System',
      desc: 'Figma UI Kit and Design System targeting a wide variety of use cases.',
      link: 'https://figma.com',
      icon: '🎨'
    },
    {
      title: 'Modern Dashboard',
      desc: 'Powerful website + dashboard template for your next Angular project.',
      link: 'https://ui-8.net',
      icon: '🚀'
    }
  ];
}