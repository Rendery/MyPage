import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderProfileComponent } from './components/header-profile/header-profile.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { SkillsComponent } from './components/skills/skills.component';
import { EducationComponent } from './components/education/education.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ToolsComponent } from './components/tools/tools.component';

export type Theme = 'dark' | 'light' | 'rainbow';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderProfileComponent,
    ExperienceComponent,
    SkillsComponent,
    EducationComponent,
    ProjectsComponent,
    ToolsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Edery CV';
  currentTheme: Theme = 'dark';
  mouseX = 0;
  mouseY = 0;

  ngOnInit() {
    this.injectFonts();
  }

  setTheme(theme: Theme) {
    this.currentTheme = theme;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  private injectFonts() {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
}