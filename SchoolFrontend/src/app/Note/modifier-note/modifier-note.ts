import { Component, NgZone, OnInit } from '@angular/core';
import { NoteService } from '../../Service/note.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modifier-note',
  imports: [],
  templateUrl: './modifier-note.html',
  styleUrl: './modifier-note.css'
})
export class ModifierNote implements OnInit {
  getId: any;
  updateForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private noteService: NoteService
  ) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    this.updateForm = this.formBuilder.group({
      eleve_id: [''],
      matiere_id: [''],
      enseignant_id: [''],
      trimestre: [''],
      annee_scolaire_id: [''],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.noteService.getNote(this.getId).subscribe(result => {
      this.updateForm.setValue({
        eleve_id: result['eleve_id'],
        matiere_id: result['matiere_id'],
        enseignant_id: result['enseignant_id'],
        trimestre: result['trimestre'],
        annee_scolaire_id: result['annee_scolaire_id'],
        note: result['note']
      });
    });
  }

  onUpdate(): any {
    this.noteService.updateNote(this.getId, this.updateForm.value)
      .subscribe(() => {
        console.log('Note mise a jour avec succes');
        this.ngZone.run(() => this.router.navigateByUrl('/list-note'));
      }, (err) => {
        console.error(err);
      });
  }
}