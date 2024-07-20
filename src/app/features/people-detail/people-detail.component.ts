import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Person, Film, Species, Starship, Vehicle } from '@app/types/swapi.types';
import { SwapiService } from '@services/swapi.service';

@Component({
  selector: 'app-people-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './people-detail.component.html',
  styleUrl: './people-detail.component.scss'
})
export class PeopleDetailComponent {
  person: Person | null = null;
  films: Film[] = [];
  species: Species[] = [];
  starships: Starship[] = [];
  vehicles: Vehicle[] = [];

  constructor(
    private route: ActivatedRoute,
    private swapiService: SwapiService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.swapiService.getPerson(id).subscribe((data: Person) => {
      this.person = data;
      this.fetchDetails(data);
    });
  }

  fetchDetails(data: Person): void {
    const filmObservables = data.films.map((url: string) => this.swapiService.getFilm(this.swapiService.extractId(url)));
    const speciesObservables = data.species.map((url: string) => this.swapiService.getSpecies(this.swapiService.extractId(url)));
    const starshipObservables = data.starships.map((url: string) => this.swapiService.getStarship(this.swapiService.extractId(url)));
    const vehicleObservables = data.vehicles.map((url: string) => this.swapiService.getVehicle(this.swapiService.extractId(url)));

    forkJoin(filmObservables).subscribe((films: Film[]) => this.films = films);
    forkJoin(speciesObservables).subscribe((species: Species[]) => this.species = species);
    forkJoin(starshipObservables).subscribe((starships: Starship[]) => this.starships = starships);
    forkJoin(vehicleObservables).subscribe((vehicles: Vehicle[]) => this.vehicles = vehicles);
  }

}
