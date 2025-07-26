import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Eleve } from '../../Models/eleve.model';
import { EleveService } from '../../Service/eleve.service';

@Component({
  selector: 'app-eleve',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eleve.html',
  styleUrls: ['./eleve.css']
})
export class EleveComponent implements OnInit {
  eleves: Eleve[] = [];
  filteredEleves: Eleve[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchTerm: string = '';

  eleveForm: Eleve = {
    id: 0,
    user_id: 0,
    nom: '',
    prenom: '',
    date_naissance: new Date(),
    classe_id: 0,
    parent_id: 0,
    visible: true
  };

  isEditing: boolean = false;

  constructor(private eleveService: EleveService) {}

  ngOnInit(): void {
    this.loadEleves();
  }

  loadEleves(): void {
    this.eleveService.getAll().subscribe(data => {
      this.eleves = data;
      this.filteredEleves = data;
      this.currentPage = 1;
    });
  }

  search(): void {
    this.filteredEleves = this.eleves.filter(e =>
      e.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  get paginatedEleves(): Eleve[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEleves.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredEleves.length / this.itemsPerPage);
  }

  changePage(direction: number): void {
    const newPage = this.currentPage + direction;
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.currentPage = newPage;
    }
  }

  save(): void {
    if (this.isEditing) {
      this.eleveService.update(this.eleveForm.id, this.eleveForm).subscribe(() => {
        this.loadEleves();
        this.resetForm();
      });
    } else {
      this.eleveService.create(this.eleveForm).subscribe(() => {
        this.loadEleves();
        this.resetForm();
      });
    }
  }

  edit(eleve: Eleve): void {
    this.eleveForm = { ...eleve };
    this.isEditing = true;
  }

  delete(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet élève ?')) {
      this.eleveService.delete(id).subscribe(() => {
        this.loadEleves();
      });
    }
  }

  resetForm(): void {
    this.eleveForm = {
      id: 0,
      user_id: 0,
      nom: '',
      prenom: '',
      date_naissance: new Date(),
      classe_id: 0,
      parent_id: 0,
      visible: true
    };
    this.isEditing = false;
  }
}
