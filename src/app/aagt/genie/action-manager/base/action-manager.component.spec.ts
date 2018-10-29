import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionManagerComponent } from './action-manager.component';

describe('TaskManagerComponent', () => {
  let component: ActionManagerComponent;
  let fixture: ComponentFixture<ActionManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
