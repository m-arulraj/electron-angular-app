import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CrewService {
  constructor(private http: HttpClient) {}

  getCrewData(): Observable<any> {
    return this.http.get('/assets/crew.json');
  }
}