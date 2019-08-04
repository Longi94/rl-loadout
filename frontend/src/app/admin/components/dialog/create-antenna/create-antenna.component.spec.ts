import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAntennaComponent } from './create-antenna.component';

describe('CreateAntennaComponent', () => {
  let component: CreateAntennaComponent;
  let fixture: ComponentFixture<CreateAntennaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAntennaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAntennaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
