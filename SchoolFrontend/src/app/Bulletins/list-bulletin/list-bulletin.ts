import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { BulletinService } from '../../Service/bulletin.service';
import { ClasseService } from '../../Service/classe-service';
import { AnneeScolaireService } from '../../Service/annee-scolaire.service';
import { EleveService } from '../../Service/eleve-service';
import { saveAs } from 'file-saver';

declare const bootstrap: any; // Déclaration pour l'utilisation de Bootstrap 5

export interface BulletinEtudiant {
  id: number;
  eleve_id: number;
  eleve_nom: string;
  classe_id: number;
  classe_nom: string;
  trimestre: number;
  annee_scolaire_id: number;
  annee_scolaire: string;
  moyenne_generale: number;
  mention: string;
  rang: number;
  appreciation: string;
  date_generation: string;
  notes: Array<{
    matiere_id: number;
    matiere_nom: string;
    valeur: number;
    coefficient: number;
    appreciation: string;
    moyenne_classe: number;
  }>;
}

@Component({
  selector: 'app-list-bulletin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbTooltipModule,
    RouterModule
  ],
  templateUrl: './list-bulletin.html',
  styleUrls: ['./list-bulletin.component.scss', './list-bulletin.css'],
  providers: [DatePipe, DecimalPipe]
})
export class ListBulletinComponent implements OnInit {
  bulletins: BulletinEtudiant[] = [];
  selectedBulletin: any = null;
  totalElevesClasse: number = 0;
  filteredBulletins: any[] = [];
  anneesScolaires: any[] = [];
  classes: any[] = [];
  selectedAnnee: number | null = null;
  selectedTrimestre: number = 1;
  selectedClasse: number | null = null;
  
  // Propriétés pour l'historique
  historyBulletins: any[] = [];
  historyLoading: boolean = false;
  historyCurrentPage: number = 1;
  historyPageSize: number = 10;
  historyTotalPages: number = 1;
  historyTotalItems: number = 0;
  
  // Propriétés pour le chargement
  loading: boolean = false;
  generationMessage: string = '';

  constructor(
    private bulletinService: BulletinService,
    private classeService: ClasseService,
    private anneeScolaireService: AnneeScolaireService,
    private eleveService: EleveService,
    private router: Router
  ) { 
    // Initialiser l'année scolaire en cours
    const currentYear = new Date().getFullYear();
    this.selectedAnnee = currentYear;
  }

  ngOnInit(): void {
    this.loadAnneesScolaires();
    this.loadClasses();
    this.loadBulletins();
  }

  // Charger les données initiales
  loadAnneesScolaires(): void {
    this.anneeScolaireService.getAnneesScolaires().subscribe({
      next: (data: any) => {
        this.anneesScolaires = data;
        if (this.anneesScolaires.length > 0) {
          this.selectedAnnee = this.anneesScolaires[0].id;
          this.filterBulletins();
        }
      },
      error: (error: any) => console.error('Erreur lors du chargement des années scolaires', error)
    });
  }

  loadClasses(): void {
    this.classeService.getClasses().subscribe({
      next: (data: any) => {
        this.classes = data;
        if (this.classes.length > 0) {
          this.selectedClasse = this.classes[0].id;
        }
      },
      error: (error: any) => console.error('Erreur lors du chargement des classes', error)
    });
  }

  loadBulletins(): void {
    this.bulletinService.getBulletins().subscribe({
      next: (result: any) => {
        this.bulletins = result ?? [];
        this.filterBulletins();
      },
      error: (err: any) => {
        console.error(err);
        alert('Erreur lors du chargement des bulletins.');
      }
    });
  }

  // Filtrer les bulletins selon les critères sélectionnés
  filterBulletins(): void {
    if (!this.selectedAnnee || !this.selectedClasse) {
      this.filteredBulletins = [];
      return;
    }

    this.loading = true;
    this.bulletinService.getBulletinsByFilters(
      this.selectedAnnee,
      this.selectedTrimestre,
      this.selectedClasse
    ).subscribe({
      next: (data: any) => {
        this.filteredBulletins = data.bulletins || [];
        this.totalElevesClasse = data.total_eleves || 0;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des bulletins', error);
        this.loading = false;
      }
    });
  }
  
  // Charger l'historique des bulletins
  loadHistory(): void {
    if (!this.selectedClasse) {
      return;
    }
    
    this.historyLoading = true;
    this.bulletinService.getBulletinHistory(
      this.selectedClasse,
      this.historyCurrentPage,
      this.historyPageSize
    ).subscribe({
      next: (data: any) => {
        this.historyBulletins = data.items || [];
        this.historyTotalItems = data.total || 0;
        this.historyTotalPages = Math.ceil(this.historyTotalItems / this.historyPageSize);
        this.historyLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement de l\'historique', error);
        this.historyLoading = false;
      }
    });
  }
  
  // Changer de page dans l'historique
  changeHistoryPage(page: number): void {
    if (page < 1 || page > this.historyTotalPages) {
      return;
    }
    this.historyCurrentPage = page;
    this.loadHistory();
  }
  
  // Obtenir les numéros de page pour la pagination
  getHistoryPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.historyCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > this.historyTotalPages) {
      endPage = this.historyTotalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  // Afficher un bulletin de l'historique
  viewHistoryBulletin(item: any): void {
    this.bulletinService.getBulletin(item.id).subscribe({
      next: (data: any) => {
        this.selectedBulletin = data;
        // Afficher la modal avec Bootstrap 5
        const modalElement = document.getElementById('bulletinModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement du bulletin', error);
        alert('Impossible de charger les détails du bulletin');
      }
    });
  }
  
  // Télécharger un bulletin de l'historique
  downloadHistoryBulletin(item: any): void {
    this.bulletinService.downloadBulletinPdf(item.id).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const filename = `bulletin_${item.eleve_nom}_${item.trimestre}_trimestre_${item.annee_scolaire}.pdf`;
        saveAs(blob, filename);
      },
      error: (error: any) => {
        console.error('Erreur lors du téléchargement du bulletin', error);
        alert('Impossible de télécharger le bulletin: ' + (error.error?.message || error.message || 'Erreur inconnue'));
      }
    });
  }
  
  // Exporter les données en Excel
  exportToExcel(): void {
    if (this.filteredBulletins.length === 0) {
      return;
    }
    
    // Créer les en-têtes
    const headers = [
      'Élève',
      'Classe',
      'Trimestre',
      'Moyenne',
      'Rang',
      'Mention'
    ];
    
    // Créer les lignes de données
    const data = this.filteredBulletins.map(bulletin => ({
      'Élève': bulletin.eleve_nom,
      'Classe': bulletin.classe_nom,
      'Trimestre': `${bulletin.trimestre}ème Trimestre`,
      'Moyenne': bulletin.moyenne_generale.toFixed(2),
      'Rang': bulletin.rang,
      'Mention': bulletin.mention
    }));
    
    // Convertir en CSV
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        Object.values(row)
          .map(value => `"${value}"`)
          .join(',')
      )
    ].join('\n');
    
    // Créer et télécharger le fichier avec BOM pour Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `bulletins_${this.selectedAnnee}_T${this.selectedTrimestre}.csv`);
  }

  // Générer les bulletins PDF
  genererBulletins(): void {
    if (!this.selectedAnnee || !this.selectedClasse) {
      this.generationMessage = 'Veuillez sélectionner une année scolaire et une classe';
      return;
    }

    if (confirm('Voulez-vous générer les bulletins pour cette classe ? Cette opération peut prendre quelques instants.')) {
      this.loading = true;
      this.generationMessage = 'Génération des bulletins en cours...';
      
      // Appel au service pour générer les bulletins
      this.bulletinService.genererBulletins({
        annee_scolaire_id: this.selectedAnnee,
        trimestre: this.selectedTrimestre,
        classe_id: this.selectedClasse
      }).subscribe({
        next: (response: any) => {
          this.generationMessage = 'Bulletins générés avec succès !';
          
          // Recharger la liste des bulletins après génération
          this.filterBulletins();
          
          // Effacer le message après 5 secondes
          setTimeout(() => {
            this.generationMessage = '';
          }, 5000);
        },
        error: (error: any) => {
          console.error('Erreur lors de la génération des bulletins', error);
          this.generationMessage = 'Erreur lors de la génération des bulletins';
          
          // Effacer le message d'erreur après 5 secondes
          setTimeout(() => {
            this.generationMessage = '';
          }, 5000);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  // Télécharger un bulletin individuel
  telechargerBulletin(bulletinId: number): void {
    this.bulletinService.downloadBulletinPdf(bulletinId).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const filename = `bulletin_${this.selectedBulletin.eleve_nom}_${this.selectedBulletin.trimestre}_trimestre_${this.selectedBulletin.annee_scolaire}.pdf`;
        saveAs(blob, filename);
      },
      error: (error: any) => {
        console.error('Erreur lors du téléchargement du bulletin', error);
        alert('Erreur lors du téléchargement du bulletin: ' + (error.error?.message || error.message || 'Erreur inconnue'));
      }
    });
  }

  // Télécharger tous les bulletins filtrés
  telechargerTous(): void {
    if (this.filteredBulletins.length === 0) {
      alert('Aucun bulletin à télécharger avec les filtres actuels');
      return;
    }

    if (confirm(`Voulez-vous télécharger les ${this.filteredBulletins.length} bulletins filtrés ?`)) {
      this.loading = true;
      
      const classeNom = this.classes.find(c => c.id === this.selectedClasse)?.nom || 'classe';
      
      this.bulletinService.downloadAllBulletinsPdf({
        annee_scolaire_id: this.selectedAnnee!,
        trimestre: this.selectedTrimestre,
        classe_id: this.selectedClasse!
      }).subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response], { type: 'application/zip' });
          const filename = `bulletins_${classeNom}_${this.selectedAnnee}_T${this.selectedTrimestre}.zip`;
          saveAs(blob, filename);
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erreur lors du téléchargement des bulletins', error);
          alert('Erreur lors du téléchargement des bulletins: ' + (error.error?.message || error.message || 'Erreur inconnue'));
          this.loading = false;
        }
      });
    }
  }

  // Voir les détails d'un bulletin
  voirBulletin(bulletinId: number): void {
    this.bulletinService.getBulletin(bulletinId).subscribe({
      next: (data: any) => {
        this.selectedBulletin = data;
        // Afficher la modal avec Bootstrap 5
        const modalElement = document.getElementById('bulletinModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement du bulletin', error);
        alert('Impossible de charger les détails du bulletin');
      }
    });
  }

  // Imprimer le bulletin
  imprimerBulletin(): void {
    window.print();
  }

  // Envoyer un bulletin par email
  envoyerEmail(bulletin: BulletinEtudiant): void {
    if (confirm(`Envoyer le bulletin de ${bulletin.eleve_nom} par email aux parents ?`)) {
      this.loading = true;
      this.bulletinService.envoyerEmailBulletin(bulletin.id).subscribe({
        next: () => {
          alert('Email envoyé avec succès !');
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'envoi de l\'email', error);
          this.loading = false;
          alert('Erreur lors de l\'envoi de l\'email');
        }
      });
    }
  }

  // Envoyer les bulletins de tous les élèves par email
  envoyerTousEmails(): void {
    if (!this.selectedAnnee || !this.selectedClasse) {
      alert('Veuillez sélectionner une année scolaire et une classe');
      return;
    }

    if (confirm('Voulez-vous envoyer les bulletins à tous les élèves de la classe ?')) {
      this.loading = true;
      this.bulletinService.envoyerTousEmails({
        annee_scolaire_id: this.selectedAnnee,
        trimestre: this.selectedTrimestre,
        classe_id: this.selectedClasse
      }).subscribe({
        next: () => {
          alert('Emails envoyés avec succès !');
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'envoi des emails', error);
          this.loading = false;
          alert('Une erreur est survenue lors de l\'envoi des emails');
        }
      });
    }
  }

  /**
   * Retourne la classe CSS appropriée pour le badge de mention
   * @param mention La mention à styliser
   */
  getMentionClass(mention: string): string {
    if (!mention) return 'mention-badge bg-secondary';
    
    // Convertir la mention en format de classe CSS
    const mentionClass = mention.toLowerCase().replace(/\s+/g, '-');
    return `mention-badge mention-${mentionClass}`;
  }

  // Ouvrir la modal d'ajout
  openAddModal(): void {
    // Implémentez la logique pour ouvrir une modal d'ajout si nécessaire
    alert('Fonctionnalité d\'ajout de bulletin à implémenter');
  }

  // Retourner au tableau de bord
  retourTableauDeBord(): void {
    this.router.navigate(['/admin']);
  }

  delete(id: number, index: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce bulletin ?')) {
      this.bulletinService.deleteBulletin(id).subscribe({
        next: () => {
          this.bulletins.splice(index, 1);
          this.filteredBulletins = this.filteredBulletins.filter(b => b.id !== id);
          alert('Bulletin supprimé avec succès.');
        },
        error: (err: any) => {
          console.error(err);
          alert('Échec de la suppression.');
        }
      });
    }
  }
}
