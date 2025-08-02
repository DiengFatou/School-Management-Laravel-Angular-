import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BulletinService } from '../../Service/bulletin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajout-bulletin',
  imports: [],
  templateUrl: './ajout-bulletin.html',
  styleUrl: './ajout-bulletin.css'
})
export class AjoutBulletin implements OnInit {
  bulletinForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private bulletinService: BulletinService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.bulletinForm = this.formBuilder.group({
      eleve_id: [''],
      trimestre: [''],
      annee_scolaire_id: [''],
      pdf_path: [''],
      moyenne_generale: [''],
      mention: [''],
      rang: [''],
      appreciation: [''],
      date_generation: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.bulletinForm.valid) {
      this.bulletinService.addBulletin(this.bulletinForm.value).subscribe({
        next: () => {
          alert('Bulletin ajoute avec succes !');
          this.ngZone.run(() => this.router.navigateByUrl('/list-bulletins'));
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'ajout du bulletin.');
        }
      });
    } else {
      alert('Veuillez remplir tous les champs du bulletin.');
    }
  }
}