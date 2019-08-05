import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDecalComponent } from './create-decal.component';

describe('CreateDecalComponent', () => {
  let component: CreateDecalComponent;
  let fixture: ComponentFixture<CreateDecalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDecalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDecalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
