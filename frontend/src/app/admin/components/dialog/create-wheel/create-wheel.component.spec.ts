import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWheelComponent } from './create-wheel.component';

describe('CreateWheelComponent', () => {
  let component: CreateWheelComponent;
  let fixture: ComponentFixture<CreateWheelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWheelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
