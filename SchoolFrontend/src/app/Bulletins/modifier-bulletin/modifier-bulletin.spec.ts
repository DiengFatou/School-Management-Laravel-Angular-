import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierBulletin } from './modifier-bulletin';

describe('ModifierBulletin', () => {
  let component: ModifierBulletin;
  let fixture: ComponentFixture<ModifierBulletin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierBulletin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierBulletin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
