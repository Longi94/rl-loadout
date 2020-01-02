import { TestBed } from '@angular/core/testing';

import { DecalsService } from './decals.service';

describe('DecalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DecalsService = TestBed.inject(DecalsService);
    expect(service).toBeTruthy();
  });
});
