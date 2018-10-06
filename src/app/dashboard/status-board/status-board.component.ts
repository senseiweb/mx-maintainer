import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-status-board',
  templateUrl: './status-board.component.html',
  styleUrls: ['./status-board.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class StatusBoardComponent implements OnInit {

  generations = [{
    name: 'Test Generation 1'
  }, {
      name: 'Test Generation 2'
  }];

  constructor(private _fuseSidebarService: FuseSidebarService) { }

  ngOnInit() {
  }

  toggleSidebar(name: string): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
}
