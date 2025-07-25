import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentModelComponent } from './parent-model';

describe('ParentModelComponent', () => {
  let component: ParentModelComponent;
  let fixture: ComponentFixture<ParentModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
