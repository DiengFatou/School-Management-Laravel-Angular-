import { Component, NgZone, OnInit } from '@angular/core';
import { EnseignementService } from '../../Service/enseignement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modifier-enseignement',
  imports: [],
  templateUrl: './modifier-enseignement.html',
  styleUrl: './modifier-enseignement.css'
})
export class ModifierEnseignement implements OnInit {

   getId: any;
  updateForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private ngZone: NgZone,
    private enseignementService: EnseignementService
  ) {
    this.getId = this.activateRoute.snapshot.paramMap.get('id');

    this.updateForm = this.formBuilder.group({
      enseignant_id: [''],
      classe_id: [''],
      matiere_id: ['']
    });
  }

  ngOnInit(): void {
    this.enseignementService.getEnseignement(this.getId).subscribe(result => {
      console.log(result);
      this.updateForm.setValue({
        enseignant_id: result['enseignant_id'],
        classe_id: result['classe_id'],
        matiere_id: result['matiere_id']
      });
    });
  }

  onUpdate(): any {
    this.enseignementService.updateEnseignement(this.getId, this.updateForm.value)
      .subscribe(() => {
        console.log('Enseignement mis a jour avec succes');
        this.ngZone.run(() => this.router.navigateByUrl('/list-enseignement'));
      }, (err) => {
        console.log(err);
      });
  }

}
