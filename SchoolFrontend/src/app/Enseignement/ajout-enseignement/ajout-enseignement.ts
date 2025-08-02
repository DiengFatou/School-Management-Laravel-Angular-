import { Component, NgZone, OnInit } from '@angular/core';
import { EnseignementService } from '../../Service/enseignement.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajout-enseignement',
  imports: [],
  templateUrl: './ajout-enseignement.html',
  styleUrl: './ajout-enseignement.css'
})
export class AjoutEnseignement implements OnInit {
  enseignementForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private enseignementService: EnseignementService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.enseignementForm = this.formBuilder.group({
      enseignant_id: [''],
      classe_id: [''],
      matiere_id: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.enseignementForm.valid) {
      this.enseignementService.addEnseignement(this.enseignementForm.value).subscribe({
        next: () => {
          alert('Enseignement ajoute avec succes !');
          this.ngZone.run(() => this.router.navigateByUrl('/list-enseignement'));
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'ajout de l\'enseignement.');
        }
      });
    } else {
      alert('Veuillez remplir correctement le formulaire.');
    }
  }
}
