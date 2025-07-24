import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Enseignement } from './enseignement';

describe('Enseignement', () => {
  let component: Enseignement;
  let fixture: ComponentFixture<Enseignement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Enseignement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Enseignement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
