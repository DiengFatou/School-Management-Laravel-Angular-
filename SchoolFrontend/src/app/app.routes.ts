import { Routes } from '@angular/router';
import { ParentModelComponent } from './components/parent-model/parent-model';
import { ClasseComponent } from './components/classe/classe';
import { EleveComponent } from './components/eleve/eleve';
import { EnseignantComponent } from './components/enseignant/enseignant';

export const appRoutes: Routes = [
  { path: 'parents', component: ParentModelComponent },
  { path: 'classes', component: ClasseComponent },
  { path: 'eleves', component: EleveComponent },
  { path: 'enseignants', component: EnseignantComponent },
 // { path: '', redirectTo: '/enseignants', pathMatch: 'full' }
];
