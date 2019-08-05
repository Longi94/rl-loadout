import { TestBed } from '@angular/core/testing';

import { CloudStorageService } from './cloud-storage.service';

describe('CloudStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloudStorageService = TestBed.get(CloudStorageService);
    expect(service).toBeTruthy();
  });
});
