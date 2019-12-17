import { TestBed } from '@angular/core/testing';

import { WheelsService } from './wheels.service';

describe('WheelsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WheelsService = TestBed.get(WheelsService);
    expect(service).toBeTruthy();
  });
});
