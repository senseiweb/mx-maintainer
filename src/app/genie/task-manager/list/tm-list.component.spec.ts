import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmListComponent } from './tm-list.component';

describe('TmListComponent', () => {
  let component: TmListComponent;
  let fixture: ComponentFixture<TmListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
