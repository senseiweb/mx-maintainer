import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepGenAssetComponent } from './step-gen-asset.component';

describe('Step1Component', () => {
    let component: StepGenAssetComponent;
    let fixture: ComponentFixture<StepGenAssetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StepGenAssetComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StepGenAssetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
