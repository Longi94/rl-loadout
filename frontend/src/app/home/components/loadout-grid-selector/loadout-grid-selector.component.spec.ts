import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadoutGridSelectorComponent } from './loadout-grid-selector.component';

describe('LoadoutGridSelectorComponent', () => {
  let component: LoadoutGridSelectorComponent;
  let fixture: ComponentFixture<LoadoutGridSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadoutGridSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadoutGridSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
