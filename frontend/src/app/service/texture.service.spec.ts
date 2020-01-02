import { TestBed } from '@angular/core/testing';

import { TextureService } from './texture.service';

describe('TextureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextureService = TestBed.inject(TextureService);
    expect(service).toBeTruthy();
  });
});
