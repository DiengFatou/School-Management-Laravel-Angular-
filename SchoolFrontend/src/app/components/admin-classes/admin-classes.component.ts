import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ClasseService, Classe } from '../../services/classe.service';

interface AnneeScolaire {
  id: number;
  libelle: string;
  active: boolean;
}

@Component({
  selector: 'app-admin-classes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-classes.component.html',
  styleUrls: ['./admin-classes.component.css']
})
export class AdminClassesComponent implements OnInit {
  classes: Classe[] = [];
  selectedClasse: Classe | null = null;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showModal = false; // Contrôle l'affichage de la modal
  editingClasse: Classe | null = null; // Stocke la classe en cours d'édition

  @ViewChild('classeFormElement') classeFormElement!: NgForm;
  
  // Liste des niveaux disponibles
  niveaux: string[] = [
    'CP', 'CE1', 'CE2', 'CM1', 'CM2',
    '6ème', '5ème', '4ème', '3ème',
    'Seconde', 'Première', 'Terminale',
    'BTS1', 'BTS2', 'Licence 1', 'Licence 2', 'Licence 3',
    'Master 1', 'Master 2'
  ];
  
  // Liste des années scolaires
  anneesScolaires: AnneeScolaire[] = [
    { id: 1, libelle: '2023-2024', active: false },
    { id: 2, libelle: '2024-2025', active: true },
    { id: 3, libelle: '2025-2026', active: false }
  ];
  
  // Formulaire
  classeForm: Classe = {
    nom: '',
    niveau: '',
    capacite: 20, // Valeur par défaut
    annee_scolaire_id: 0
  };

  // État du formulaire
  isSubmitting = false;

  constructor(private classeService: ClasseService) { }

  ngOnInit(): void {
    this.loadClasses();
  }

  // Charger toutes les classes
  loadClasses(): void {
    this.isLoading = true;
    this.classeService.getAll().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des classes';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  // Ouvrir le formulaire d'ajout
  openAddForm(): void {
    this.isEditing = false;
    this.selectedClasse = null;
    this.editingClasse = null;
    this.resetForm();
    this.showModal = true;
  }

  // Ouvrir le formulaire d'édition
  openEditForm(classe: Classe): void {
    this.isEditing = true;
    this.selectedClasse = { ...classe };
    this.editingClasse = { ...classe };
    this.classeForm = { ...classe };
    this.showModal = true;
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.classeForm = {
      nom: '',
      niveau: '',
      capacite: 20, // Valeur par défaut cohérente
      annee_scolaire_id: 0
    };
  }

  // Soumettre le formulaire (ajout ou édition)
  async onSubmit() {
    if (this.classeFormElement.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.classeFormElement.controls).forEach(key => {
        this.classeFormElement.controls[key].markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;

    try {
      if (this.isEditing && this.selectedClasse?.id) {
        await this.updateClasse(this.selectedClasse.id);
      } else {
        await this.createClasse();
      }
      this.closeModal();
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      this.errorMessage = 'Une erreur est survenue lors de la sauvegarde de la classe.';
      this.hideMessages();
    } finally {
      this.isSubmitting = false;
    }
  }

  // Créer une nouvelle classe (version asynchrone)
  async createClasse(): Promise<void> {
    this.isLoading = true;
    try {
      const response = await this.classeService.create(this.classeForm).toPromise();
      if (response) {
        this.classes.push(response);
        this.successMessage = 'Classe ajoutée avec succès';
        this.resetForm();
        this.hideMessages();
      }
    } catch (error) {
      console.error('Erreur lors de la création de la classe:', error);
      this.errorMessage = 'Erreur lors de la création de la classe';
      this.hideMessages();
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Mettre à jour une classe (version asynchrone)
  async updateClasse(id: number): Promise<void> {
    if (!id) return;
    
    this.isLoading = true;
    try {
      const classe = await this.classeService.update(id, this.classeForm).toPromise();
      if (classe) {
        const index = this.classes.findIndex(c => c.id === id);
        if (index !== -1) {
          this.classes[index] = classe;
        }
        this.successMessage = 'Classe modifiée avec succès';
        this.hideMessages();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la classe:', error);
      this.errorMessage = 'Erreur lors de la modification de la classe';
      this.hideMessages();
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Supprimer une classe
  deleteClasse(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      this.isLoading = true;
      this.classeService.delete(id).subscribe({
        next: () => {
          this.classes = this.classes.filter(c => c.id !== id);
          this.successMessage = 'Classe supprimée avec succès';
          this.isLoading = false;
          this.hideMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression de la classe';
          this.isLoading = false;
          console.error('Erreur:', error);
          this.hideMessages();
        }
      });
    }
  }

  // Masquer les messages après 3 secondes
  hideMessages(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 3000);
  }

  // Fermer la modal
  closeModal(): void {
    this.resetForm();
    this.selectedClasse = null;
    this.editingClasse = null;
    this.isEditing = false;
    this.showModal = false;
  }

  // Annuler l'édition
  cancelEdit(): void {
    this.closeModal();
  }
} 