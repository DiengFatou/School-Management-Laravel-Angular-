import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentModel } from './parent-model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ParentService } from '../../Service/parent.service';

describe('ParentModel', () => {
  let component: ParentModel;
  let fixture: ComponentFixture<ParentModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParentModel],
      imports: [HttpClientTestingModule],
      providers: [ParentService]
    }).compileComponents();

    fixture = TestBed.createComponent(ParentModel);
    component = fixture.componentInstance;
    fixture.detectChanges(); // déclenche ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
