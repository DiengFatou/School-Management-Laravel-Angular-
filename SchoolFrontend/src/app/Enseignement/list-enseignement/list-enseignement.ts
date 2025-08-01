import { Component, OnInit } from '@angular/core';
import { EnseignementService } from '../../Service/enseignement.service';

@Component({
  selector: 'app-list-enseignement',
  imports: [],
  templateUrl: './list-enseignement.html',
  styleUrl: './list-enseignement.css'
})
export class ListEnseignement implements OnInit {
  enseignements: any[] = [];


  constructor(private enseignementService: EnseignementService) {}

  ngOnInit(): void {
    this.loadEnseignements();
  }

  loadEnseignements(): void {
    this.enseignementService.getEnseignements().subscribe({
      next: (result) => {
        this.enseignements = result ?? [];
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors du chargement des enseignements.');
      }
    });
  }

  delete(id: number, index: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet enseignement ?')) {
      this.enseignementService.deleteEnseignement(id).subscribe({
        next: () => {
          this.enseignements.splice(index, 1);
          alert('Enseignement supprime avec succes.');
        },
        error: (err) => {
          console.error(err);
          alert('Echec de la suppression.');
        }
      });
    }
  }
}
