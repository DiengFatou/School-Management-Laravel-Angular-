import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierNote } from './modifier-note';

describe('ModifierNote', () => {
  let component: ModifierNote;
  let fixture: ComponentFixture<ModifierNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierNote]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierNote);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
