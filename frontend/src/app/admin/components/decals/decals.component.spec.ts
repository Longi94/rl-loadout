import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecalsComponent } from './decals.component';

describe('DecalsComponent', () => {
  let component: DecalsComponent;
  let fixture: ComponentFixture<DecalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
