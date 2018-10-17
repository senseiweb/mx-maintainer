import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmDetailsComponent } from './tm-details.component';

describe('TmDetailsComponent', () => {
  let component: TmDetailsComponent;
  let fixture: ComponentFixture<TmDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
