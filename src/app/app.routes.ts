import { Routes } from '@angular/router';
import { PeopleListComponent } from './components/people-list/people-list.component';
import { PeopleDetailComponent } from './components/people-detail/people-detail.component';

export const routes: Routes = [
  { path: '', component: PeopleListComponent },
  { path: 'people/:id', component: PeopleDetailComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }  // Redirect any unknown paths to the main page
];
