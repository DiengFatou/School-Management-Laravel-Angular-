import { Component, OnInit } from '@angular/core';
import { MatiereService } from '../../Service/matiere.service';

@Component({
  selector: 'app-list-matiere',
  imports: [],
  templateUrl: './list-matiere.html',
  styleUrl: './list-matiere.css'
})
export class ListMatiere implements OnInit {
   matieres: any[] = [];

  constructor(private matiereService: MatiereService) {}

  ngOnInit(): void {
    this.loadMatieres();
  }

  loadMatieres(): void {
    this.matiereService.getMatieres().subscribe({
      next: (result) => {
        this.matieres = result ?? [];
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors du chargement des matieres.');
      }
    });
  }

  delete(id: number, index: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette matiere ?')) {
      this.matiereService.deleteMatiere(id).subscribe({
        next: () => {
          this.matieres.splice(index, 1);
          alert('Matiere supprimee avec succes.');
        },
        error: (err) => {
          console.error(err);
          alert('Echec de la suppression.');
        }
      });
    }
  }
}