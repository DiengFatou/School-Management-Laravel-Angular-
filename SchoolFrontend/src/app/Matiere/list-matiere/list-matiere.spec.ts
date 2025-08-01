import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMatiere } from './list-matiere';

describe('ListMatiere', () => {
  let component: ListMatiere;
  let fixture: ComponentFixture<ListMatiere>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMatiere]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMatiere);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
