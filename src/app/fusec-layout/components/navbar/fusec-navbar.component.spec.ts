import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FusecNavbarComponent } from './fusec-navbar.component';

describe('NavbarComponent', () => {
  let component: FusecNavbarComponent;
  let fixture: ComponentFixture<FusecNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FusecNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FusecNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
