import { TestBed } from '@angular/core/testing';

import { MatiereService } from './matiere.service';

describe('Matiere', () => {
  let service: MatiereService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatiereService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
