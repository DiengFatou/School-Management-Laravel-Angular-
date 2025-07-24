import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentModel } from './parent-model';

describe('ParentModel', () => {
  let component: ParentModel;
  let fixture: ComponentFixture<ParentModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
