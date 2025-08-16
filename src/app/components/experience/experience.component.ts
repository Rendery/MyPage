import { Component } from '@angular/core';
interface Job { company:string; role:string; logo:string; from:string; to?:string; location?:string }
@Component({
  selector:'app-experience',
  standalone: true,
  templateUrl:'./experience.component.html',
  styleUrls:['./experience.component.scss']
})
export class ExperienceComponent {
  jobs: Job[] = [
    { company: 'UPC', role:'Team Leader and Backend Developer', logo:'/images/upc.png', from:'Aug 2022', to:'Dic 2022', location:'Lima, Peru' }
  ];
}
