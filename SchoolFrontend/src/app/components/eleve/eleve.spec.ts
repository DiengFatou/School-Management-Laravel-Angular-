import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EleveComponent } from './eleve';

describe('EleveComponent', () => {
  let component: EleveComponent;
  let fixture: ComponentFixture<EleveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EleveComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
