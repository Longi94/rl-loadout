import { TestBed } from '@angular/core/testing';

import { BodiesService } from './bodies.service';

describe('BodiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BodiesService = TestBed.inject(BodiesService);
    expect(service).toBeTruthy();
  });
});
