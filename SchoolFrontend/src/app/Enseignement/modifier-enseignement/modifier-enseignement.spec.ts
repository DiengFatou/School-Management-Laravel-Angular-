import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierEnseignement } from './modifier-enseignement';

describe('ModifierEnseignement', () => {
  let component: ModifierEnseignement;
  let fixture: ComponentFixture<ModifierEnseignement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierEnseignement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierEnseignement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
