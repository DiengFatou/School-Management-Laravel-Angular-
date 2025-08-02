import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEnseignement } from './list-enseignement';

describe('ListEnseignement', () => {
  let component: ListEnseignement;
  let fixture: ComponentFixture<ListEnseignement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEnseignement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEnseignement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
