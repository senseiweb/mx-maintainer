import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenListComponent } from './gen-list.component';

describe('ListGenyComponent', () => {
    let component: GenListComponent;
    let fixture: ComponentFixture<GenListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GenListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GenListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
