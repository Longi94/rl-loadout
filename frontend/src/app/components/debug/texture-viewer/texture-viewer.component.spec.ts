import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextureViewerComponent } from './texture-viewer.component';

describe('TextureViewerComponent', () => {
  let component: TextureViewerComponent;
  let fixture: ComponentFixture<TextureViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextureViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextureViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
