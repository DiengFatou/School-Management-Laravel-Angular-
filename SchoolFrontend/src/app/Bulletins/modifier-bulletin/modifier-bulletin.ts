import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BulletinService } from '../../Service/bulletin.service';
@Component({
  selector: 'app-modifier-bulletin',
  imports: [],
  templateUrl: './modifier-bulletin.html',
  styleUrl: './modifier-bulletin.css'
})
export class ModifierBulletin implements OnInit {
 getId: any;
  bulletinForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private BulletinService: BulletinService
  ) {
    this.getId = this.activatedRoute.snapshot.paramMap.get('id');

    // Initialisation du formulaire
    this.bulletinForm = this.formBuilder.group({
      eleve_id: [''],
      trimestre: [''],
      annee_scolaire_id: [''],
      pdf_path: [''],
      moyenne_generale: [0],
      mention: [''],
      rang: [0],
      appreciation: [''],
      date_generation: [new Date()]
    });
  }

  ngOnInit(): void {
    this.BulletinService.getBulletin(this.getId).subscribe(result => {
      this.bulletinForm.setValue({
        eleve_id: result.eleve_id,
        trimestre: result.trimestre,
        annee_scolaire_id: result.annee_scolaire_id,
        pdf_path: result.pdf_path,
        moyenne_generale: result.moyenne_generale,
        mention: result.mention,
        rang: result.rang,
        appreciation: result.appreciation,
        date_generation: result.date_generation
      });
    });
  }

  onUpdate(): void {
    this.BulletinService.updateBulletin(this.getId, this.bulletinForm.value)
      .subscribe(() => {
        console.log('Bulletin mis a jour avec succes');
        this.ngZone.run(() => this.router.navigateByUrl('/list-bulletin'));
      }, error => {
        console.error(error);
      });
  }

}
