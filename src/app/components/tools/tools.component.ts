import { Component } from '@angular/core';
@Component({
  selector:'app-tools',
  standalone: true,
  templateUrl:'./tools.component.html',
  styleUrls:['./tools.component.scss']
})
export class ToolsComponent {
  tools = ['Figma','Maze','Spline','Zeplin'];
}
