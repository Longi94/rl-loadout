import { TestBed } from '@angular/core/testing';

import { DecalDetailsService } from './decal-details.service';

describe('DecalDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DecalDetailsService = TestBed.get(DecalDetailsService);
    expect(service).toBeTruthy();
  });
});
