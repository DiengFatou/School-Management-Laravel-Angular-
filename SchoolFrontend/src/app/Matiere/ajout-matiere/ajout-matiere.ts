import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatiereService } from '../../Service/matiere.service';

@Component({
  selector: 'app-ajout-matiere',
  imports: [],
  templateUrl: './ajout-matiere.html',
  styleUrl: './ajout-matiere.css'
})
export class AjoutMatiere implements OnInit {

  matiereForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private matiereService: MatiereService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.matiereForm = this.formBuilder.group({
      nom: ['', Validators.required],
      coefficient: ['', [Validators.required, Validators.min(1)]],
      niveau: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.matiereForm.valid) {
      this.matiereService.addMatiere(this.matiereForm.value).subscribe({
        next: () => {
          alert('Matiere ajoutee avec succes !');
          this.ngZone.run(() => this.router.navigateByUrl('/list-matiere'));
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'ajout de la matiere.');
        }
      });
    } else {
      alert('Veuillez remplir correctement le formulaire.');
    }
  }

}
