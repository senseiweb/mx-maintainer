import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTrigActionComponent } from './step-trig-action.component';

describe('Step2Component', () => {
    let component: StepTrigActionComponent;
    let fixture: ComponentFixture<StepTrigActionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StepTrigActionComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StepTrigActionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
