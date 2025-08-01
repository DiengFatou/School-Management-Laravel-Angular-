import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNote } from './list-note';

describe('ListNote', () => {
  let component: ListNote;
  let fixture: ComponentFixture<ListNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListNote]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListNote);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
