import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAntennaStickComponent } from './create-antenna-stick.component';

describe('CreateAntennaStickComponent', () => {
  let component: CreateAntennaStickComponent;
  let fixture: ComponentFixture<CreateAntennaStickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAntennaStickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAntennaStickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
