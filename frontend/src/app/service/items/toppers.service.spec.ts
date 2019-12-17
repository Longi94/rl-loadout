import { TestBed } from '@angular/core/testing';

import { ToppersService } from './toppers.service';

describe('ToppersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToppersService = TestBed.get(ToppersService);
    expect(service).toBeTruthy();
  });
});
