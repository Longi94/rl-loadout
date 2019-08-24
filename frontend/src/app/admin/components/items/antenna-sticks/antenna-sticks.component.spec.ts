import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntennaSticksComponent } from './antenna-sticks.component';

describe('AntennaSticksComponent', () => {
  let component: AntennaSticksComponent;
  let fixture: ComponentFixture<AntennaSticksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntennaSticksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntennaSticksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
