import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierAnneeScolaire } from './modifier-annee-scolaire';

describe('ModifierAnneeScolaire', () => {
  let component: ModifierAnneeScolaire;
  let fixture: ComponentFixture<ModifierAnneeScolaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierAnneeScolaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierAnneeScolaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
