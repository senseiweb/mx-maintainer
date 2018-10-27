import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGenyComponent } from './list-geny.component';

describe('ListGenyComponent', () => {
  let component: ListGenyComponent;
  let fixture: ComponentFixture<ListGenyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGenyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGenyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
