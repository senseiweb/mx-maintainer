import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KingBaseComponent } from './king-base.component';

describe('KingBaseComponent', () => {
  let component: KingBaseComponent;
  let fixture: ComponentFixture<KingBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KingBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KingBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
