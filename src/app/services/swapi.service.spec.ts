import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SwapiService } from './swapi.service';
import { PeopleResponse, Person, Film, Species, Starship, Vehicle } from '@models/swapi.types';

describe('SwapiService', () => {
  let service: SwapiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SwapiService]
    });

    service = TestBed.inject(SwapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch people', () => {
    const mockPeopleResponse: PeopleResponse = {
      count: 2,
      next: 'https://swapi.dev/api/people/?page=2',
      previous: null,
      results: [
        {
          name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/',
          height: '',
          mass: '',
          hair_color: '',
          skin_color: '',
          eye_color: '',
          birth_year: '',
          gender: '',
          homeworld: '',
          films: [],
          species: [],
          vehicles: [],
          starships: [],
          created: '',
          edited: ''
        },
        {
          name: 'C-3PO', url: 'https://swapi.dev/api/people/2/',
          height: '',
          mass: '',
          hair_color: '',
          skin_color: '',
          eye_color: '',
          birth_year: '',
          gender: '',
          homeworld: '',
          films: [],
          species: [],
          vehicles: [],
          starships: [],
          created: '',
          edited: ''
        }
      ]
    };

    service.getPeople().subscribe((response) => {
      expect(response).toEqual(mockPeopleResponse);
    });

    const req = httpMock.expectOne('https://swapi.dev/api/people/?page=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPeopleResponse);
  });

  it('should fetch a person', () => {
    const mockPerson: Person = {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      films: [],
      species: [],
      starships: [],
      vehicles: [],
      url: 'https://swapi.dev/api/people/1/',
      homeworld: '',
      created: '',
      edited: ''
    };

    service.getPerson(1).subscribe((person) => {
      expect(person).toEqual(mockPerson);
    });

    const req = httpMock.expectOne('https://swapi.dev/api/people/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPerson);
  });

  it('should fetch a film', () => {
    const mockFilm: Film = {
      title: 'A New Hope',
      episode_id: 4,
      opening_crawl: 'It is a period of civil war...',
      director: 'George Lucas',
      producer: 'Gary Kurtz, Rick McCallum',
      release_date: '1977-05-25',
      characters: [],
      planets: [],
      starships: [],
      vehicles: [],
      species: [],
      url: 'https://swapi.dev/api/films/1/',
      created: '',
      edited: ''
    };

    service.getFilm(1).subscribe((film) => {
      expect(film).toEqual(mockFilm);
    });

    const req = httpMock.expectOne('https://swapi.dev/api/films/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockFilm);
  });

  it('should handle invalid ID in fetchData', () => {
    service.getPerson(null).subscribe({
      next: () => fail('Expected an error, not a person'),
      error: (error) => {
        expect(error.message).toContain('Invalid ID');
      }
    });
  });

  it('should handle fetch error', () => {
    const errorMessage = 'Failed to fetch people';
    service.getPerson(1).subscribe({
      next: () => fail('Expected an error, not a person'),
      error: (error) => {
        expect(error.message).toContain(errorMessage);
      }
    });

    const req = httpMock.expectOne('https://swapi.dev/api/people/1');
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  it('should extract ID from URL', () => {
    const url = 'https://swapi.dev/api/people/1/';
    const id = service.extractId(url);
    expect(id).toBe(1);
  });

  it('should return null for invalid URL in extractId', () => {
    const url = 'https://swapi.dev/api/people/';
    const id = service.extractId(url);
    expect(id).toBeNull();
  });
});
