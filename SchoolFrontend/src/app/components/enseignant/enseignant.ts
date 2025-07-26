import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Enseignant } from '../../Models/enseignant.model';
import { EnseignantService } from '../../Service/enseignant.service';

@Component({
  selector: 'app-enseignant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enseignant.html',
  styleUrls: ['./enseignant.css']
})
export class EnseignantComponent implements OnInit {
  enseignants: Enseignant[] = [];
  filteredEnseignants: Enseignant[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchTerm: string = '';

  newEnseignant: Enseignant = {
    id: 0,
    user_id: 0,
    nom_complet: ''
  };

  isEditing: boolean = false;

  constructor(private enseignantService: EnseignantService) {}

  ngOnInit(): void {
    this.loadEnseignants();
  }

  loadEnseignants(): void {
    this.enseignantService.getAll().subscribe(data => {
      this.enseignants = data;
      this.filteredEnseignants = data;
    });
  }

  get paginatedEnseignants(): Enseignant[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEnseignants.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredEnseignants.length / this.itemsPerPage);
  }

  search(): void {
    this.filteredEnseignants = this.enseignants.filter(e =>
      e.nom_complet.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  save(): void {
    if (this.isEditing) {
      this.enseignantService.update(this.newEnseignant.id, this.newEnseignant).subscribe(() => {
        this.loadEnseignants();
        this.resetForm();
      });
    } else {
      this.enseignantService.create(this.newEnseignant).subscribe(() => {
        this.loadEnseignants();
        this.resetForm();
      });
    }
  }

  edit(enseignant: Enseignant): void {
    this.newEnseignant = { ...enseignant };
    this.isEditing = true;
  }

  delete(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer cet enseignant ?")) {
      this.enseignantService.delete(id).subscribe(() => {
        this.loadEnseignants();
      });
    }
  }

  resetForm(): void {
    this.newEnseignant = { id: 0, user_id: 0, nom_complet: '' };
    this.isEditing = false;
  }

  changePage(direction: number): void {
    const newPage = this.currentPage + direction;
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.currentPage = newPage;
    }
  }
}
