import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenieBaseComponent } from './genie-base.component';

describe('GenBaseComponent', () => {
  let component: GenieBaseComponent;
  let fixture: ComponentFixture<GenieBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenieBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenieBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
