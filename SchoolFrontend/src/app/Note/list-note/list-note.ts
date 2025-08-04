import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { NoteService, NoteDetaillee } from '../../Service/note.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
// Import dynamique de JSZip
let JSZip: any;

// Fonction pour charger JSZip de manière asynchrone
async function loadJSZip() {
  if (!JSZip) {
    const module = await import('jszip');
    JSZip = module.default;
  }
  return JSZip;
}
// Installation requise : npm install xlsx @types/xlsx jspdf html2canvas

interface EleveWithNotes {
  id: number;
  nom: string;
  prenom: string;
  matricule?: string;
  date_naissance?: string;
  updatedAt?: string | Date;
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
  // Référence à l'élément HTML du bulletin pour le téléchargement PDF
  @ViewChild('bulletinContent') bulletinContent!: ElementRef;
  
  // Données
  notes: NoteDetaillee[] = [];
  elevesNotes: EleveWithNotes[] = [];
  filteredEleves: EleveWithNotes[] = [];

  // Filtres
  searchTerm: string = '';
  selectedTrimestre: number = 1;

  // Date actuelle pour le pied de page
  today = new Date();

  // Chargement
  isLoading = false;
  isDownloadingAll = false;
  errorMessage = '';

  /**
   * Affiche les détails d'un élève
   * @param eleve L'élève dont on veut afficher les détails
   */
  voirDetails(eleve: EleveWithNotes): void {
    const detailsElement = document.getElementById(`details-${eleve.id}`);
    if (detailsElement) {
      // Masquer d'abord tous les autres détails ouverts
      document.querySelectorAll('[id^="details-"]').forEach(el => {
        if (el.id !== `details-${eleve.id}`) {
          (el as HTMLElement).style.display = 'none';
        }
      });
      
      // Afficher ou masquer les détails de l'élève sélectionné
      if (detailsElement.style.display === 'none') {
        detailsElement.style.display = 'block';
      } else {
        detailsElement.style.display = 'none';
      }
    }
  }

  /**
   * Ferme les détails d'un élève
   * @param eleve L'élève dont on veut fermer les détails
   */
  fermerDetails(eleve: EleveWithNotes): void {
    const detailsElement = document.getElementById(`details-${eleve.id}`);
    if (detailsElement) {
      detailsElement.style.display = 'none';
    }
  }

  // Propriétés pour la modale de bulletin
  showBulletinModal = false;
  selectedEleveForBulletin: EleveWithNotes | null = null;

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
  }



  // Gestion du changement de recherche
  onSearchChange(): void {
    this.applyFilters();
  }

  // La méthode onEleveChange a été supprimée car elle n'est plus nécessaire
  // avec le nouveau système de recherche par texte

  // Méthode pour afficher les données dans la console
  logToConsole(): void {
    console.log('=== DONNÉES DES ÉLÈVES ===');
    console.log('Nombre d\'élèves:', this.elevesNotes.length);
    console.log('Détail des élèves:', this.elevesNotes);
    
    if (this.elevesNotes.length > 0) {
      console.log('\n=== DÉTAIL DU PREMIER ÉLÈVE ===');
      console.log('Nom:', this.elevesNotes[0].nom, this.elevesNotes[0].prenom);
      console.log('Nombre de notes:', this.elevesNotes[0].notes?.length || 0);
      console.log('Détail des notes:', this.elevesNotes[0].notes);
    }
    
    console.log('\n=== DONNÉES BRUTES ===');
    console.log('Notes brutes:', this.notes);
  }

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
    if (value === null) return '';
    
    if (value >= 16) return 'note-excellente';
    if (value >= 14) return 'note-bonne';
    if (value >= 12) return 'note-moyenne';
    if (value >= 10) return 'note-faible';
    return 'note-insuffisante';
  }

  // Retourne la classe CSS appropriée pour une moyenne
  getMoyenneClass(moyenne: number): string {
    if (moyenne >= 16) return 'note-excellente';
    if (moyenne >= 14) return 'note-bonne';
    if (moyenne >= 12) return 'note-moyenne';
    if (moyenne >= 10) return 'note-faible';
    return 'note-insuffisante';
  }

  // Méthode pour calculer la moyenne d'une matière
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

  /**
   * Calcule la moyenne générale d'un élève
   * @param eleve L'élève dont on veut calculer la moyenne générale
   * @returns La moyenne générale de l'élève
   */
  getMoyenneGenerale(eleve: EleveWithNotes): number {
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

  /**
   * Retourne le libellé du trimestre actuellement sélectionné
   * @returns Le libellé du trimestre (ex: "1er Trimestre", "2ème Trimestre", etc.)
   */
  getCurrentTrimestre(): string {
    switch (this.selectedTrimestre) {
      case 1:
        return '1er Trimestre';
      case 2:
        return '2ème Trimestre';
      case 3:
        return '3ème Trimestre';
      default:
        return `${this.selectedTrimestre}ème Trimestre`;
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
  /**
   * Ouvre la modale de bulletin pour un élève
   * @param eleve L'élève dont on veut voir le bulletin
   */
  voirBulletinComplet(eleve: EleveWithNotes): void {
    if (eleve) {
      this.selectedEleveForBulletin = eleve;
      this.showBulletinModal = true;
      // Forcer la mise à jour de la vue
      setTimeout(() => {
        this.scrollToTop();
      }, 100);
    } else {
      console.error('Impossible d\'afficher le bulletin : informations manquantes');
      alert('Impossible d\'afficher le bulletin : informations manquantes');
    }
  }

  /**
   * Ferme la modale de bulletin
   */
  fermerBulletin(): void {
    this.showBulletinModal = false;
    this.selectedEleveForBulletin = null;
  }

  /**
   * Fait défiler la page vers le haut
   */
  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Télécharge le bulletin au format PDF
   */

  // Méthode pour obtenir la couleur en fonction de la moyenne
  getMoyenneColor(moyenne: number): string {
    if (moyenne >= 16) return '#0A81A2'; // Excellent
    if (moyenne >= 14) return '#94C8BD'; // Très bien
    if (moyenne >= 12) return '#F8C7B0'; // Bien
    if (moyenne >= 10) return '#F09CA5'; // Assez bien
    return '#094A5C'; // Insuffisant
  }

  // Méthode pour obtenir la couleur de fond de l'appréciation
  getAppreciationColor(moyenne: number): string {
    if (moyenne >= 16) return '#94C8BD'; // Excellent
    if (moyenne >= 14) return '#F8C7B0'; // Très bien
    if (moyenne >= 12) return '#F09CA5'; // Bien
    if (moyenne >= 10) return '#F8C7B0'; // Assez bien
    return '#094A5C'; // Insuffisant
  }

  // Méthode pour obtenir une appréciation détaillée
  getDetailedAppreciation(moyenne: number): string {
    if (moyenne >= 16) return 'Excellent travail, félicitations pour vos excellents résultats !';
    if (moyenne >= 14) return 'Très bon travail, continuez vos efforts !';
    if (moyenne >= 12) return 'Bon travail, vous pouvez encore progresser.';
    if (moyenne >= 10) return 'Résultats satisfaisants, mais des efforts restent à fournir.';
    return 'Des difficultés importantes, un travail sérieux de remise à niveau est nécessaire.';
  }

  // Méthode pour obtenir le rang dans une matière spécifique
  getRangMatiere(matiereId: number): string {
    // Implémentez la logique pour obtenir le rang dans la matière
    // Par exemple, trier les élèves par note dans cette matière et retourner le rang
    return '1er'; // Valeur factice pour l'exemple
  }

  // Méthode pour obtenir le rang général
  getRangGeneral(): string {
    // Implémentation simplifiée - à adapter selon la logique de votre application
    return '1er/50';
  }

  /**
   * Retourne la mention d'un élève en fonction de sa moyenne générale
   * @param eleve L'élève dont on veut la mention
   * @returns La mention (Très Bien, Bien, etc.)
   */
  getMention(eleve: EleveWithNotes): string {
    const moyenne = this.getMoyenneGenerale(eleve);
    
    if (moyenne >= 16) return 'Très Bien';
    if (moyenne >= 14) return 'Bien';
    if (moyenne >= 12) return 'Assez Bien';
    if (moyenne >= 10) return 'Passable';
    return 'Insuffisant';
  }

  // Méthode pour exporter les données des élèves vers Excel
  exportToExcel(): void {
    // Vérifier si la bibliothèque XLSX est disponible
    if (typeof XLSX === 'undefined') {
      alert('La fonctionnalité d\'export Excel nécessite l\'installation du package xlsx. Exécutez: npm install xlsx @types/xlsx');
      return;
    }

    try {
      // Préparer les données pour l'export
      const data = this.filteredEleves.map(eleve => {
        const moyenne = this.getMoyenneGenerale(eleve);
        return {
          'Matricule': eleve.matricule || '',
          'Nom': eleve.nom,
          'Prénom': eleve.prenom,
          'Classe': `${eleve.classe.nom} (${eleve.classe.niveau})`,
          'Moyenne Générale': moyenne.toFixed(2),
          'Appréciation': this.getAppreciation(moyenne),
          'Rang': eleve.rang || 'N/A'
        };
      });

      // Créer une feuille de calcul
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Créer un classeur et ajouter la feuille de calcul
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Notes des élèves');
      
      // Générer le fichier Excel
      XLSX.writeFile(workbook, `notes-eleves-${new Date().toISOString().slice(0, 10)}.xlsx`);
      
    } catch (error) {
      console.error('Erreur lors de l\'export Excel :', error);
      alert('Une erreur est survenue lors de l\'export Excel. Veuillez consulter la console pour plus de détails.');
    }
  }

  // Méthode pour télécharger le bulletin en PDF
  async telechargerBulletinPdf() {
    if (!this.selectedEleveForBulletin) return;
    
    // Afficher un message de chargement
    const loadingMessage = document.createElement('div');
    loadingMessage.textContent = 'Génération du PDF en cours...';
    loadingMessage.style.position = 'fixed';
    loadingMessage.style.top = '50%';
    loadingMessage.style.left = '50%';
    loadingMessage.style.transform = 'translate(-50%, -50%)';
    loadingMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    loadingMessage.style.color = 'white';
    loadingMessage.style.padding = '15px 30px';
    loadingMessage.style.borderRadius = '5px';
    loadingMessage.style.zIndex = '9999';
    document.body.appendChild(loadingMessage);

    try {
      // Récupérer l'élément du contenu du bulletin
      const element = this.bulletinContent.nativeElement;
      
      // Créer un clone de l'élément pour la capture
      const elementToPrint = element.cloneNode(true);
      
      // Masquer les boutons d'action dans le clone
      const buttons = elementToPrint.querySelectorAll('button');
      buttons.forEach((button: HTMLElement) => {
        button.style.display = 'none';
      });
      
      // Créer un conteneur temporaire pour le clone
      const printContainer = document.createElement('div');
      printContainer.style.position = 'fixed';
      printContainer.style.left = '-9999px';
      printContainer.appendChild(elementToPrint);
      document.body.appendChild(printContainer);
      
      // Capturer le contenu avec html2canvas
      const canvas = await html2canvas(elementToPrint as HTMLElement, {
        scale: 2, // Augmenter la qualité
        logging: false,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: elementToPrint.scrollWidth,
        windowHeight: elementToPrint.scrollHeight
      });
      
      // Nettoyer le conteneur temporaire
      document.body.removeChild(printContainer);
      
      // Créer un nouveau PDF avec la bonne orientation et taille
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculer les dimensions pour ajuster l'image au format A4
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Ajouter l'image au PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Télécharger le PDF
      const fileName = `bulletin_${this.selectedEleveForBulletin.nom}_${this.selectedEleveForBulletin.prenom}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF :', error);
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      // Supprimer le message de chargement
      if (document.body.contains(loadingMessage)) {
        document.body.removeChild(loadingMessage);
      }
    }
  }

  /**
   * Télécharge les bulletins de tous les élèves en un seul fichier ZIP
   */
  async telechargerTousLesBulletins(): Promise<void> {
    if (!this.filteredEleves || this.filteredEleves.length === 0) {
      alert('Aucun élève à télécharger');
      return;
    }

    // Demander confirmation avant de lancer le téléchargement
    const confirmation = confirm(`Voulez-vous vraiment télécharger les bulletins des ${this.filteredEleves.length} élèves ? Cela peut prendre quelques instants.`);
    if (!confirmation) {
      return;
    }

    this.isDownloadingAll = true;
    let progressDialog: HTMLElement | null = null;
    let cancelled = false;
    let successCount = 0;
    const failedEleves: string[] = [];
    
    try {
      // Charger JSZip de manière asynchrone
      const JSZip = await loadJSZip();
      
      if (!JSZip) {
        throw new Error('Impossible de charger la bibliothèque de compression');
      }

      const zip = new JSZip();
      
      // Créer un dossier pour stocker les bulletins
      const bulletinsFolder = zip.folder('bulletins');
      if (!bulletinsFolder) {
        throw new Error('Impossible de créer le dossier des bulletins');
      }

      // Afficher une boîte de dialogue de progression
      const progressDialog = document.createElement('div');
      progressDialog.style.position = 'fixed';
      progressDialog.style.top = '50%';
      progressDialog.style.left = '50%';
      progressDialog.style.transform = 'translate(-50%, -50%)';
      progressDialog.style.backgroundColor = 'white';
      progressDialog.style.padding = '20px';
      progressDialog.style.borderRadius = '8px';
      progressDialog.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      progressDialog.style.zIndex = '9999';
      progressDialog.style.textAlign = 'center';
      progressDialog.innerHTML = `
        <h4 style="margin-top: 0;">Génération des bulletins</h4>
        <div class="progress mb-3">
          <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated" 
               role="progressbar" style="width: 0%; height: 20px;" 
               aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
        </div>
        <p id="progressText">Préparation du téléchargement...</p>
        <button id="cancelBtn" class="btn btn-sm btn-outline-danger">Annuler</button>
      `;
      document.body.appendChild(progressDialog);
      
      // Gestion de l'annulation
      let cancelled = false;
      document.getElementById('cancelBtn')?.addEventListener('click', () => {
        cancelled = true;
        this.isDownloadingAll = false;
        progressDialog.remove();
      });

      // Mettre à jour la progression
      const updateProgress = (current: number, total: number, message: string) => {
        const progress = Math.round((current / total) * 100);
        const progressBar = document.getElementById('progressBar') as HTMLElement;
        const progressText = document.getElementById('progressText') as HTMLElement;
        
        if (progressBar) {
          progressBar.style.width = `${progress}%`;
          progressBar.setAttribute('aria-valuenow', progress.toString());
          progressBar.textContent = `${progress}%`;
        }
        
        if (progressText) {
          progressText.textContent = message;
        }
      };

      // Télécharger chaque bulletin un par un
      for (let i = 0; i < this.filteredEleves.length; i++) {
        if (cancelled) break;
        
        const eleve = this.filteredEleves[i];
        updateProgress(i, this.filteredEleves.length, 
          `Génération du bulletin pour ${eleve.prenom} ${eleve.nom} (${i+1}/${this.filteredEleves.length})`);
        
        try {
          // Générer le bulletin pour l'élève actuel
          this.selectedEleveForBulletin = eleve;
          
          // Attendre un court instant pour que la vue soit mise à jour
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Vérifier si l'élément bulletinContent existe
          if (!this.bulletinContent || !this.bulletinContent.nativeElement) {
            console.error('Élément bulletinContent non trouvé dans le DOM');
            throw new Error('Impossible de trouver le contenu du bulletin');
          }
          
          // Afficher la modale avant de capturer
          this.showBulletinModal = true;
          
          // Attendre que la vue soit mise à jour
          await new Promise(resolve => setTimeout(resolve, 500));
          
          console.log('Génération du PDF pour', eleve.prenom, eleve.nom);
          console.log('Élément bulletinContent:', this.bulletinContent.nativeElement);
          
          const element = this.bulletinContent.nativeElement;
          console.log('Dimensions de l\'élément:', {
            width: element.offsetWidth,
            height: element.offsetHeight,
            scrollWidth: element.scrollWidth,
            scrollHeight: element.scrollHeight
          });
          
          // Générer le canvas avec html2canvas
          console.log('Début de la génération du canvas...');
          const canvas = await html2canvas(element, {
            scale: 2,
            logging: true, // Activer les logs de débogage
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
          });
          
          console.log('Canvas généré avec succès, dimensions:', canvas.width, 'x', canvas.height);
          
          // Convertir le canvas en blob
          console.log('Conversion du canvas en blob...');
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob: Blob | null) => {
              if (blob) {
                console.log('Blob créé avec succès, taille:', blob.size, 'octets');
                resolve(blob);
              } else {
                console.error('Échec de la création du blob à partir du canvas');
                reject(new Error('Erreur lors de la conversion en PDF'));
              }
            }, 'application/pdf');
          });
          
          // Ajouter le PDF au ZIP
          const fileName = `Bulletin_${eleve.nom}_${eleve.prenom}_T${this.selectedTrimestre}.pdf`
            .replace(/[^a-z0-9_\-\.]/gi, '_'); // Nettoyer le nom de fichier
          
          console.log('Ajout du fichier au ZIP:', fileName);
          bulletinsFolder.file(fileName, blob);
          successCount++;
          console.log('Fichier ajouté avec succès au ZIP');
          
        } catch (error) {
          console.error(`Erreur lors de la génération du bulletin pour ${eleve.prenom} ${eleve.nom}`, error);
          failedEleves.push(`${eleve.prenom} ${eleve.nom}`);
          continue; // Continuer avec le prochain élève même en cas d'erreur
        }
      }
      
      if (cancelled) {
        progressDialog.remove();
        return;
      }
      
      // Vérifier si au moins un bulletin a été généré
      if (successCount === 0) {
        throw new Error('Aucun bulletin n\'a pu être généré');
      }
      
      // Mettre à jour la progression
      updateProgress(this.filteredEleves.length, this.filteredEleves.length, 
        'Préparation de l\'archive...');
      
      // Générer le fichier ZIP
      const zipContent = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      // Télécharger le ZIP
      const zipUrl = URL.createObjectURL(zipContent);
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = `Bulletins_T${this.selectedTrimestre}_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(zipUrl);
      
      // Afficher un message de succès avec les éventuelles erreurs
      let message = `Téléchargement réussi !\n`;
      message += `${successCount} bulletin(s) téléchargé(s) avec succès.`;
      
      if (failedEleves.length > 0) {
        message += `\n\nÉchecs (${failedEleves.length}) :\n- ${failedEleves.join('\n- ')}`;
      }
      
      alert(message);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement des bulletins', error);
      alert(`Erreur lors du téléchargement des bulletins : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      // Nettoyer
      const dialog = document.querySelector('div[style*="position: fixed"][style*="top: 50%"]');
      if (dialog) dialog.remove();
      
      this.isDownloadingAll = false;
      this.selectedEleveForBulletin = null;
    }
  }
}