import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleListComponent } from './people-list.component';
import { SwapiService } from '@app/services/swapi.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { PeopleResponse } from '@models/swapi.types';

const mockSwapiService = {
  getPeople: jasmine.createSpy('getPeople').and.returnValue(of({
    count: 2,
    next: 'https://swapi.dev/api/people/?page=2',
    previous: null,
    results: [
      { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
      { name: 'C-3PO', url: 'https://swapi.dev/api/people/2/' }
    ]
  } as PeopleResponse))
};

describe('PeopleListComponent', () => {
  let component: PeopleListComponent;
  let fixture: ComponentFixture<PeopleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, PeopleListComponent],  // Move PeopleListComponent to imports
      providers: [
        { provide: SwapiService, useValue: mockSwapiService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display people', () => {
    expect(component.people.length).toBe(2);
    expect(component.people[0].name).toBe('Luke Skywalker');
    expect(component.people[1].name).toBe('C-3PO');

    const compiled = fixture.nativeElement as HTMLElement;
    const peopleListItems = compiled.querySelectorAll('li');
    expect(peopleListItems.length).toBe(2);
    expect(peopleListItems[0].textContent).toContain('Luke Skywalker');
    expect(peopleListItems[1].textContent).toContain('C-3PO');
  });

  it('should enable next button and disable previous button on first page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const previousButton = compiled.querySelector('button[disabled]');
    const nextButton = compiled.querySelector('button:not([disabled])');

    expect(previousButton).toBeTruthy();
    expect(nextButton).toBeTruthy();
    expect(previousButton?.textContent).toContain('Previous');
    expect(nextButton?.textContent).toContain('Next');
  });

  it('should disable next button and enable previous button on last page', () => {
    component.page = 5; // Simulate being on the last page
    component.next = null; // No next page available
    component.previous = 'https://swapi.dev/api/people/?page=4';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const previousButton = compiled.querySelector('button:not([disabled])');
    const nextButton = compiled.querySelector('button[disabled]');

    expect(previousButton).toBeTruthy();
    expect(nextButton).toBeTruthy();
    expect(previousButton?.textContent).toContain('Previous');
    expect(nextButton?.textContent).toContain('Next');
  });

  it('should navigate to next page when next button is clicked', () => {
    spyOn(component, 'fetchPeople');
    component.nextPage();
    expect(component.page).toBe(2);
    expect(component.fetchPeople).toHaveBeenCalled();
  });

  it('should navigate to previous page when previous button is clicked', () => {
    component.page = 2; // Simulate being on the second page
    component.previous = 'https://swapi.dev/api/people/?page=1';
    fixture.detectChanges();

    spyOn(component, 'fetchPeople');
    component.previousPage();
    expect(component.page).toBe(1);
    expect(component.fetchPeople).toHaveBeenCalled();
  });
});
