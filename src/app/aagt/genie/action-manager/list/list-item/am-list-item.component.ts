import { Component, HostBinding, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionItem } from 'app/aagt/data';
import { ActionManagerUow } from 'app/aagt/genie/action-manager-uow.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'am-list-item',
  templateUrl: './am-list-item.component.html',
  styleUrls: ['./am-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AmListItemComponent implements OnInit, OnDestroy {

  tags: any[];

  @Input()
  action: ActionItem;

  @HostBinding('class.selected')
  selected: boolean;

  @HostBinding('class.completed')
  completed: boolean;

  @HostBinding('class.move-disabled')
  moveDisabled: boolean;

  private unsubscribeAll: Subject<any>;

  constructor(private actionMngrUow: ActionManagerUow, activatedRoute: ActivatedRoute) {
    // Disable move if path is not /all
    if (activatedRoute.snapshot.url[0].path !== 'all') {
      this.moveDisabled = true;
    }
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
      // Set the initial values
      // this.action = {} as any;
      // this.completed = this.todo.completed;

      // Subscribe to update on selected todo change
    this.actionMngrUow.onSelectedActionChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(selectedActions => {
        this.selected = false;

        if (selectedActions.length > 0) {
          for (const action of selectedActions) {
            if (action.id === this.action.id) {
              this.selected = true;
              break;
            }
          }
        }
      });

      // Subscribe to update on tag change
    this.actionMngrUow.onTagsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(tags => {
        this.tags = tags;
      });
  }

  ngOnDestroy(): void {
      this.unsubscribeAll.next();
      this.unsubscribeAll.complete();
  }

  onSelectedChange(): void {
      this.actionMngrUow.toggleSelectedAction(this.action.id);
  }

  toggleStar(event): void {
      event.stopPropagation();
      // this.actionMngrUow.updateTask();
  }

  toggleImportant(event): void {
      event.stopPropagation();
  }

  toggleCompleted(event): void {
      event.stopPropagation();
  }
}
