import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { PlannerUowService } from '../planner-uow.service';

@Component({
    selector: 'genie-plan-step-tm-manager',
    templateUrl: './step-tm-mgr.component.html',
    styleUrls: ['./step-tm-mgr.component.scss'],
    animations: fuseAnimations
})
export class StepTeamManagerComponent implements OnInit, OnDestroy {
    categories: any[];
    courses: any[];
    coursesFilteredByCategory: any[];
    filteredCourses: any[];
    currentCategory: string;
    searchTerm: string;

    private _unsubscribeAll: Subject<any>;

    constructor(private uow: PlannerUowService) {
        this.currentCategory = 'all';
        this.searchTerm = '';

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    filterTeamsByCategory(): void {
        // Filter
        if (this.currentCategory === 'all') {
            this.coursesFilteredByCategory = this.courses;
            this.filteredCourses = this.courses;
        } else {
            this.coursesFilteredByCategory = this.courses.filter(course => {
                return course.category === this.currentCategory;
            });

            this.filteredCourses = [...this.coursesFilteredByCategory];
        }

        this.filterTeamsByTerm();
    }

    filterTeamsByTerm(): void {
        const searchTerm = this.searchTerm.toLowerCase();

        // Search
        if (searchTerm === '') {
            this.filteredCourses = this.coursesFilteredByCategory;
        } else {
            this.filteredCourses = this.coursesFilteredByCategory.filter(
                course => {
                    return course.title.toLowerCase().includes(searchTerm);
                }
            );
        }
    }
}
