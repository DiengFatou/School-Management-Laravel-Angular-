import { AnneeScolaireService } from './../../Service/annee-scolaire.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajout-annee-scolaire',
  imports: [],
  templateUrl: './ajout-annee-scolaire.html',
  styleUrl: './ajout-annee-scolaire.css'
})
export class AjoutAnneeScolaire implements OnInit {
   anneeForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private AnneeScolaireService: AnneeScolaireService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.anneeForm = this.formBuilder.group({
      libelle: [''],
      active: [false]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.anneeForm.valid) {
      this.AnneeScolaireService.addAnneeScolaire(this.anneeForm.value).subscribe({
        next: () => {
          alert('Annee scolaire ajoutée avec succes !');
          this.ngZone.run(() => this.router.navigateByUrl('/list-annee-scolaire'));
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'ajout de l\'annee scolaire.');
        }
      });
    } else {
      alert('Veuillez remplir correctement le formulaire.');
    }
  }

}
