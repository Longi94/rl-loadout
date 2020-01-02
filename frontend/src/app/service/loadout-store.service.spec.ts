import { TestBed } from '@angular/core/testing';

import { LoadoutStoreService } from './loadout-store.service';

describe('LoadoutStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadoutStoreService = TestBed.inject(LoadoutStoreService);
    expect(service).toBeTruthy();
  });
});
