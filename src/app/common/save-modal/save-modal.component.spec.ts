import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveModalDialogComponent } from './save-modal.component';

describe('SaveModalDialogComponent', () => {
  let component: SaveModalDialogComponent;
  let fixture: ComponentFixture<SaveModalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveModalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
