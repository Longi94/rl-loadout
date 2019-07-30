import { TestBed } from '@angular/core/testing';

import { TextureService } from './texture.service';

describe('TextureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextureService = TestBed.get(TextureService);
    expect(service).toBeTruthy();
  });
});
