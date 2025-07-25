import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClasseComponent } from './classe';

describe('ClasseComponent', () => {
  let component: ClasseComponent;
  let fixture: ComponentFixture<ClasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClasseComponent] // ✅ On déclare le composant, pas l'importer comme un module
    }).compileComponents();

    fixture = TestBed.createComponent(ClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
