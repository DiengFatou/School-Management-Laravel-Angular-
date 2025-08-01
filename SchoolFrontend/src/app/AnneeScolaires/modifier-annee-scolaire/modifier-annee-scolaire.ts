import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnneeScolaireService } from '../../Service/annee-scolaire.service';

@Component({
  selector: 'app-modifier-annee-scolaire',
  imports: [],
  templateUrl: './modifier-annee-scolaire.html',
  styleUrl: './modifier-annee-scolaire.css'
})
export class ModifierAnneeScolaire implements OnInit {
  getId: any;
  updateForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private ngZone: NgZone,
    private AnneeScolaireService: AnneeScolaireService
  ) {
    this.getId = this.activateRoute.snapshot.paramMap.get('id');

    this.updateForm = this.formBuilder.group({
      libelle: [''],
      active: [false]
    });
  }

  ngOnInit(): void {
    this.AnneeScolaireService.getAnneeScolaire(this.getId).subscribe(result => {
      console.log(result);
      this.updateForm.setValue({
        libelle: result['libelle'],
        active: result['active']
      });
    });
  }

  onUpdate(): any {
    this.AnneeScolaireService.updateAnneeScolaire(this.getId, this.updateForm.value)
      .subscribe(() => {
        console.log('Année scolaire mise à jour avec succès');
        this.ngZone.run(() => this.router.navigateByUrl('/list-annee-scolaire'));
      }, (err) => {
        console.log(err);
      });
  }
}
