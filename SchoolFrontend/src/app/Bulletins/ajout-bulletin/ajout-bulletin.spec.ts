import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutBulletin } from './ajout-bulletin';

describe('AjoutBulletin', () => {
  let component: AjoutBulletin;
  let fixture: ComponentFixture<AjoutBulletin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutBulletin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutBulletin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
