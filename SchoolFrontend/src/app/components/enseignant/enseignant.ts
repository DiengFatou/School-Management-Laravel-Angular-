import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Enseignant } from '../../Models/enseignant.model';
import { EnseignantService } from '../../Service/enseignant-service';

@Component({
  selector: 'app-enseignant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enseignant.html',
  styleUrls: ['./enseignant.css']
})
export class EnseignantComponent implements OnInit {
  enseignants: Enseignant[] = [];
  filteredEnseignants: Enseignant[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchTerm: string = '';
  showForm: boolean = false;

  newEnseignant: Enseignant = {
    id: 0,
    user_id: 0,
    nom_complet: ''
  };

  isEditing: boolean = false;

  constructor(private enseignantService: EnseignantService) {}

  ngOnInit(): void {
    this.loadEnseignants();
    // Données de test si l'API ne répond pas
    setTimeout(() => {
      if (this.enseignants.length === 0) {
        this.enseignants = [
          { id: 1, user_id: 101, nom_complet: 'M. Jean Dupont' },
          { id: 2, user_id: 102, nom_complet: 'Mme Marie Martin' },
          { id: 3, user_id: 103, nom_complet: 'M. Pierre Durand' },
          { id: 4, user_id: 104, nom_complet: 'Mme Sophie Bernard' },
          { id: 5, user_id: 105, nom_complet: 'M. Paul Moreau' }
        ].sort((a: Enseignant, b: Enseignant) => a.nom_complet.localeCompare(b.nom_complet));
        this.filteredEnseignants = [...this.enseignants];
      }
    }, 100);
  }

  loadEnseignants(): void {
    this.enseignantService.getEnseignants().subscribe({
      next: (data) => {
        this.enseignants = (data || []).sort((a: Enseignant, b: Enseignant) => a.nom_complet.localeCompare(b.nom_complet));
        this.filteredEnseignants = [...this.enseignants];
      },
      error: (error) => {
        console.error('Erreur API - Utilisation des données de test:', error);
        // Données de test en cas d'erreur API
        this.enseignants = [
          { id: 1, user_id: 101, nom_complet: 'M. Jean Dupont' },
          { id: 2, user_id: 102, nom_complet: 'Mme Marie Martin' },
          { id: 3, user_id: 103, nom_complet: 'M. Pierre Durand' },
          { id: 4, user_id: 104, nom_complet: 'Mme Sophie Bernard' },
          { id: 5, user_id: 105, nom_complet: 'M. Paul Moreau' }
        ].sort((a: Enseignant, b: Enseignant) => a.nom_complet.localeCompare(b.nom_complet));
        this.filteredEnseignants = [...this.enseignants];
        this.sortEnseignants(); // Force le tri
      }
    });
  }

  get paginatedEnseignants(): Enseignant[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEnseignants.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredEnseignants.length / this.itemsPerPage);
  }

  search(): void {
    this.filteredEnseignants = this.enseignants
      .filter(e => e.nom_complet.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .sort((a: Enseignant, b: Enseignant) => a.nom_complet.localeCompare(b.nom_complet));
    this.currentPage = 1;
  }

  save(): void {
    if (this.isEditing) {
      const index = this.enseignants.findIndex(e => e.id === this.newEnseignant.id);
      if (index !== -1) {
        this.enseignants[index] = { ...this.newEnseignant };
        this.enseignants.sort((a: Enseignant, b: Enseignant) => a.nom_complet.localeCompare(b.nom_complet));
        this.filteredEnseignants = [...this.enseignants];
        this.resetForm();
        alert('Enseignant modifié avec succès');
      }
    } else {
      const newId = Math.max(...this.enseignants.map(e => e.id), 0) + 1;
      const newEnseignant = { ...this.newEnseignant, id: newId };
      this.enseignants.push(newEnseignant);
      this.enseignants.sort((a: Enseignant, b: Enseignant) => a.nom_complet.localeCompare(b.nom_complet));
      
      this.searchTerm = '';
      this.filteredEnseignants = [...this.enseignants];
      this.currentPage = 1;
      
      // FORCER Angular à détecter les changements
      setTimeout(() => {
        this.filteredEnseignants = [...this.enseignants];
      }, 0);
      
      this.resetForm();
      alert('Enseignant ajouté avec succès - Total: ' + this.enseignants.length);
    }
  }

  edit(enseignant: Enseignant): void {
    this.newEnseignant = { ...enseignant };
    this.isEditing = true;
    this.showForm = true;
  }

  delete(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer cet enseignant ?")) {
      // Simulation locale en cas d'erreur API
      this.enseignants = this.enseignants
        .filter(e => e.id !== id)
        .sort((a: Enseignant, b: Enseignant) => a.nom_complet.localeCompare(b.nom_complet));
      this.filteredEnseignants = [...this.enseignants];
      // Réinitialiser la recherche
      this.searchTerm = '';
      this.currentPage = 1;
      alert('Enseignant supprimé avec succès (mode local)');
    }
  }

  resetForm(): void {
    this.newEnseignant = { id: 0, user_id: 0, nom_complet: '' };
    this.isEditing = false;
    this.showForm = false;
  }

  view(enseignant: Enseignant): void {
    alert(`Détails de l'enseignant:\n\nID: ${enseignant.id}\nNom: ${enseignant.nom_complet}\nUser ID: ${enseignant.user_id}`);
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  changePage(direction: number): void {
    const newPage = this.currentPage + direction;
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.currentPage = newPage;
    }
  }

  // Méthode pour forcer le tri
  sortEnseignants(): void {
    this.enseignants.sort((a: Enseignant, b: Enseignant) => a.nom_complet.localeCompare(b.nom_complet));
    this.filteredEnseignants = [...this.enseignants];
  }
}
