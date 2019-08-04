import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDecalDetailComponent } from './create-decal-detail.component';

describe('CreateDecalDetailComponent', () => {
  let component: CreateDecalDetailComponent;
  let fixture: ComponentFixture<CreateDecalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDecalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDecalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
