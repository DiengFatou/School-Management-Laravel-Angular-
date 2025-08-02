import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../Service/note.service';

@Component({
  selector: 'app-list-note',
  imports: [],
  templateUrl: './list-note.html',
  styleUrl: './list-note.css'
})
export class ListNote implements OnInit {
  notes: any[] = [];

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (result) => {
        this.notes = result ?? [];
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors du chargement des notes.');
      }
    });
  }

  delete(id: number, index: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette note ?')) {
      this.noteService.deleteNote(id).subscribe({
        next: () => {
          this.notes.splice(index, 1);
          alert('Note supprimee avec succes.');
        },
        error: (err) => {
          console.error(err);
          alert('Echec de la suppression.');
        }
      });
    }
  }
}