import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EleveService } from '../../services/eleve.service';
import { AdminElevesComponent } from '../admin-eleves/admin-eleves.component';
import { AdminClassesComponent } from '../admin-classes/admin-classes.component';
import { AdminEnseignantsComponent } from '../admin-enseignants/admin-enseignants.component';
import { DashboardChartsComponent } from './dashboard-charts/dashboard-charts.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ListBulletinComponent } from '../../Bulletins/list-bulletin/list-bulletin';
import { ListNote } from '../../Note/list-note/list-note';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    AdminElevesComponent, 
    AdminClassesComponent, 
    AdminEnseignantsComponent,
    DashboardChartsComponent,
    ListBulletinComponent,
    ListNote
  ]
})
export class AdminComponent implements OnInit {
  currentUser = { name: 'Admin' };
  currentView = 'dashboard'; // 'dashboard', 'eleves', 'classes', etc.

  stats = {
    eleves: 0,
    classes: 12,
    enseignants: 24,
    matieres: 18
  };

  constructor(
    private eleveService: EleveService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Charger le nombre d'élèves depuis l'API
    this.eleveService.getAll().subscribe({
      next: (eleves) => {
        this.stats.eleves = eleves.length;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des élèves:', error);
        this.stats.eleves = 0;
      }
    });
  }

  // Navigation
  navigateTo(view: string): void {
    this.currentView = view;
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
} 