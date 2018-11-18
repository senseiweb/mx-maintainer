import { Component, OnInit, Input, Output, ViewChild, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Generation, ActionItem, Trigger, TriggerAction } from 'app/aagt/data';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FilesDataSource } from 'app/data';
import { MatPaginator, MatSort } from '@angular/material';
import { PlannerUowService } from '../planner-uow.service';
import { BehaviorSubject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'genie-plan-step2',
    templateUrl: './step2.component.html',
    styleUrls: ['./step2.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class Step2Component implements OnInit {
    currentTrigger: Trigger;
    dataSource: FilesDataSource<TriggerAction>;
    @Input() plannedGen: Generation;

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;
    triggers: Trigger[];
    allActionItems: ActionItem[];
    selectedTriggers = [];
    onActionItemsChanged: BehaviorSubject<ActionItem[]>;
    newTriggerForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
        private planUow: PlannerUowService) {
    }

    ngOnInit() {
        this.allActionItems = this.planUow.allActionItems;
        const trig1 = new Trigger();
        const trig2 = new Trigger();
        trig1.id = 1;
        trig2.id = 2;
        trig1.milestone = 'Warning Order';
        trig2.milestone = 'Execution Order';
        this.triggers = [trig1, trig2];
        this.sortData();
        this.dataSource = [] as any;
    }

    createTriggerForm(): FormGroup {
        return this.formBuilder.group({
            milestone: new FormControl(),
            offset: new FormControl()
        });
    }

    newTrigger(): void {

    }

    remove($event): void {
        this.dataSource = $event.items as any;
        console.log($event);
    }

    sortData(): void {
         this.allActionItems.sort((a: ActionItem, b: ActionItem) => {
            const propA: number | string = a.teamType ;
            const propB: number | string = b.teamType;

            const valueA = isNaN(+propA) ? propA : +propA;
            const valueB = isNaN(+propB) ? propB : +propB;

            return (valueA < valueB ? -1 : 1);
        });
    }

}
