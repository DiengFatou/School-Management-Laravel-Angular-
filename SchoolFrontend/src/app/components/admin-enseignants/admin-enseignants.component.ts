import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Enseignant, Enseignement } from '../../Models/enseignant.model';
import { EnseignantService } from '../../Service/enseignant-service';
import { MatiereService } from '../../Service/matiere-service';
import { ClasseService } from '../../Service/classe-service';
import { EnseignementService } from '../../Service/enseignement-service';
import { Matiere } from '../../Models/matiere.model';
import { Classe } from '../../Models/classe.model';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Import des modules nécessaires pour les formulaires et les requêtes HTTP
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-enseignants',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    EnseignantService,
    MatiereService,
    ClasseService,
    EnseignementService
  ],
  templateUrl: './admin-enseignants.component.html',
  styleUrls: ['./admin-enseignants.component.css']
})
export class AdminEnseignantsComponent implements OnInit {
  enseignants: (Enseignant & { enseignements?: any[] })[] = [];
  selectedEnseignant: Enseignant | null = null;
  isEditing = false;
  isLoading = false;
  isLoadingDetails: { [key: number]: boolean } = {};
  errorMessage = '';
  successMessage = '';
  showModal = false;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  expandedCards: { [key: number]: boolean } = {};

  // Formulaire
  enseignantForm: Enseignant = {
    id: 0,
    user_id: 0,
    nom_complet: ''
  };

  // Sélections du formulaire
  selectedMatiereId: number = 0;
  selectedClasseId: number = 0;
  
  // Données pour les sélecteurs
  matieres: Matiere[] = [];
  classes: Classe[] = [];
  isLoadingMatieres = false;
  isLoadingClasses = false;

  constructor(
    private enseignantService: EnseignantService,
    private matiereService: MatiereService,
    private classeService: ClasseService,
    private enseignementService: EnseignementService
  ) { }

  ngOnInit(): void {
    console.log('Initialisation du composant AdminEnseignantsComponent');
    
    // Charger les données initiales
    console.log('Chargement des données initiales...');
    this.loadInitialData();
    
    // Charger la liste des matières
    console.log('Chargement des matières...');
    this.loadMatieres();
    
    // Charger la liste des classes
    console.log('Chargement des classes...');
    this.loadClasses();
    
    console.log('Méthode ngOnInit terminée');
  }

  // Charger la liste des matières
  loadMatieres(): void {
    console.log('=== DÉBUT loadMatieres() ===');
    console.log('MatiereService:', this.matiereService);
    
    this.isLoadingMatieres = true;
    this.errorMessage = '';
    
    try {
      console.log('Appel à matiereService.getMatieres()...');
      const matieres$ = this.matiereService.getMatieres();
      console.log('Observable des matières créé:', matieres$);
      
      // Vérifier si l'observable est valide
      if (!matieres$) {
        console.error('L\'observable des matières est undefined ou null');
        this.errorMessage = 'Erreur lors de la création de la requête';
        this.isLoadingMatieres = false;
        return;
      }
      
      matieres$.subscribe({
        next: (matieres) => {
          console.log('=== DONNÉES REÇUES DANS loadMatieres() ===');
          console.log('Type de données reçues:', typeof matieres);
          console.log('Données brutes reçues:', matieres);
          
          if (!matieres) {
            console.error('Aucune donnée reçue (matieres est null/undefined)');
            this.errorMessage = 'Aucune donnée reçue du serveur';
            return;
          }
          
          if (!Array.isArray(matieres)) {
            console.error('Les matières ne sont pas un tableau:', matieres);
            console.log('Type de matieres:', typeof matieres);
            console.log('Propriétés de matieres:', Object.keys(matieres));
            this.errorMessage = 'Format de données invalide pour les matières';
            return;
          }
          
          console.log(`Nombre de matières reçues: ${matieres.length}`);
          
          if (matieres.length > 0) {
            console.log('Exemple de matière reçue (premier élément):', matieres[0]);
            console.log('Propriétés de la première matière:', matieres[0] ? Object.keys(matieres[0]) : 'null');
          } else {
            console.warn('Le tableau des matières est vide');
          }
          
          // Vérifier les propriétés requises
          const requiredProps = ['id', 'nom', 'coefficient', 'niveau'];
          if (matieres.length > 0) {
            const sample = matieres[0];
            const missingProps = requiredProps.filter(prop => !(prop in sample));
            if (missingProps.length > 0) {
              console.error('Propriétés manquantes dans les données reçues:', missingProps);
              this.errorMessage = `Données incomplètes: propriétés manquantes (${missingProps.join(', ')})`;
              return;
            }
          }
          
          // Assigner les données
          this.matieres = matieres;
          this.isLoadingMatieres = false;
          
          console.log('=== FIN AVEC SUCCÈS loadMatieres() ===');
          console.log('this.matieres après assignation:', this.matieres);
        },
        error: (error) => {
          console.error('=== ERREUR DANS loadMatieres() ===');
          console.error('Erreur complète:', error);
          console.error('Message d\'erreur:', error.message);
          console.error('Status:', error.status);
          console.error('URL:', error.url);
          console.error('Headers:', error.headers);
          console.error('Error object:', JSON.stringify(error));
          
          this.errorMessage = `Erreur lors du chargement des matières: ${error.message || 'Erreur inconnue'}`;
          this.isLoadingMatieres = false;
          
          console.log('=== FIN AVEC ERREUR loadMatieres() ===');
        },
        complete: () => {
          console.log('=== CHARGEMENT TERMINÉ loadMatieres() ===');
          console.log('Chargement des matières terminé avec succès');
          console.log('Valeur finale de this.matieres:', this.matieres);
        }
      });
    } catch (error) {
      console.error('=== ERREUR NON GÉRÉE DANS loadMatieres() ===');
      console.error('Erreur non gérée:', error);
      
      this.errorMessage = 'Une erreur inattendue est survenue lors du chargement des matières';
      this.isLoadingMatieres = false;
      
      console.log('=== FIN AVEC ERREUR NON GÉRÉE loadMatieres() ===');
    }
  }

  // Charger la liste des classes
  loadClasses(): void {
    console.log('Début du chargement des classes...');
    this.isLoadingClasses = true;
    this.classeService.getClasses().subscribe({
      next: (classes) => {
        console.log('Classes chargées avec succès:', classes);
        this.classes = classes;
        this.isLoadingClasses = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des classes:', error);
        this.errorMessage = 'Erreur lors du chargement des classes';
        this.isLoadingClasses = false;
      },
      complete: () => {
        console.log('Chargement des classes terminé');
      }
    });
  }

  // Charger les données initiales
  loadInitialData(): void {
    this.isLoading = true;
    this.enseignantService.getEnseignants().subscribe({
      next: (response: any) => {
        // Vérifier si la réponse contient une propriété 'data' et l'utiliser, sinon utiliser la réponse directement
        const data = response.data || response || [];
        
        // Trier les enseignants par nom
        this.enseignants = data.sort((a: Enseignant, b: Enseignant) => 
          (a.nom_complet || '').localeCompare(b.nom_complet || '')
        );
        
        // Initialiser l'état des cartes dépliables
        this.enseignants.forEach(ens => {
          if (ens.id) {
            this.expandedCards[ens.id] = false;
          }
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des enseignants:', error);
        this.errorMessage = 'Erreur lors du chargement des enseignants. Veuillez réessayer.';
        this.isLoading = false;
        
        // Données de test en cas d'erreur
        setTimeout(() => {
          if (this.enseignants.length === 0) {
            this.enseignants = [
              { id: 1, user_id: 101, nom_complet: 'M. Jean Dupont' },
              { id: 2, user_id: 102, nom_complet: 'Mme Marie Martin' },
              { id: 3, user_id: 103, nom_complet: 'M. Pierre Durand' },
              { id: 4, user_id: 104, nom_complet: 'Mme Sophie Bernard' },
              { id: 5, user_id: 105, nom_complet: 'M. Paul Moreau' }
            ].sort((a: Enseignant, b: Enseignant) => a.nom_complet.localeCompare(b.nom_complet));
          }
        }, 100);
      }
    });
  }

  // Filtrer les enseignants selon la recherche
  get filteredEnseignants(): Enseignant[] {
    if (!this.searchTerm.trim()) return this.enseignants;
    const term = this.searchTerm.toLowerCase().trim();
    return this.enseignants.filter(ens => {
      // Vérifier si le nom complet correspond
      const nomMatch = ens.nom_complet.toLowerCase().includes(term);
      
      // Vérifier si l'ID utilisateur correspond (seulement si user_id n'est pas null)
      const userIdMatch = ens.user_id !== null && 
                         ens.user_id.toString().toLowerCase().includes(term);
      
      return nomMatch || userIdMatch;
    });
  }

  // Pagination
  get paginatedEnseignants(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEnseignants.slice(start, start + this.itemsPerPage);
  }

  // Basculer l'affichage des détails d'un enseignant
  toggleDetails(enseignantId: number): void {
    if (this.expandedCards[enseignantId] === undefined) {
      this.expandedCards[enseignantId] = true;
      this.loadEnseignantDetails(enseignantId);
    } else {
      this.expandedCards[enseignantId] = !this.expandedCards[enseignantId];
    }
  }

  // Charger les détails d'un enseignant
  loadEnseignantDetails(enseignantId: number): void {
    if (this.isLoadingDetails[enseignantId]) return;
    
    this.isLoadingDetails[enseignantId] = true;
    this.enseignantService.getEnseignant(enseignantId).subscribe({
      next: (response: any) => {
        const data = response.data || response;
        const index = this.enseignants.findIndex(e => e.id === enseignantId);
        if (index !== -1) {
          // Mettre à jour les enseignements de l'enseignant
          this.enseignants[index] = { 
            ...this.enseignants[index], 
            enseignements: data.enseignements || [] 
          };
        }
        this.isLoadingDetails[enseignantId] = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails de l\'enseignant:', error);
        this.isLoadingDetails[enseignantId] = false;
      }
    });
  }

  // Obtenir les matières uniques d'un enseignant
  getMatieresUniques(enseignant: Enseignant & { enseignements?: any[] }): string[] {
    if (!enseignant.enseignements || enseignant.enseignements.length === 0) return [];
    
    const matieres = new Set<string>();
    enseignant.enseignements.forEach(ens => {
      if (ens.matiere?.nom) {
        matieres.add(ens.matiere.nom);
      }
    });
    
    return Array.from(matieres);
  }
  
  // Obtenir les classes uniques pour une matière d'un enseignant
  getClassesParMatiere(enseignant: Enseignant & { enseignements?: any[] }, matiereNom: string): string[] {
    if (!enseignant.enseignements || enseignant.enseignements.length === 0) return [];
    
    const classes = new Set<string>();
    enseignant.enseignements.forEach(ens => {
      if (ens.matiere?.nom === matiereNom && ens.classe?.nom) {
        const niveau = ens.classe.niveau ? ` (${ens.classe.niveau})` : '';
        classes.add(`${ens.classe.nom}${niveau}`);
      }
    });
    
    return Array.from(classes);
  }

  // Changer de page
  changePage(page: number): void {
    this.currentPage = page;
  }

  // Nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.filteredEnseignants.length / this.itemsPerPage);
  }

  // Ouvrir le formulaire d'ajout
  openAddForm(): void {
    this.isEditing = false;
    this.selectedEnseignant = null;
    this.resetForm();
    this.showModal = true; // Afficher la modal
    console.log('Modal ouverte pour ajout d\'enseignant');
  }

  // Ouvrir le formulaire d'édition
  openEditForm(enseignant: Enseignant): void {
    this.isEditing = true;
    this.selectedEnseignant = enseignant;
    this.enseignantForm = { ...enseignant };
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.enseignantForm = {
      id: 0,
      user_id: 0,
      nom_complet: ''
    };
    this.selectedMatiereId = 0;
    this.selectedClasseId = 0;
  }

  // Soumettre le formulaire (ajout ou édition)
  onSubmit(): void {
    if (this.isEditing && this.selectedEnseignant?.id) {
      this.updateEnseignant(this.selectedEnseignant.id);
    } else {
      this.createEnseignant();
    }
  }

  // Créer un nouvel enseignant
  createEnseignant(): void {
    console.log('=== DÉBUT DE LA CRÉATION D\'UN ENSEIGNANT ===');
    
    // Validation du formulaire
    if (!this.enseignantForm.nom_complet || this.enseignantForm.nom_complet.trim() === '') {
      console.error('Erreur de validation: Nom complet manquant');
      this.errorMessage = 'Veuillez saisir un nom complet pour l\'enseignant';
      this.hideMessages(5000);
      return;
    }

    if (!this.selectedMatiereId || !this.selectedClasseId || this.selectedMatiereId <= 0 || this.selectedClasseId <= 0) {
      console.error('Erreur de validation: Matière ou classe non sélectionnée');
      this.errorMessage = 'Veuillez sélectionner une matière et une classe valides';
      this.hideMessages(5000);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    // Préparer les données de l'enseignant avec les informations de matière et de classe
    // pour la création transactionnelle côté serveur
    const newEnseignant = { 
      nom_complet: this.enseignantForm.nom_complet.trim(),
      matiere_id: this.selectedMatiereId,
      classe_id: this.selectedClasseId
    } as any; // Utilisation de 'as any' pour éviter les erreurs de typage
    
    // Ajouter user_id uniquement s'il a une valeur
    if (this.enseignantForm.user_id) {
      newEnseignant.user_id = this.enseignantForm.user_id;
    }
    
    console.log('Données de l\'enseignant à envoyer:', JSON.stringify(newEnseignant, null, 2));
    
    console.log('Envoi de la requête POST à l\'API pour créer l\'enseignant...');
    
    // Créer l'enseignant avec l'association matière/classe en une seule requête
    this.enseignantService.addEnseignant(newEnseignant).subscribe({
      next: (response: any) => {
        console.log('Réponse de l\'API (création enseignant):', response);
        
        // Vérifier si la réponse contient une propriété 'data' (format standardisé)
        const createdEnseignant = response.data || response;
        console.log('Enseignant créé avec succès avec son enseignement associé:', createdEnseignant);
        
        if (!createdEnseignant || !createdEnseignant.id) {
          throw new Error('La réponse du serveur ne contient pas d\'ID d\'enseignant valide');
        }
        
        // Mettre à jour l'affichage avec le nouvel enseignant
        this.enseignants.push(createdEnseignant);
        this.enseignants.sort((a, b) => a.nom_complet.localeCompare(b.nom_complet));
        
        this.successMessage = 'Enseignant et enseignement associés avec succès';
        this.resetForm();
        this.isLoading = false;
        this.hideMessages(3000);
        this.showModal = false;
        
        // Recharger les données pour s'assurer que tout est à jour
        console.log('Rechargement des données après création réussie...');
        this.loadInitialData();
      },
      error: (error: any) => {
        console.error('ERREUR lors de la création de l\'enseignant:', {
          error: error,
          status: error.status,
          message: error.message,
          errorDetails: error.error
        });
        
        let errorMessage = 'Une erreur est survenue lors de la création de l\'enseignant.';
        
        // Personnaliser le message d'erreur en fonction du type d'erreur
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
          if (error.error.errors) {
            errorMessage += ' Détails: ' + JSON.stringify(error.error.errors);
          }
        } else if (error.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet.';
        } else if (error.status === 409) {
          errorMessage = 'Un enseignant avec ce nom existe déjà.';
        } else if (error.status === 422) {
          errorMessage = 'Données de validation invalides. Veuillez vérifier les informations saisies.';
          if (error.error.errors) {
            errorMessage += ' Détails: ' + JSON.stringify(error.error.errors);
          }
        }
        
        console.error('Message d\'erreur affiché à l\'utilisateur:', errorMessage);
        this.errorMessage = errorMessage;
        this.isLoading = false;
        this.hideMessages(10000); // Message plus long pour permettre la lecture des détails
        
        // Recharger les données pour s'assurer de la cohérence
        this.loadInitialData();
      }
    });
    
    console.log('=== FIN DE LA FONCTION createEnseignant() ===');
  }

  // Mettre à jour un enseignant
  updateEnseignant(id: number): void {
    this.isLoading = true;
    this.enseignantService.updateEnseignant(id, this.enseignantForm).subscribe({
      next: () => {
        const index = this.enseignants.findIndex(e => e.id === id);
        if (index !== -1) {
          this.enseignants[index] = { ...this.enseignantForm };
          this.enseignants.sort((a, b) => a.nom_complet.localeCompare(b.nom_complet));
        }
        this.successMessage = 'Enseignant modifié avec succès';
        this.resetForm();
        this.isLoading = false;
        this.hideMessages();
      },
      error: (error) => {
        console.error('Erreur lors de la modification de l\'enseignant:', error);
        this.errorMessage = 'Erreur lors de la modification de l\'enseignant. Veuillez réessayer.';
        this.isLoading = false;
        this.hideMessages(5000);
      }
    });
  }

  // Supprimer un enseignant
  deleteEnseignant(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      this.isLoading = true;
      this.enseignantService.deleteEnseignant(id).subscribe({
        next: () => {
          this.enseignants = this.enseignants.filter(e => e.id !== id);
          this.successMessage = 'Enseignant supprimé avec succès';
          this.isLoading = false;
          this.hideMessages(3000);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'enseignant:', error);
          this.errorMessage = 'Erreur lors de la suppression de l\'enseignant. Veuillez réessayer.';
          this.isLoading = false;
          this.hideMessages(5000);
        }
      });
    }
  }

  // Cacher les messages après un délai
  private hideMessages(delay: number = 3000): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, delay);
  }

  // Annuler l'édition
  cancelEdit(): void {
    this.resetForm();
    this.selectedEnseignant = null;
    this.isEditing = false;
    this.showModal = false; // Fermer la modal
  }
} 