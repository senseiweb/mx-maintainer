import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmSidebarComponent } from './am-sidebar.component';

describe('AmSidebarComponent', () => {
  let component: AmSidebarComponent;
  let fixture: ComponentFixture<AmSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
