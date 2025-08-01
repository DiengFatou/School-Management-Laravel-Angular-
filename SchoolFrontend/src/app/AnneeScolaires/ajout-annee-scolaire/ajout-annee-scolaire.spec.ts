import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutAnneeScolaire } from './ajout-annee-scolaire';

describe('AjoutAnneeScolaire', () => {
  let component: AjoutAnneeScolaire;
  let fixture: ComponentFixture<AjoutAnneeScolaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutAnneeScolaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutAnneeScolaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
