import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Enseignant } from './enseignant';

describe('Enseignant', () => {
  let component: Enseignant;
  let fixture: ComponentFixture<Enseignant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Enseignant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Enseignant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
