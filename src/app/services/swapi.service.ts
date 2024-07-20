import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  getPerson(id: number | null): Observable<Person> {
    return this.fetchData<Person>(`${this.baseUrl}/people`, id);
  }

  getFilm(id: number | null): Observable<Film> {
    return this.fetchData<Film>(`${this.baseUrl}/films`, id);
  }

  getSpecies(id: number | null): Observable<Species> {
    return this.fetchData<Species>(`${this.baseUrl}/species`, id);
  }

  getStarship(id: number | null): Observable<Starship> {
    return this.fetchData<Starship>(`${this.baseUrl}/starships`, id);
  }

  getVehicle(id: number | null): Observable<Vehicle> {
    return this.fetchData<Vehicle>(`${this.baseUrl}/vehicles`, id);
  }

  private fetchData<T>(url: string, id: number | null): Observable<T> {
    if (id === null) {
      return throwError(() => new Error('Invalid ID'));
    }
    return this.http.get<T>(`${url}/${id}`).pipe(
      catchError(error => throwError(() => new Error(`Failed to fetch ${url.split('/').pop()}`)))
    );
  }

  public extractId(url: string): number | null {
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
