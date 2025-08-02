import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBulletin } from './list-bulletin';

describe('ListBulletin', () => {
  let component: ListBulletin;
  let fixture: ComponentFixture<ListBulletin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBulletin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBulletin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
