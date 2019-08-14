import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApiKeyComponent } from './create-api-key.component';

describe('CreateApiKeyComponent', () => {
  let component: CreateApiKeyComponent;
  let fixture: ComponentFixture<CreateApiKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateApiKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateApiKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
