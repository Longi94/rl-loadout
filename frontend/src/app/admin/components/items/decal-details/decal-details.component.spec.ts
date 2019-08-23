import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecalDetailsComponent } from './decal-details.component';

describe('DecalDetailsComponent', () => {
  let component: DecalDetailsComponent;
  let fixture: ComponentFixture<DecalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
