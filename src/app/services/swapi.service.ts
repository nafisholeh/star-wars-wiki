import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PeopleResponse, Person, Film, Species, Starship, Vehicle } from '@models/swapi.types';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {

  private baseUrl: string = 'https://swapi.dev/api';

  constructor(private http: HttpClient) { }

  getPeople(page: number = 1): Observable<PeopleResponse> {
    return this.http.get<PeopleResponse>(`${this.baseUrl}/people/?page=${page}`);
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseUrl}/people/${id}`);
  }

  getFilm(id: number): Observable<Film> {
    return this.http.get<Film>(`${this.baseUrl}/films/${id}`);
  }

  getSpecies(id: number): Observable<Species> {
    return this.http.get<Species>(`${this.baseUrl}/species/${id}`);
  }

  getStarship(id: number): Observable<Starship> {
    return this.http.get<Starship>(`${this.baseUrl}/starships/${id}`);
  }

  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/vehicles/${id}`);
  }

  private extractId(url: string): number | null {
    try {
      const parts = url.split('/');
      const idPart = parts[parts.length - 2];
      const id = parseInt(idPart, 10);
  
      if (isNaN(id)) {
        console.error(`Invalid ID extracted from URL: ${url}`);
        return null;
      }
  
      return id;
    } catch (error) {
      console.error(`Error extracting ID from URL: ${url}`, error);
      return null;
    }
  }
}
