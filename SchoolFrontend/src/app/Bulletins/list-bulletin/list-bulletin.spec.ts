import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListBulletinComponent } from './list-bulletin';
import { BulletinService } from '../../Service/bulletin.service';
import { ClasseService } from '../../Service/classe-service';
import { AnneeScolaireService } from '../../Service/annee-scolaire.service';
import { EleveService } from '../../Service/eleve-service';

describe('ListBulletinComponent', () => {
  let component: ListBulletinComponent;
  let fixture: ComponentFixture<ListBulletinComponent>;
  let bulletinService: BulletinService;
  let classeService: ClasseService;
  let anneeScolaireService: AnneeScolaireService;
  let eleveService: EleveService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ListBulletinComponent
      ],
      providers: [
        BulletinService,
        ClasseService,
        AnneeScolaireService,
        EleveService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBulletinComponent);
    component = fixture.componentInstance;
    
    // Récupérer les instances des services
    bulletinService = TestBed.inject(BulletinService);
    classeService = TestBed.inject(ClasseService);
    anneeScolaireService = TestBed.inject(AnneeScolaireService);
    eleveService = TestBed.inject(EleveService);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
