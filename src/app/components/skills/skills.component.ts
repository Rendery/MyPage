import { Component } from '@angular/core';
@Component({
  selector:'app-skills',
  standalone: true,
  templateUrl:'./skills.component.html',
  styleUrls:['./skills.component.scss']
})
export class SkillsComponent {
  design = ['Web Design','Mobile Design','User Experience','Wireframing','Prototyping','Design System'];
  dev = ['React JS','Chakra UI','Framer','Typescript','Next JS','HTML','CSS','JS'];
}
