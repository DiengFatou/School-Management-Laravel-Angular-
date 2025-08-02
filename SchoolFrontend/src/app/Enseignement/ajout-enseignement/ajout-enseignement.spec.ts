import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutEnseignement } from './ajout-enseignement';

describe('AjoutEnseignement', () => {
  let component: AjoutEnseignement;
  let fixture: ComponentFixture<AjoutEnseignement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutEnseignement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutEnseignement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
