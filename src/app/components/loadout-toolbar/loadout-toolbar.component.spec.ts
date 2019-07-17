import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadoutToolbarComponent } from './loadout-toolbar.component';

describe('LoadoutToolbarComponent', () => {
  let component: LoadoutToolbarComponent;
  let fixture: ComponentFixture<LoadoutToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadoutToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadoutToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
