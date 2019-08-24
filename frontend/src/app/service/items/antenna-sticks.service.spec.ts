import { TestBed } from '@angular/core/testing';

import { AntennaSticksService } from './antenna-sticks.service';

describe('AntennaSticksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AntennaSticksService = TestBed.get(AntennaSticksService);
    expect(service).toBeTruthy();
  });
});
