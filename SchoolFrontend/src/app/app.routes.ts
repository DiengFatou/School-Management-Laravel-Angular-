import { Routes } from '@angular/router';
import { ParentModelComponent } from './components/parent-model/parent-model';
import { EleveComponent } from './components/eleve/eleve';
import { ClasseComponent } from './components/classe/classe';
import { EnseignantComponent } from './components/enseignant/enseignant';

export const appRoutes: Routes = [
  { path: 'parents', component: ParentModelComponent },
  { path: 'eleves', component: EleveComponent },
  { path: 'classes', component: ClasseComponent },
  { path: 'enseignants', component: EnseignantComponent },
  /*{ path: '', redirectTo: '/parents', pathMatch: 'full' }*/
];
