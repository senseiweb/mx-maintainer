import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenieComponent } from './genie-base/genie-base.component';

describe('GenMgrComponent', () => {
  let component: GenieComponent;
  let fixture: ComponentFixture<GenieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
