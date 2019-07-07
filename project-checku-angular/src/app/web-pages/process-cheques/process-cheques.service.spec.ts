import { TestBed } from '@angular/core/testing';

import { ProcessChequesService } from './process-cheques.service';

describe('ProcessChequesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessChequesService = TestBed.get(ProcessChequesService);
    expect(service).toBeTruthy();
  });
});
