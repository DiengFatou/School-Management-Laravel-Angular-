import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnseignantComponent } from './enseignant';

describe('EnseignantComponent', () => {
  let component: EnseignantComponent;
  let fixture: ComponentFixture<EnseignantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnseignantComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EnseignantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
