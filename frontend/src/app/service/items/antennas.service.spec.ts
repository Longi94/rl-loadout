import { TestBed } from '@angular/core/testing';

import { AntennasService } from './antennas.service';

describe('AntennasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AntennasService = TestBed.get(AntennasService);
    expect(service).toBeTruthy();
  });
});
