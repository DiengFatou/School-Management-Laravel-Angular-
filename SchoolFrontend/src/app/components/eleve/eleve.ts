import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Eleve } from '../../Models/eleve.model';
import { EleveService } from '../../Service/eleve-service';

@Component({
  selector: 'app-eleve',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eleve.html',
  styleUrls: ['./eleve.css']
})
export class EleveComponent implements OnInit {
  eleves: Eleve[] = [];
  filteredEleves: Eleve[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchTerm: string = '';
  showForm: boolean = false;

  eleveForm: Eleve = {
    id: 0,
    user_id: 0,
    nom: '',
    prenom: '',
    date_naissance: new Date(),
    classe_id: 0,
    parent_id: 0,
    visible: true
  };

  isEditing: boolean = false;

  constructor(private eleveService: EleveService) {}

  ngOnInit(): void {
    this.loadEleves();
    // Données de test si l'API ne répond pas
    setTimeout(() => {
      if (this.eleves.length === 0) {
        this.eleves = [
          { id: 1, user_id: 301, nom: 'Dupont', prenom: 'Marie', date_naissance: new Date('2010-05-15'), classe_id: 1, parent_id: 1, visible: true },
          { id: 2, user_id: 302, nom: 'Martin', prenom: 'Pierre', date_naissance: new Date('2011-03-22'), classe_id: 2, parent_id: 2, visible: true },
          { id: 3, user_id: 303, nom: 'Bernard', prenom: 'Sophie', date_naissance: new Date('2009-12-08'), classe_id: 1, parent_id: 3, visible: false }
        ];
        this.filteredEleves = [...this.eleves];
      }
    }, 100);
  }

  loadEleves(): void {
    this.eleveService.getEleves().subscribe({
      next: (data) => {
        this.eleves = data || [];
        this.filteredEleves = [...this.eleves];
        this.currentPage = 1;
      },
      error: (error) => {
        console.error('Erreur API - Utilisation des données de test:', error);
        this.eleves = [
          { id: 1, user_id: 301, nom: 'Dupont', prenom: 'Marie', date_naissance: new Date('2010-05-15'), classe_id: 1, parent_id: 1, visible: true },
          { id: 2, user_id: 302, nom: 'Martin', prenom: 'Pierre', date_naissance: new Date('2011-03-22'), classe_id: 2, parent_id: 2, visible: true },
          { id: 3, user_id: 303, nom: 'Bernard', prenom: 'Sophie', date_naissance: new Date('2009-12-08'), classe_id: 1, parent_id: 3, visible: false }
        ];
        this.filteredEleves = [...this.eleves];
        this.currentPage = 1;
      }
    });
  }

  search(): void {
    this.filteredEleves = this.eleves.filter(e =>
      e.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  get paginatedEleves(): Eleve[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEleves.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredEleves.length / this.itemsPerPage);
  }

  changePage(direction: number): void {
    const newPage = this.currentPage + direction;
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.currentPage = newPage;
    }
  }

  save(): void {
    if (this.isEditing) {
      const index = this.eleves.findIndex(e => e.id === this.eleveForm.id);
      if (index !== -1) {
        this.eleves[index] = { ...this.eleveForm };
        this.filteredEleves = [...this.eleves];
        this.resetForm();
        alert('Élève modifié avec succès');
      }
    } else {
      const newId = Math.max(...this.eleves.map(e => e.id), 0) + 1;
      const newEleve = { ...this.eleveForm, id: newId };
      this.eleves.push(newEleve);
      
      this.searchTerm = '';
      this.filteredEleves = [...this.eleves];
      this.currentPage = 1;
      
      // FORCER Angular à détecter les changements
      setTimeout(() => {
        this.filteredEleves = [...this.eleves];
      }, 0);
      
      this.resetForm();
      alert('Élève ajouté avec succès - Total: ' + this.eleves.length);
    }
  }

  edit(eleve: Eleve): void {
    this.eleveForm = { ...eleve };
    this.isEditing = true;
    this.showForm = true;
  }

  delete(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet élève ?')) {
      this.eleves = this.eleves.filter(e => e.id !== id);
      this.filteredEleves = [...this.eleves];
      // Réinitialiser la recherche
      this.searchTerm = '';
      this.currentPage = 1;
      alert('Élève supprimé avec succès (mode local)');
    }
  }

  resetForm(): void {
    this.eleveForm = {
      id: 0,
      user_id: 0,
      nom: '',
      prenom: '',
      date_naissance: new Date(),
      classe_id: 0,
      parent_id: 0,
      visible: true
    };
    this.isEditing = false;
    this.showForm = false;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }
}
