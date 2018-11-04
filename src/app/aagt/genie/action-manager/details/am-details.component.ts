// import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { ActionItem } from 'app/aagt/data';
// import { Subject } from 'rxjs';
// import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
// import { ActionManagerUow } from '../../action-manager-uow.service';

// @Component({
//   selector: 'am-details',
//   templateUrl: './am-details.component.html',
//   styleUrls: ['./am-details.component.scss']
// })
// export class AmDetailsComponent implements OnInit, OnDestroy{
//   action: ActionItem;
//   tags: any[];
//   formType: string;
//   actionForm: FormGroup;

//   @ViewChild('titleInput')
//   titleInputField;

//   private unsubscribeAll: Subject<any>;

//   constructor(
//       private actionMngrUow: ActionManagerUow,
//       private formBuilder: FormBuilder
//   )
//   {
//       // Set the private defaults
//       this.unsubscribeAll = new Subject();
//   }

//   ngOnInit(): void
//   {
//       // Subscribe to update the current todo
//       this.actionMngrUow.onCurrentActionChanged
//           .pipe(takeUntil(this.unsubscribeAll))
//           .subscribe(curr => {

//               if ( curr.action && curr.mode === 'edit' )
//               {
//                   this.formType = 'edit';
//                   this.action = curr.action;
//                   this.actionForm = this.createActionForm();

//                   this.actionForm.valueChanges
//                       .pipe(
//                           takeUntil(this.unsubscribeAll),
//                           debounceTime(500),
//                           distinctUntilChanged()
//                       )
//                       .subscribe(data => {
//                           // this.actionMngrUow.updateTodo();
//                       });
//               }
//           });

//       // Subscribe to update on tag change
//       this.actionMngrUow.onTagsChanged
//           .pipe(takeUntil(this.unsubscribeAll))
//           .subscribe(labels => {
//               this.tags = labels;
//           });

//       // Subscribe to update on tag change
//       this.actionMngrUow.onNewActionClicked
//           .pipe(takeUntil(this.unsubscribeAll))
//           .subscribe(() => {
//               this.action = new Todo({});
//               this.formType = 'new';
//               this.actionForm = this.createActionForm();
//               this.focusTitleField();
//             this.actionMngrUow.onCurrentActionChanged.next({action: this.action, mode: 'new'});
//           });
//   }

//   ngOnDestroy(): void {
//       this.unsubscribeAll.next();
//       this.unsubscribeAll.complete();
//   }

//   focusTitleField(): void
//   {
//       setTimeout(() => {
//           this.titleInputField.nativeElement.focus();
//       });
//   }

//   createActionForm(): FormGroup
//   {
//       return this.formBuilder.group({
//           'id'       : [this.action.id],
//           'title'    : [this.action.action],
//           'notes'    : [this.action.notes],
//           'startDate': [this.action.created],
//           // 'dueDate'  : [this.action.dueDate],
//           'completed': [this.action.completed],
//           'starred'  : [this.action.critical],
//           'important': [this.action.important],
//           // 'deleted'  : [this.action.deleted],
//           'tags'     : [this.action.tags]
//       });
//   }

//   toggleStar(event): void
//   {
//       event.stopPropagation();
//       this.action.toggleStar();
//   }

//   toggleImportant(event): void
//   {
//       event.stopPropagation();
//       this.action.toggleImportant();
//   }

//   toggleCompleted(event): void
//   {
//       event.stopPropagation();
//       this.action.toggleCompleted();
//   }

//   toggleDeleted(event): void
//   {
//       event.stopPropagation();
//       this.action.toggleDeleted();
//   }

//   toggleTagOnTodo(tagId): void
//   {
//       this.actionMngrUow.toggleTagOnAction(tagId, this.action);
//   }

//   hasTag(tagId): any
//   {
//       return this.actionMngrUow.hasTag(tagId, this.action);
//   }

//   addAction(): void
//   {
//       // this.actionMngrUow.updateTask(this.todoForm.getRawValue());
//   }

// }
