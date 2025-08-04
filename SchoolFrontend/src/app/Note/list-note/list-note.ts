import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { NoteService, NoteDetaillee } from '../../Service/note.service';
// Installation requise : npm install xlsx @types/xlsx

interface EleveWithNotes {
  id: number;
  nom: string;
  prenom: string;
  matricule?: string;
  date_naissance?: string;
  classe: {
    id: number;
    nom: string;
    niveau: string;
  };
  parent?: {
    id: number;
    nom: string;
    prenom: string;
    email?: string;
    telephone?: string;
  };
  notes: NoteDetaillee[];
  appreciation?: string;
  rang?: number;
}

interface MatiereNotes {
  matiere: {
    id: number;
    nom: string;
    coefficient: number;
    enseignant?: {
      id: number;
      nom: string;
      prenom: string;
    };
  };
  notes: NoteDetaillee[];
}

@Component({
  selector: 'app-list-note',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NgbPaginationModule, 
    NgbTooltipModule, 
    RouterModule,
    DatePipe
  ],
  templateUrl: './list-note.html',
  styleUrls: ['./list-note.css']
})
export class ListNote implements OnInit {
  // Données
  notes: NoteDetaillee[] = [];
  elevesNotes: EleveWithNotes[] = [];
  filteredEleves: EleveWithNotes[] = [];

  // Filtres
  searchTerm: string = '';
  selectedTrimestre: number = 1;

  // Pagination
  page = 1;
  pageSize = 20; // Augmenté pour afficher plus d'élèves par page
  collectionSize = 0;

  // Date actuelle pour le pied de page
  today = new Date();

  // Méthode pour calculer la plage d'affichage
  get displayRange(): { start: number, end: number } {
    const start = (this.page - 1) * this.pageSize + 1;
    const end = Math.min(this.page * this.pageSize, this.collectionSize);
    return { start, end };
  }

  // Getter pour les élèves paginés
  get paginatedEleves(): EleveWithNotes[] {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredEleves.slice(start, end);
  }

  // Chargement
  isLoading = false;
  errorMessage = '';

  constructor(
    private noteService: NoteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.loadNotes();
  }

  loadNotes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('=== DÉBUT DU CHARGEMENT DES NOTES ===');
    console.log('URL de l\'API:', this.noteService['REST_API']);

    this.noteService.getNotes().subscribe({
      next: (notes) => {
        console.log('=== RÉPONSE DE L\'API ===');
        console.log('Type de données reçues:', typeof notes);
        console.log('Données brutes reçues:', notes);
        
        this.notes = Array.isArray(notes) ? notes : [];
        console.log('Nombre de notes chargées:', this.notes.length);
        
        if (this.notes.length > 0) {
          console.log('Première note:', this.notes[0]);
        }
        
        this.groupNotesByEleve();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('=== ERREUR LORS DU CHARGEMENT ===');
        console.error('Erreur complète:', err);
        console.error('Statut HTTP:', err.status);
        console.error('Message d\'erreur:', err.message);
        console.error('Erreur complète:', JSON.stringify(err, null, 2));
        
        this.errorMessage = 'Erreur lors du chargement des notes: ' + (err.message || 'Erreur inconnue');
        if (err.error) {
          console.error('Détails de l\'erreur:', err.error);
          if (err.error.error) {
            this.errorMessage += ' - ' + err.error.error;
          }
          if (err.error.details) {
            this.errorMessage += ' - ' + err.error.details;
          }
        }
        this.isLoading = false;
      }
    });
  }

  // Grouper les notes par élève
  groupNotesByEleve(): void {
    console.log('=== DÉBUT groupNotesByEleve ===');
    console.log('Nombre de notes à traiter:', this.notes.length);
    
    const elevesMap = new Map<number, EleveWithNotes>();
    
    this.notes.forEach((note, index) => {
      console.log(`\n--- Note ${index + 1} ---`);
      console.log('Note complète:', JSON.stringify(note, null, 2));
      
      if (!note) {
        console.log('Note est null ou undefined');
        return;
      }
      
      if (!note.eleve) {
        console.log('Note sans élève associé');
        return;
      }
      
      const eleveId = note.eleve.id;
      console.log('ID de l\'élève:', eleveId);
      
      if (!elevesMap.has(eleveId)) {
        console.log('Nouvel élève détecté, création de l\'entrée');
        const eleveData: any = { ...note.eleve };
        
        elevesMap.set(eleveId, {
          id: eleveId,
          nom: eleveData.nom || '',
          prenom: eleveData.prenom || '',
          matricule: eleveData.matricule,
          date_naissance: eleveData.date_naissance,
          classe: {
            id: eleveData.classe?.id || 0,
            nom: eleveData.classe?.nom || 'Non défini',
            niveau: eleveData.classe?.niveau || ''
          },
          parent: note.parent ? { 
            id: note.parent.id,
            nom: note.parent.nom || '',
            prenom: note.parent.prenom || '',
            email: (note.parent as any).email,
            telephone: (note.parent as any).telephone
          } : undefined,
          notes: []
        });
      }
      
      const eleve = elevesMap.get(eleveId);
      if (eleve) {
        console.log('Ajout de la note à l\'élève:', eleve.nom, eleve.prenom);
        eleve.notes.push(note);
      }
    });

    this.elevesNotes = Array.from(elevesMap.values());
    console.log('=== FIN groupNotesByEleve ===');
    console.log('Nombre d\'élèves avec notes:', this.elevesNotes.length);
    console.log('Détail des élèves:', JSON.stringify(this.elevesNotes, null, 2));
    
    this.applyFilters();
  }

  // Appliquer les filtres
  applyFilters(): void {
    // Ne pas filtrer, afficher tous les élèves
    this.filteredEleves = [...this.elevesNotes];
    this.collectionSize = this.filteredEleves.length;
    this.page = 1;
    this.page = 1; // Réinitialiser à la première page
  }



  // Gestion du changement de recherche
  onSearchChange(): void {
    this.applyFilters();
  }

  // La méthode onEleveChange a été supprimée car elle n'est plus nécessaire
  // avec le nouveau système de recherche par texte

  // Méthodes utilitaires pour les calculs
  
  // Convertit une valeur de note en nombre de manière sécurisée
  safeNoteValue(noteValue: any): number | null {
    if (noteValue === null || noteValue === undefined || noteValue === '') {
      return null;
    }
    const num = Number(noteValue);
    return isNaN(num) ? null : num;
  }

  // Retourne la classe CSS appropriée pour une note
  getNoteClass(noteValue: any): string {
    const value = this.safeNoteValue(noteValue);
    if (value === null) return 'border border-2';
    
    if (value >= 10) return 'bg-success bg-opacity-10 text-success border border-2';
    if (value >= 8) return 'bg-warning bg-opacity-10 text-warning border border-2';
    return 'bg-danger bg-opacity-10 text-danger border border-2';
  }
  calculateMoyenneMatiere(notes: NoteDetaillee[]): number {
    if (!notes || notes.length === 0) return 0;
    
    // Filtrer les notes valides et les convertir en nombres
    const validNotes = notes
      .filter(note => note && note.valeur_note)
      .map(note => {
        // Convertir la note en nombre, en gérant les virgules comme séparateurs décimaux
        const noteStr = note.valeur_note.toString().replace(',', '.');
        return parseFloat(noteStr) || 0;
      })
      .filter(note => !isNaN(note) && isFinite(note)); // S'assurer que c'est un nombre valide
    
    if (validNotes.length === 0) return 0;
    
    // Calculer la moyenne
    const sum = validNotes.reduce((acc, note) => acc + note, 0);
    return parseFloat((sum / validNotes.length).toFixed(2));
  }

  calculateMoyenneGenerale(eleve: EleveWithNotes): number {
    if (!eleve.notes || eleve.notes.length === 0) return 0;
    
    const matieresNotes = this.groupNotesByMatiere(eleve.notes);
    let totalPondere = 0;
    let totalCoefficients = 0;

    matieresNotes.forEach(matiereNotes => {
      const moyenneMatiere = this.calculateMoyenneMatiere(matiereNotes.notes);
      totalPondere += moyenneMatiere * matiereNotes.matiere.coefficient;
      totalCoefficients += matiereNotes.matiere.coefficient;
    });

    return totalCoefficients > 0 ? totalPondere / totalCoefficients : 0;
  }

  getTotalCoefficients(notes: NoteDetaillee[]): number {
    if (!notes || notes.length === 0) return 0;
    const matieresUniques = new Set<number>();
    notes.forEach(note => matieresUniques.add(note.matiere.id));
    return matieresUniques.size;
  }

  getAppreciation(moyenne: number): string {
    if (moyenne >= 16) return 'Excellent';
    if (moyenne >= 14) return 'Très bien';
    if (moyenne >= 12) return 'Bien';
    if (moyenne >= 10) return 'Assez bien';
    if (moyenne >= 8) return 'Insuffisant';
    return 'Très insuffisant';
  }

  groupNotesByMatiere(notes: NoteDetaillee[]): MatiereNotes[] {
    const matieresMap = new Map<number, MatiereNotes>();
    
    if (!notes || !Array.isArray(notes)) {
      return [];
    }

    notes.forEach(note => {
      if (note && note.matiere) {
        if (!matieresMap.has(note.matiere.id)) {
          matieresMap.set(note.matiere.id, {
            matiere: {
              id: note.matiere.id,
              nom: note.matiere.nom,
              coefficient: note.matiere.coefficient || 1,
              enseignant: note.matiere.enseignant ? { 
                id: note.matiere.enseignant.id,
                nom: note.matiere.enseignant.nom || '',
                prenom: note.matiere.enseignant.prenom || ''
              } : undefined
            },
            notes: []
          });
        }
        matieresMap.get(note.matiere.id)?.notes.push(note);
      }
    });

    return Array.from(matieresMap.values());
  }

  getCurrentTrimestre(): string {
    switch (this.selectedTrimestre) {
      case 1: return '1er Trimestre';
      case 2: return '2ème Trimestre';
      case 3: return '3ème Trimestre';
      default: return '';
    }
  }

  // Gestion des actions
  ajouterNote(eleveId: number, matiereId: number): void {
    if (eleveId && matiereId) {
      this.router.navigate(['/notes/ajouter'], { 
        queryParams: { 
          eleveId: eleveId,
          matiereId: matiereId
        } 
      });
    }
  }

  voirDetailsMatiere(eleve: EleveWithNotes, matiere: any): void {
    this.router.navigate(['/notes/eleve', eleve.id, 'matiere', matiere.id]);
  }

  voirBulletin(eleve: EleveWithNotes): void {
    this.router.navigate(['/bulletins/eleve', eleve.id]);
  }

  contacterParent(eleve: EleveWithNotes): void {
    if (eleve.parent?.email || eleve.parent?.telephone) {
      // Ouvrir une modale ou une page de contact
      console.log('Contacter le parent:', eleve.parent);
    } else {
      alert('Aucune information de contact disponible pour ce parent');
    }
  }

  /**
   * Affiche le bulletin complet d'un élève
   * @param eleve L'élève dont on veut voir le bulletin
   */
  voirBulletinComplet(eleve: EleveWithNotes): void {
    if (eleve.id) {
      // Vérifier si l'élève a déjà un bulletin généré
      // Ici, vous pourriez ajouter une vérification supplémentaire
      // pour voir si un bulletin existe déjà pour cet élève, ce trimestre et cette année scolaire
      
      // Pour l'instant, on redirige simplement vers la page de génération du bulletin
      // avec les paramètres nécessaires
      this.router.navigate(['/bulletins/generer'], {
        queryParams: {
          eleveId: eleve.id,
          trimestre: this.selectedTrimestre,
          // Ajoutez d'autres paramètres nécessaires comme l'année scolaire
        }
      });
    } else {
      console.error('Impossible de générer le bulletin : ID élève manquant');
      alert('Impossible de générer le bulletin : informations manquantes');
    }
  }

  exportToExcel(): void {
    // Désactiver temporairement l'export Excel car nécessite l'installation de xlsx
    alert('L\'export Excel nécessite l\'installation du package xlsx. Exécutez: npm install xlsx @types/xlsx');
    
    /* Code commenté jusqu'à installation de xlsx
    const data = this.filteredEleves.map(eleve => ({
      'Matricule': eleve.matricule || '',
      'Nom': eleve.nom,
      'Prénom': eleve.prenom,
      'Classe': `${eleve.classe.nom} (${eleve.classe.niveau})`,
      'Moyenne Générale': this.calculateMoyenneGenerale(eleve).toFixed(2),
      'Appréciation': this.getAppreciation(this.calculateMoyenneGenerale(eleve)),
      'Rang': eleve.rang || 'N/A'
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Notes_Élèves');
    
    // Générer le fichier Excel
    XLSX.writeFile(wb, `notes_eleves_${new Date().toISOString().split('T')[0]}.xlsx`);
    */
  }
}