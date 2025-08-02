import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutMatiere } from './ajout-matiere';

describe('AjoutMatiere', () => {
  let component: AjoutMatiere;
  let fixture: ComponentFixture<AjoutMatiere>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutMatiere]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutMatiere);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
