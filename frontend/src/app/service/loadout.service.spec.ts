import { TestBed } from '@angular/core/testing';

import { LoadoutService } from './loadout.service';

describe('LoadoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadoutService = TestBed.inject(LoadoutService);
    expect(service).toBeTruthy();
  });
});
