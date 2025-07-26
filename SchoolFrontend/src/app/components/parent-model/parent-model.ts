// src/app/components/parent-model/parent-model.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParentService } from '../../Service/parent.service';
import { Parent } from '../../Models/parent.model';

@Component({
  selector: 'app-parent-model',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parent-model.html',
  styleUrls: ['./parent-model.css']
})
export class ParentModel implements OnInit {
  parents: Parent[] = [];
  parentForm: Parent = { id: 0, user_id: 0, telephone: '', adresse: '' };
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private parentService: ParentService) {}

  ngOnInit(): void {
    this.loadParents();
  }

  loadParents(): void {
    this.parentService.getAll().subscribe(data => {
      this.parents = data;
      this.currentPage = 1; // reset page on new data
    });
  }

  saveParent(): void {
    if (this.parentForm.id) {
      this.parentService.update(this.parentForm.id, this.parentForm).subscribe(() => {
        this.loadParents();
        this.resetForm();
      });
    } else {
      this.parentService.create(this.parentForm).subscribe(() => {
        this.loadParents();
        this.resetForm();
      });
    }
  }

  editParent(parent: Parent): void {
    this.parentForm = { ...parent };
  }

  deleteParent(id: number): void {
    if (confirm('Confirmer la suppression ?')) {
      this.parentService.delete(id).subscribe(() => this.loadParents());
    }
  }

  resetForm(): void {
    this.parentForm = { id: 0, user_id: 0, telephone: '', adresse: '' };
  }

  get filteredParents(): Parent[] {
    return this.parents.filter(p =>
      p.telephone.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.adresse.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedParents(): Parent[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredParents.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.filteredParents.length / this.itemsPerPage))
      .fill(0)
      .map((_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
    }
  }
}
