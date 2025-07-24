import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fichier } from './fichier';

describe('Fichier', () => {
  let component: Fichier;
  let fixture: ComponentFixture<Fichier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fichier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fichier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
