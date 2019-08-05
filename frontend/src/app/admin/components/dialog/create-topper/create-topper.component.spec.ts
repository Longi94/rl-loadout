import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTopperComponent } from './create-topper.component';

describe('CreateTopperComponent', () => {
  let component: CreateTopperComponent;
  let fixture: ComponentFixture<CreateTopperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTopperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTopperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
