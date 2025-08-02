import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Parent } from '../../Models/parent.model';
import { ParentService } from '../../Service/parent-service';

@Component({
  selector: 'app-parent-model',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parent-model.html',
  styleUrls: ['./parent-model.css']
})
export class ParentModelComponent implements OnInit {
  parents: Parent[] = [];
  filteredParents: Parent[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchTerm: string = '';
  showForm: boolean = false;

  parentForm: Parent = {
    id: 0,
    user_id: 0,
    telephone: '',
    adresse: ''
  };

  isEditing: boolean = false;

  constructor(private parentService: ParentService) {}

  ngOnInit(): void {
    this.loadParents();
    // Données de test si l'API ne répond pas
    setTimeout(() => {
      if (this.parents.length === 0) {
        this.parents = [
          { id: 1, user_id: 201, telephone: '+33 1 23 45 67 89', adresse: '123 Rue de la Paix, 75001 Paris' },
          { id: 2, user_id: 202, telephone: '+33 1 98 76 54 32', adresse: '456 Avenue des Champs, 75008 Paris' },
          { id: 3, user_id: 203, telephone: '+33 1 11 22 33 44', adresse: '789 Boulevard Saint-Germain, 75006 Paris' }
        ];
        this.filteredParents = [...this.parents];
      }
    }, 100);
  }

  loadParents(): void {
    this.parentService.getParents().subscribe({
      next: (data) => {
        this.parents = data || [];
        this.filteredParents = [...this.parents];
      },
      error: (error) => {
        console.error('Erreur API - Utilisation des données de test:', error);
        this.parents = [
          { id: 1, user_id: 201, telephone: '+33 1 23 45 67 89', adresse: '123 Rue de la Paix, 75001 Paris' },
          { id: 2, user_id: 202, telephone: '+33 1 98 76 54 32', adresse: '456 Avenue des Champs, 75008 Paris' },
          { id: 3, user_id: 203, telephone: '+33 1 11 22 33 44', adresse: '789 Boulevard Saint-Germain, 75006 Paris' }
        ];
        this.filteredParents = [...this.parents];
      }
    });
  }

  search(): void {
    this.filteredParents = this.parents.filter(p =>
      p.telephone.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.adresse.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  get paginatedParents(): Parent[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredParents.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredParents.length / this.itemsPerPage);
  }

  changePage(direction: number): void {
    const newPage = this.currentPage + direction;
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.currentPage = newPage;
    }
  }

  save(): void {
    if (this.isEditing) {
      const index = this.parents.findIndex(p => p.id === this.parentForm.id);
      if (index !== -1) {
        this.parents[index] = { ...this.parentForm };
        this.filteredParents = [...this.parents];
        this.resetForm();
        alert('Parent modifié avec succès');
      }
    } else {
      const newId = Math.max(...this.parents.map(p => p.id), 0) + 1;
      const newParent = { ...this.parentForm, id: newId };
      this.parents.push(newParent);
      
      this.searchTerm = '';
      this.filteredParents = [...this.parents];
      this.currentPage = 1;
      
      // FORCER Angular à détecter les changements
      setTimeout(() => {
        this.filteredParents = [...this.parents];
      }, 0);
      
      this.resetForm();
      alert('Parent ajouté avec succès - Total: ' + this.parents.length);
    }
  }

  edit(parent: Parent): void {
    this.parentForm = { ...parent };
    this.isEditing = true;
    this.showForm = true;
  }

  delete(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce parent ?')) {
      this.parents = this.parents.filter(p => p.id !== id);
      this.filteredParents = [...this.parents];
      // Réinitialiser la recherche
      this.searchTerm = '';
      this.currentPage = 1;
      alert('Parent supprimé avec succès (mode local)');
    }
  }

  resetForm(): void {
    this.parentForm = {
      id: 0,
      user_id: 0,
      telephone: '',
      adresse: ''
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