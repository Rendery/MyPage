import { Component } from '@angular/core';

@Component({
  selector: 'app-tools',
  standalone: true,
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent {
  tools = [
    { name: 'Figma', icon: '🎨' },
    { name: 'Maze', icon: '🧩' },
    { name: 'Spline', icon: '🧊' },
    { name: 'Zeplin', icon: '📐' },
    { name: 'Docker', icon: '🐳' },
    { name: 'Postman', icon: '🚀' }
  ];
}