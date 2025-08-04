import { Routes } from '@angular/router';
import { ParentModelComponent } from './components/parent-model/parent-model';
import { ClasseComponent } from './components/classe/classe';
import { EleveComponent } from './components/eleve/eleve';
import { EnseignantComponent } from './components/enseignant/enseignant';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { TestComponent } from './components/test/test.component';
import { AdminEnseignantsComponent } from './components/admin-enseignants/admin-enseignants.component';
import { ListBulletinComponent } from './Bulletins/list-bulletin/list-bulletin';
import { ListNote } from './Note/list-note/list-note';

export const appRoutes: Routes = [
  { path: 'test', component: TestComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'parents', component: ParentModelComponent },
  { path: 'classes', component: ClasseComponent },
  { path: 'eleves', component: EleveComponent },
  { path: 'enseignants', component: AdminEnseignantsComponent },
  { path: 'old-enseignants', component: EnseignantComponent },
  { path: 'bulletins', component: ListBulletinComponent },
  { path: 'notes', component: ListNote },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
