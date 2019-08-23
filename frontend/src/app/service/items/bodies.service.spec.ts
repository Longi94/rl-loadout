import { TestBed } from '@angular/core/testing';

import { BodiesService } from './bodies.service';

describe('BodiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BodiesService = TestBed.get(BodiesService);
    expect(service).toBeTruthy();
  });
});
