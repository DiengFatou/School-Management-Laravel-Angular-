import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Eleve } from './eleve';

describe('Eleve', () => {
  let component: Eleve;
  let fixture: ComponentFixture<Eleve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eleve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Eleve);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
