import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NoteService } from '../../Service/note.service';

@Component({
  selector: 'app-ajout-note',
  imports: [],
  templateUrl: './ajout-note.html',
  styleUrl: './ajout-note.css'
})
export class AjoutNote implements OnInit {

  noteForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.noteForm = this.formBuilder.group({
      eleve_id: ['', Validators.required],
      matiere_id: ['', Validators.required],
      enseignant_id: ['', Validators.required],
      trimestre: ['', Validators.required],
      annee_scolaire_id: ['', Validators.required],
      note: ['', [Validators.required, Validators.min(0), Validators.max(20)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.noteForm.valid) {
      this.noteService.addNote(this.noteForm.value).subscribe({
        next: () => {
          alert('Note ajoutee avec succes !');
          this.ngZone.run(() => this.router.navigateByUrl('/list-note'));
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'ajout de la note.');
        }
      });
    } else {
      alert('Veuillez remplir correctement le formulaire.');
    }
  }
}
