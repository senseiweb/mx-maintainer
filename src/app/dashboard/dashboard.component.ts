import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { AagtAppConfig } from '../core';
import { DashboardUowService } from './dashboard-uow.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  allGenerations;
  // userLastName: string;
  // dateNow = Date.now();
  // widgets = {
  //   weatherWidget: {
  //     locations: [],
  //     currentLocation: {},
  //     tempUnit: []
  //   }
  // };
  constructor(private uow: DashboardUowService) {
  }

  ngOnInit() {
    this.allGenerations = this.uow.allGenerations;
  }

}
