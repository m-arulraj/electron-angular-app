import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Crew {
  id: number;
  name: string;
  projects: { name: string; modules: string[] }[];
}

export interface FieldGroup {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

export interface SelectedProject {
  projectName: string;
  modules: string[];
}

export interface CrewProjectSelectionModel {
  crewId: number | null;
  selectedProjects: SelectedProject[];
  fileType: string;
  fieldGroups: FieldGroup[];
  sourceBranch: string;
  featureBranch: string;
  checkOutPath: string;
  jiraId: string;
  commitMessage: string;
  createPr: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CrewService {
  private baseUrl = 'https://your-api-endpoint.com'; // 🔁 Replace with actual backend URL

  constructor(private http: HttpClient) {}

  getCrews(): Observable<Crew[]> {
    return this.http.get<Crew[]>('/assets/crew.json');
  }

  submitCrewSelection(data: CrewProjectSelectionModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/submit`, data);
  }
}
