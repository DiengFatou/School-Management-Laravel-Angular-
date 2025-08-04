import { Component, NgZone, OnInit } from '@angular/core';
import { NoteService, NoteDetaillee } from '../../Service/note.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Note } from '../../Models/note';

@Component({
  selector: 'app-modifier-note',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modifier-note.html',
  styleUrls: ['./modifier-note.css']
})
export class ModifierNote implements OnInit {
  noteId: number;
  updateForm: FormGroup;
  noteDetail: NoteDetaillee | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private noteService: NoteService
  ) {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.noteId = id ? parseInt(id, 10) : 0;

    this.updateForm = this.formBuilder.group({
      eleve_id: ['', Validators.required],
      matiere_id: ['', Validators.required],
      enseignant_id: ['', Validators.required],
      trimestre: ['', Validators.required],
      annee_scolaire_id: ['', Validators.required],
      note: ['', [Validators.required, Validators.min(0), Validators.max(20)]]
    });
  }

  ngOnInit(): void {
    if (isNaN(this.noteId) || this.noteId <= 0) {
      this.errorMessage = 'ID de note invalide';
      return;
    }

    this.isLoading = true;
    this.noteService.getNote(this.noteId).subscribe({
      next: (result: NoteDetaillee) => {
        this.noteDetail = result;
        this.updateForm.patchValue({
          eleve_id: result.eleve.id,
          matiere_id: result.matiere.id,
          enseignant_id: result.matiere.enseignant?.id || '',
          // Ces valeurs devraient être récupérées depuis l'API
          // Pour l'instant, on utilise des valeurs par défaut
          trimestre: 1,
          annee_scolaire_id: 1,
          note: result.valeur_note
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la note', error);
        this.errorMessage = 'Impossible de charger les détails de la note';
        this.isLoading = false;
      }
    });
  }

  onUpdate(): void {
    if (this.isLoading) return;
    
    if (!this.updateForm.valid) {
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
      return;
    }

    const noteData: Note = {
      id: this.noteId,
      eleve_id: this.updateForm.value.eleve_id,
      matiere_id: this.updateForm.value.matiere_id,
      enseignant_id: this.updateForm.value.enseignant_id,
      trimestre: this.updateForm.value.trimestre.toString(),
      annee_scolaire_id: this.updateForm.value.annee_scolaire_id,
      note: this.updateForm.value.note
    };

    this.isLoading = true;
    this.errorMessage = null;

    this.noteService.updateNote(this.noteId, noteData).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.router.navigate(['/notes']);
        });
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de la note', err);
        this.errorMessage = 'Une erreur est survenue lors de la mise à jour de la note';
        this.isLoading = false;
      }
    });
  }
}