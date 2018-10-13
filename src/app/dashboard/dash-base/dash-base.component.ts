import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { AagtAppConfig } from '../../core';
import { DashboardUowService } from '../dashboard-uow.service';

@Component({
  selector: 'dash-base',
  templateUrl: './dash-base.component.html',
  styleUrls: ['./dash-base.component.scss']
})
export class DashBaseComponent implements OnInit {
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
