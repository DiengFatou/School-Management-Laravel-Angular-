import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClasseService } from '../../Service/classe.service';
import { Classe } from '../../Models/classe.model';

@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classe.html',
  styleUrls: ['./classe.css']
})
export class ClasseComponent implements OnInit {
  classes: Classe[] = [];
  classeForm: Classe = { id: 0, nom: '', niveau: '', annee_scolaire_id: 0 };
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private classeService: ClasseService) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classeService.getAll().subscribe(data => {
      this.classes = data;
      this.currentPage = 1;
    });
  }

  saveClasse(): void {
    if (this.classeForm.id) {
      this.classeService.update(this.classeForm.id, this.classeForm).subscribe(() => {
        this.loadClasses();
        this.resetForm();
      });
    } else {
      this.classeService.create(this.classeForm).subscribe(() => {
        this.loadClasses();
        this.resetForm();
      });
    }
  }

  editClasse(classe: Classe): void {
    this.classeForm = { ...classe };
  }

  deleteClasse(id: number): void {
    if (confirm('Confirmer la suppression ?')) {
      this.classeService.delete(id).subscribe(() => this.loadClasses());
    }
  }

  resetForm(): void {
    this.classeForm = { id: 0, nom: '', niveau: '', annee_scolaire_id: 0 };
  }

  get filteredClasses(): Classe[] {
    return this.classes.filter(c =>
      c.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.niveau.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedClasses(): Classe[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredClasses.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.filteredClasses.length / this.itemsPerPage))
      .fill(0)
      .map((_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
    }
  }
}
