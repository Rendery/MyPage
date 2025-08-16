import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderProfileComponent } from './components/header-profile/header-profile.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { SkillsComponent } from './components/skills/skills.component';
import { EducationComponent } from './components/education/education.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ToolsComponent } from './components/tools/tools.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderProfileComponent,
    ExperienceComponent,
    SkillsComponent,
    EducationComponent,
    ToolsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Edery CV';
}
