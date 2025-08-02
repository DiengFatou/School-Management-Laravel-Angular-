import { Component, NgZone, OnInit } from '@angular/core';
import { MatiereService } from '../../Service/matiere.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modifier-matiere',
  imports: [],
  templateUrl: './modifier-matiere.html',
  styleUrl: './modifier-matiere.css'
})
export class ModifierMatiere implements OnInit {
  getId: any;
  updateForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private matiereService: MatiereService
  ) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');
    this.updateForm = this.formBuilder.group({
      nom: [''],
      coefficient: [''],
      niveau: ['']
    });
  }

  ngOnInit(): void {
    this.matiereService.getMatiere(this.getId).subscribe(result => {
      this.updateForm.setValue({
        nom: result['nom'],
        coefficient: result['coefficient'],
        niveau: result['niveau']
      });
    });
  }

  onUpdate(): void {
    if (this.updateForm.valid) {
      this.matiereService.updateMatiere(this.getId, this.updateForm.value).subscribe(() => {
        alert('Matiere modifiee avec succes !');
        this.ngZone.run(() => this.router.navigateByUrl('/list-matiere'));
      }, err => {
        console.error(err);
        alert('Erreur lors de la mise a jour.');
      });
    } else {
      alert('Veuillez remplir correctement le formulaire.');
    }
  }

}
