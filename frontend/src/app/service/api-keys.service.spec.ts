import { TestBed } from '@angular/core/testing';

import { ApiKeysService } from './api-keys.service';

describe('ApiKeysService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiKeysService = TestBed.inject(ApiKeysService);
    expect(service).toBeTruthy();
  });
});
