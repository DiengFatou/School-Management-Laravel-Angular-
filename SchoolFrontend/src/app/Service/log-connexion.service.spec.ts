import { TestBed } from '@angular/core/testing';

import { LogConnexionService } from './log-connexion.service';

describe('LogConnexionService', () => {
  let service: LogConnexionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogConnexionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
}); 