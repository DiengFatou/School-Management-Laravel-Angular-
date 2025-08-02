import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClasseService } from '../../Service/classe-service';
import { Classe } from '../../Models/classe.model';

@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classe.html',
  styleUrls: ['./classe.css']
})
export class ClasseComponent implements OnInit {
  classes: Classe[] = [];
  classeForm: Classe = { id: 0, nom: '', niveau: '', annee_scolaire_id: 0 };
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  showForm: boolean = false;

  constructor(private classeService: ClasseService) {}

  ngOnInit(): void {
    this.loadClasses();
    // Données de test si l'API ne répond pas
    if (this.classes.length === 0) {
      this.classes = [
        { id: 1, nom: '6ème A', niveau: '6ème', annee_scolaire_id: 2024 },
        { id: 2, nom: '5ème B', niveau: '5ème', annee_scolaire_id: 2024 },
        { id: 3, nom: 'CM2 C', niveau: 'CM2', annee_scolaire_id: 2024 }
      ];
    }
  }

  loadClasses(): void {
    this.classeService.getClasses().subscribe({
      next: (data) => {
        this.classes = (data || []).sort((a: Classe, b: Classe) => a.id - b.id);
        this.currentPage = 1;
      },
      error: (error) => {
        console.error('Erreur API - Utilisation des données de test:', error);
        // Données de test en cas d'erreur API
        this.classes = [
          { id: 1, nom: '6ème A', niveau: '6ème', annee_scolaire_id: 2024 },
          { id: 2, nom: '6ème B', niveau: '6ème', annee_scolaire_id: 2024 },
          { id: 3, nom: '5ème A', niveau: '5ème', annee_scolaire_id: 2024 },
          { id: 4, nom: '5ème B', niveau: '5ème', annee_scolaire_id: 2024 },
          { id: 5, nom: 'CM2 A', niveau: 'CM2', annee_scolaire_id: 2024 },
          { id: 6, nom: 'CM2 B', niveau: 'CM2', annee_scolaire_id: 2024 }
        ].sort((a: Classe, b: Classe) => a.id - b.id);
        this.currentPage = 1;
      }
    });
  }

  saveClasse(): void {
    if (this.classeForm.id) {
      const index = this.classes.findIndex(c => c.id === this.classeForm.id);
      if (index !== -1) {
        this.classes[index] = { ...this.classeForm };
        this.classes.sort((a: Classe, b: Classe) => a.id - b.id);
        this.resetForm();
        alert('Classe modifiée avec succès');
      }
    } else {
      const newId = Math.max(...this.classes.map(c => c.id), 0) + 1;
      const newClasse = { ...this.classeForm, id: newId };
      this.classes.push(newClasse);
      this.classes.sort((a: Classe, b: Classe) => a.id - b.id);
      
      this.searchTerm = '';
      this.currentPage = 1;
      
      // FORCER Angular à détecter les changements
      setTimeout(() => {
        this.classes = [...this.classes];
      }, 0);
      
      this.resetForm();
      alert('Classe ajoutée avec succès - Total: ' + this.classes.length);
    }
  }

  editClasse(classe: Classe): void {
    this.classeForm = { ...classe };
    this.showForm = true;
  }

  deleteClasse(id: number): void {
    if (confirm('Confirmer la suppression ?')) {
      // Simulation locale en cas d'erreur API
      this.classes = this.classes.filter(c => c.id !== id);
      alert('Classe supprimée avec succès (mode local)');
    }
  }

  resetForm(): void {
    this.classeForm = { id: 0, nom: '', niveau: '', annee_scolaire_id: 0 };
    this.showForm = false;
  }

  viewClasse(classe: Classe): void {
    alert(`Détails de la classe:\n\nID: ${classe.id}\nNom: ${classe.nom}\nNiveau: ${classe.niveau}\nAnnée scolaire: ${classe.annee_scolaire_id}`);
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  get filteredClasses(): Classe[] {
    return this.classes
      .filter(c =>
        c.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.niveau.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .sort((a: Classe, b: Classe) => a.id - b.id);
  }

  get paginatedClasses(): Classe[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredClasses.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.filteredClasses.length / this.itemsPerPage))
      .fill(0)
      .map((_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
    }
  }
}
