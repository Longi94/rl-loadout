import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintedSelectorComponent } from './painted-selector.component';

describe('PaintedSelectorComponent', () => {
  let component: PaintedSelectorComponent;
  let fixture: ComponentFixture<PaintedSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintedSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintedSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
