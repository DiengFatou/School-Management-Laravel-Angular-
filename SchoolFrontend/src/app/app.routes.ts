import { Routes } from '@angular/router';
import { ParentModelComponent } from './components/parent-model/parent-model';
import { EleveComponent } from './components/eleve/eleve';
import { EnseignantComponent } from './components/enseignant/enseignant';
import { ClasseComponent } from './components/classe/classe';

export const routes: Routes = [
  { path: 'parents', component: ParentModelComponent },
  { path: 'eleves', component: EleveComponent },
  { path: 'enseignants', component: EnseignantComponent },
  { path: 'classes', component: ClasseComponent },
];
