import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToppersComponent } from './toppers.component';

describe('ToppersComponent', () => {
  let component: ToppersComponent;
  let fixture: ComponentFixture<ToppersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToppersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToppersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
