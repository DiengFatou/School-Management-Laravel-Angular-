import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnneeScolaire } from './annee-scolaire';

describe('AnneeScolaire', () => {
  let component: AnneeScolaire;
  let fixture: ComponentFixture<AnneeScolaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnneeScolaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnneeScolaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
