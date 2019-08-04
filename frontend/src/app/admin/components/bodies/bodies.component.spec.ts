import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodiesComponent } from './bodies.component';

describe('BodiesComponent', () => {
  let component: BodiesComponent;
  let fixture: ComponentFixture<BodiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
