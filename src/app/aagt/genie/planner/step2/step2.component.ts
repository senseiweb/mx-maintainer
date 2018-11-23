import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Generation, ActionItem, Trigger, TriggerAction } from 'app/aagt/data';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PlannerUowService } from '../planner-uow.service';
import { BehaviorSubject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';

interface ITriggerActionItemShell {
    id: number;
    sequence: number;
    shortCode: string;
    duration: string;
}

@Component({
    selector: 'genie-plan-step2',
    templateUrl: './step2.component.html',
    styleUrls: ['./step2.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [MinutesExpand]
})
export class Step2Component implements OnInit {
    currentTrigger: Trigger;
    dataSource: Array<ITriggerActionItemShell>;
    @Input() plannedGen: Generation;

    triggers: Trigger[];
    allActionItems: ActionItem[];
    selectedTriggersAction = [];
    onActionItemsChanged: BehaviorSubject<ActionItem[]>;
    newTriggerForm: FormGroup;

    columnsToDisplay: string[];

    constructor(private formBuilder: FormBuilder,
        private minExpand: MinutesExpand,
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
        this.columnsToDisplay = ['sequence', 'shortCode', 'duration'];
        this.dataSource = [] as any;
    }

    reshuffle($event: { items: ActionItem[] }): void {
        this.dataSource = this.selectedTriggersAction.map((ai, i) => {
            return {
                sequence: i + 1,
                shortCode: ai.shortCode,
                duration: this.minExpand.transform(ai.duration as any)
            } as ITriggerActionItemShell;
        });
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

    sortData(sortKey: string): void {
         this.allActionItems.sort((a: ActionItem, b: ActionItem) => {
            const propA: number | string = a.teamType ;
            const propB: number | string = b.teamType;

            const valueA = isNaN(+propA) ? propA : +propA;
            const valueB = isNaN(+propB) ? propB : +propB;

            return (valueA < valueB ? -1 : 1);
        });
    }

}
