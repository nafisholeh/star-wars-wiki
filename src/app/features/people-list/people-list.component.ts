import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwapiService } from '@app/services/swapi.service';
import { PeopleResponse, Person } from '@models/swapi.types';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './people-list.component.html',
})
export class PeopleListComponent implements OnInit {

  people: Person[] = [];
  next: string | null = null;
  previous: string | null = null;
  page: number = 1;

  constructor(private swapiService: SwapiService) { }

  ngOnInit(): void {
    this.fetchPeople();
  }

  fetchPeople(): void {
    this.swapiService.getPeople(this.page).subscribe((data: PeopleResponse) => {
      this.people = data.results;
      this.next = data.next;
      this.previous = data.previous;
    })
  }

  nextPage(): void {
    if (this.next) {
      this.page++;
      this.fetchPeople();
    }
  }

  previousPage(): void {
    if (this.previous) {
      this.page--;
      this.fetchPeople();
    }
  }
}
