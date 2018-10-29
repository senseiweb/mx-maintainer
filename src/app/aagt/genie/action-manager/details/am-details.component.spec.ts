import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmDetailsComponent } from './am-details.component';

describe('AmDetailsComponent', () => {
  let component: AmDetailsComponent;
  let fixture: ComponentFixture<AmDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
