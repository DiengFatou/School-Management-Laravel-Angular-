import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAnneeScolaire } from './list-annee-scolaire';

describe('ListAnneeScolaire', () => {
  let component: ListAnneeScolaire;
  let fixture: ComponentFixture<ListAnneeScolaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAnneeScolaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAnneeScolaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
