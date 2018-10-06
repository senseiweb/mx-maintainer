import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { AagtAppConfig } from '../core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class DashboardComponent implements OnInit {

  userLastName: string;
  dateNow = Date.now();
  widgets = {
    weatherWidget: {
      locations: [],
      currentLocation: {},
      tempUnit: []
    }
  };
  constructor(_user: AagtAppConfig) {
    this.userLastName = _user.currentUser.profileProperties.LastName;
  }

  ngOnInit() {
  }

}
