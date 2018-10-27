import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmSidebarComponent } from './tm-sidebar.component';

describe('TmSidebarComponent', () => {
  let component: TmSidebarComponent;
  let fixture: ComponentFixture<TmSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
