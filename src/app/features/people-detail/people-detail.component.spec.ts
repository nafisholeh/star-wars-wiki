import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleDetailComponent } from './people-detail.component';
import { SwapiService } from '@services/swapi.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Person } from '@app/types/swapi.types';

const mockSwapiService = {
  getPerson: jasmine.createSpy('getPerson').and.returnValue(of({
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    films: ['https://swapi.dev/api/films/1/'],
    species: ['https://swapi.dev/api/species/1/'],
    starships: ['https://swapi.dev/api/starships/1/'],
    vehicles: ['https://swapi.dev/api/vehicles/1/'],
    url: 'https://swapi.dev/api/people/1/'
  })),
  getFilm: jasmine.createSpy('getFilm').and.returnValue(of({ title: 'A New Hope' })),
  getSpecies: jasmine.createSpy('getSpecies').and.returnValue(of({ name: 'Human' })),
  getStarship: jasmine.createSpy('getStarship').and.returnValue(of({ name: 'X-wing' })),
  getVehicle: jasmine.createSpy('getVehicle').and.returnValue(of({ name: 'Snowspeeder' })),
  extractId: jasmine.createSpy('extractId').and.callFake((url: string) => url.split('/').reverse()[1])
};

describe('PeopleDetailComponent', () => {
  let component: PeopleDetailComponent;
  let fixture: ComponentFixture<PeopleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, PeopleDetailComponent],  // Add PeopleDetailComponent to imports
      providers: [
        { provide: SwapiService, useValue: mockSwapiService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jasmine.createSpy('get').and.returnValue('1')
              }
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct person data', () => {
    expect(component.person).toEqual(jasmine.objectContaining({
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male'
    }));
  });

  it('should render the person name in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="person-name"]')?.textContent).toContain('Luke Skywalker');
  });

  it('should display "" if birthday is "n/a"', () => {
    component.person = { ...component.person, birth_year: 'n/a'} as Person;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="person-birth-year"')?.textContent).toContain('');
  });

  it('should display "" if birthday is "unknown"', () => {
    component.person = { ...component.person, birth_year: 'unknown'} as Person;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="person-birth-year"')?.textContent).toContain('');
  });

  it('should display "N/A" if height is "n/a"', () => {
    component.person = { ...component.person, height: 'n/a'} as Person;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="person-height"')?.textContent).toContain('N/A');
  });

  it('should display "N/A" if height is "unknown"', () => {
    component.person = { ...component.person, height: 'unknown'} as Person;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="person-height"')?.textContent).toContain('N/A');
  });

  it('should display "No Films available" for empty film list', () => {
    component.films = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="empty-films"')?.textContent).toContain('No Films available');
  });

  it('should call SwapiService methods to fetch details', () => {
    expect(mockSwapiService.getPerson).toHaveBeenCalledWith(1);
    expect(mockSwapiService.extractId).toHaveBeenCalled();
  });
});
