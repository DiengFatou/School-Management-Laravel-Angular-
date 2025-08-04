import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EleveService, Eleve, User, CreateEleveRequest } from '../../services/eleve.service';
import { ClasseService, Classe } from '../../services/classe.service';
import { ParentService, Parent } from '../../services/parent.service';

@Component({
  selector: 'app-admin-eleves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-eleves.component.html',
  styleUrls: ['./admin-eleves.component.css']
})
export class AdminElevesComponent implements OnInit {
  eleves: Eleve[] = [];
  classes: Classe[] = [];
  parents: Parent[] = [];
  selectedEleve: Eleve | null = null;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showModal = false;

  // Formulaire pour l'utilisateur
  userForm = {
    nom: '',
    email: '',
    mot_de_passe: '',
    role: 'eleve' as const,
    is_active: true
  };

  // Formulaire pour l'élève
  eleveForm = {
    nom: '',
    prenom: '',
    date_naissance: '',
    classe_id: 0 as number | null,
    parent_id: 0 as number | null,
    visible: true
  };

  constructor(
    private eleveService: EleveService,
    private classeService: ClasseService,
    private parentService: ParentService
  ) { }

  ngOnInit(): void {
    this.loadEleves();
    this.loadClasses();
    this.loadParents();
  }

  // Charger tous les élèves
  loadEleves(): void {
    this.isLoading = true;
    this.eleveService.getAll().subscribe({
      next: (eleves) => {
        this.eleves = eleves;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des élèves';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    });
  }

  // Charger toutes les classes
  loadClasses(): void {
    this.classeService.getAll().subscribe({
      next: (classes) => {
        this.classes = classes;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des classes:', error);
      }
    });
  }

  // Charger tous les parents
  loadParents(): void {
    this.parentService.getAll().subscribe({
      next: (parents) => {
        this.parents = parents;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des parents:', error);
      }
    });
  }

  // Obtenir le nom de la classe
  getClasseName(classeId: number): string {
    const classe = this.classes.find(c => c.id === classeId);
    return classe ? classe.nom : 'Classe inconnue';
  }

  // Obtenir le nom du parent
  getParentName(parentId: number): string {
    console.log('Recherche du parent avec ID:', parentId);
    console.log('Liste des parents chargés:', this.parents);
    
    const parent = this.parents.find(p => p.id === parentId);
    console.log('Parent trouvé:', parent);
    
    if (parent) {
      console.log('Détails du parent:', {
        id: parent.id,
        user_id: parent.user_id,
        user: parent.user
      });
    }
    
    return parent && parent.user ? parent.user.nom : 'Parent inconnu';
  }

  // Calculer l'âge
  calculateAge(dateNaissance: string): number {
    if (!dateNaissance) return 0;
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Ouvrir le formulaire d'ajout
  openAddForm(): void {
    this.isEditing = false;
    this.selectedEleve = null;
    this.showModal = true;
    this.resetForm();
    console.log('Modal ouverte pour ajout');
  }

  // Ouvrir le formulaire d'édition
  openEditForm(eleve: Eleve): void {
    this.isEditing = true;
    this.selectedEleve = eleve;
    this.showModal = true;
    this.eleveForm = { 
      nom: eleve.nom,
      prenom: eleve.prenom,
      date_naissance: eleve.date_naissance || '',
      classe_id: eleve.classe_id || 0,
      parent_id: eleve.parent_id || 0,
      visible: eleve.visible || true
    };
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.userForm = {
      nom: '',
      email: '',
      mot_de_passe: '',
      role: 'eleve',
      is_active: true
    };
    
    this.eleveForm = {
      nom: '',
      prenom: '',
      date_naissance: '',
      classe_id: 0,
      parent_id: 0,
      visible: true
    };
  }

  // Soumettre le formulaire (ajout ou édition)
  onSubmit(): void {
    if (this.isEditing && this.selectedEleve?.id) {
      this.updateEleve(this.selectedEleve.id);
    } else {
      this.createEleve();
    }
  }

  // Générer un email et un mot de passe automatiquement
  private generateUserCredentials(nom: string, prenom: string): { email: string, password: string } {
    // Créer un email au format prenom.nom@ecole.fr (en minuscules, sans accents, avec remplacement des espaces par des points)
    const cleanString = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
        .toLowerCase()
        .replace(/\s+/g, '.'); // Remplacer les espaces par des points
    };

    const email = `${cleanString(prenom)}.${cleanString(nom)}@ecole.edu`;
    
    // Générer un mot de passe aléatoire de 8 caractères
    const password = Math.random().toString(36).slice(-8);
    
    return { email, password };
  }

  // Créer un nouvel élève
  createEleve(): void {
    this.isLoading = true;
    
    // Générer automatiquement les informations de connexion
    const credentials = this.generateUserCredentials(this.eleveForm.nom, this.eleveForm.prenom);
    
    const createRequest: CreateEleveRequest = {
      user: {
        nom: this.eleveForm.nom,
        email: credentials.email,
        mot_de_passe: credentials.password,
        role: 'eleve',
        is_active: true
      },
      eleve: {
        ...this.eleveForm,
        // S'assurer que les IDs sont des nombres
        classe_id: this.eleveForm.classe_id || null,
        parent_id: this.eleveForm.parent_id || null
      }
    };
    
    this.eleveService.create(createRequest).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.eleves.push(response.data);
          this.successMessage = `Élève ajouté avec succès. ` +
            `Email: ${credentials.email}, Mot de passe: ${credentials.password}`;
          this.resetForm();
          this.showModal = false;
          this.loadEleves(); // Recharger la liste des élèves
        } else {
          this.errorMessage = response.message || 'Erreur inconnue lors de l\'ajout de l\'élève';
        }
        this.isLoading = false;
        this.hideMessages();
      },
      error: (error) => {
        console.error('Erreur détaillée:', error);
        this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout de l\'élève';
        if (error.error?.error) {
          console.error('Erreur serveur:', error.error.error);
        }
        this.isLoading = false;
        this.hideMessages();
      }
    });
  }

  // Mettre à jour un élève
  updateEleve(id: number): void {
    this.isLoading = true;
    const updateData: Eleve = { 
      ...this.eleveForm, 
      id,
      user_id: this.selectedEleve?.user_id || 0
    };
    
    this.eleveService.update(id, updateData).subscribe({
      next: (eleve) => {
        const index = this.eleves.findIndex(e => e.id === id);
        if (index !== -1) {
          this.eleves[index] = eleve;
        }
        this.successMessage = 'Élève modifié avec succès';
        this.resetForm();
        this.showModal = false;
        this.isLoading = false;
        this.hideMessages();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la modification de l\'élève';
        this.isLoading = false;
        console.error('Erreur:', error);
        this.hideMessages();
      }
    });
  }

  // Supprimer un élève
  deleteEleve(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      this.isLoading = true;
      this.eleveService.delete(id).subscribe({
        next: () => {
          this.eleves = this.eleves.filter(e => e.id !== id);
          this.successMessage = 'Élève supprimé avec succès';
          this.isLoading = false;
          this.hideMessages();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression de l\'élève';
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

  // Annuler l'édition
  cancelEdit(): void {
    this.resetForm();
    this.selectedEleve = null;
    this.isEditing = false;
    this.showModal = false;
  }
} 