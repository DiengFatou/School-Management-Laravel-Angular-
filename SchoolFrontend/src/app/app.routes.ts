import { Routes } from '@angular/router';
import { ParentModel } from './components/parent-model/parent-model';
import { ClasseComponent } from './components/classe/classe';
import { EleveComponent } from './components/eleve/eleve';
import { EnseignantComponent } from './components/enseignant/enseignant';

export const appRoutes: Routes = [
  { path: 'parents', component: ParentModel },
  { path: 'classes', component: ClasseComponent },
  { path: 'eleves', component: EleveComponent },
  { path: 'enseignants', component: EnseignantComponent },
  // éventuellement ajouter { path: '', redirectTo: '/parents', pathMatch: 'full' }
];
