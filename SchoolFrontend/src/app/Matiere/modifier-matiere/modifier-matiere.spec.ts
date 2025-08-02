import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierMatiere } from './modifier-matiere';

describe('ModifierMatiere', () => {
  let component: ModifierMatiere;
  let fixture: ComponentFixture<ModifierMatiere>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierMatiere]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierMatiere);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
