import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutNote } from './ajout-note';

describe('AjoutNote', () => {
  let component: AjoutNote;
  let fixture: ComponentFixture<AjoutNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutNote]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutNote);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
