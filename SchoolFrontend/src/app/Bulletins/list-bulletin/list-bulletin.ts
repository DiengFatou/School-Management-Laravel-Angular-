import { Component, OnInit } from '@angular/core';
import { BulletinService } from '../../Service/bulletin.service';

@Component({
  selector: 'app-list-bulletin',
  imports: [],
  templateUrl: './list-bulletin.html',
  styleUrl: './list-bulletin.css'
})
export class ListBulletin implements OnInit {
  bulletins: any[] = [];

  constructor(private bulletinService: BulletinService) {}

  ngOnInit(): void {
    this.loadBulletins();
  }

  loadBulletins(): void {
    this.bulletinService.getBulletins().subscribe({
      next: (result) => {
        this.bulletins = result ?? [];
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors du chargement des bulletins.');
      }
    });
  }

  delete(id: number, index: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce bulletin ?')) {
      this.bulletinService.deleteBulletin(id).subscribe({
        next: () => {
          this.bulletins.splice(index, 1);
          alert('Bulletin supprime avec succes.');
        },
        error: (err) => {
          console.error(err);
          alert('Echec de la suppression.');
        }
      });
    }
  }
}
