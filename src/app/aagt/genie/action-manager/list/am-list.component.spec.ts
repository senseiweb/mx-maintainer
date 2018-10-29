import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmListComponent } from './am-list.component';

describe('AmListComponent', () => {
  let component: AmListComponent;
  let fixture: ComponentFixture<AmListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
