// import { Component, OnInit, OnDestroy, ViewEncapsulation, Input} from '@angular/core';
// import { ActionManagerUow } from '../../action-manager-uow.service';
// import { Router } from '@angular/router';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { fuseAnimations } from '@fuse/animations';

// @Component({
//   selector: 'am-sidebar',
//   templateUrl: './am-sidebar.component.html',
//   styleUrls: ['./am-sidebar.component.scss'],
//   encapsulation: ViewEncapsulation.None,
//   animations: fuseAnimations
// })
// export class AmSidebarComponent implements OnInit, OnDestroy {
//   folders: any[];
//   filters: any[];
//   tags: any[];
//   @Input()
//   sbHasTriggers: boolean;
//   accounts: object;
//   selectedAccount: string;
//   private unsubscribeAll: Subject<any>;

//   constructor(private actionMgrUow: ActionManagerUow, private router: Router) {
//     this.unsubscribeAll = new Subject();
//   }

//   ngOnInit() {
//     this.actionMgrUow.onTagsChanged
//       .pipe(takeUntil(this.unsubscribeAll))
//       .subscribe(tags => {
//         this.tags = tags.filter(t => !t.isFilter);
//         this.filters = tags.filter(t => t.isFilter);
//       });
//   }

//   ngOnDestroy() {
//     this.unsubscribeAll.next();
//     this.unsubscribeAll.complete();
//   }

//   newAction(): void {
//     this.router.navigate(['/action-manager/action/all']).then(() => {
//       setTimeout(() => {
//         this.actionMgrUow.onNewActionClicked.next('');
//       });
//     });
//   }
// }
