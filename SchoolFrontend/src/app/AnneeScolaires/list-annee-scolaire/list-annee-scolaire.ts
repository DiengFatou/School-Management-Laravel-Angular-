import { Component, OnInit } from '@angular/core';
import { AnneeScolaireService } from '../../Service/annee-scolaire.service';
@Component({
  selector: 'app-list-annee-scolaire',
  imports: [],
  templateUrl: './list-annee-scolaire.html',
  styleUrl: './list-annee-scolaire.css'
})
export class ListAnneeScolaire implements OnInit {
  anneesscolaires: any[] = [];

  constructor(private AnneeScolaireService: AnneeScolaireService) {}

  ngOnInit(): void {
    this.loadAnneesScolaires();
  }

  loadAnneesScolaires(): void {
    this.AnneeScolaireService.getAnneesScolaires().subscribe({
      next: (result) => {
        this.anneesscolaires = result ?? [];
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors du chargement des annees scolaires.');
      }
    });
  }

  delete(id: any, index: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette annee scolaire ?')) {
      this.AnneeScolaireService.deleteAnneeScolaire(id).subscribe({
        next: () => {
          this.anneesscolaires.splice(index, 1);
          alert('Annee scolaire supprimee avec succes.');
        },
        error: (err) => {
          console.error(err);
          alert('Echec de la suppression.');
        }
      });
    }
  }


}
