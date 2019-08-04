import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBodyComponent } from './create-body.component';

describe('CreateBodyComponent', () => {
  let component: CreateBodyComponent;
  let fixture: ComponentFixture<CreateBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
