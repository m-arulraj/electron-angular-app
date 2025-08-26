import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrewService } from './crew.service';
import { Crew } from './model/Crew';
import { Project } from './model/Project';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-crew',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './crew.component.html',
  styleUrls: ['./crew.component.css'],
  providers: [CrewService]
})
export class CrewComponent implements OnInit {
  crews: Crew[] = [];
  selectedCrew: Crew | null = null;
  projects: Project[] = [];
  selectedComponents: { [key: string]: boolean } = {};
  selectedCrewName: string = '';
  constructor(private crewService: CrewService) { }

  ngOnInit(): void {
    this.fetchCrewData();
  }

  fetchCrewData(): void {
    this.crewService.getCrewData().subscribe(data => {
      this.crews = data.crew;
    });
  }

  onCrewSelect(crew: any): void {
    this.selectedCrew = crew;
    this.projects = crew.project;
    this.selectedComponents = {};

    this.projects.forEach(project => {
      project.components.forEach(component => {
        this.selectedComponents[component] = false;
      });
    });
  }


  // Add this method inside your CrewComponent class
  getCrewByName(name: string) {
    return this.crews.find(crew => crew.name === name);
  }

 
}