import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'dashboard-aagt',
  templateUrl: './aagt-dash.component.html',
  styleUrls: ['./aagt-dash.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AagtDashboardComponent implements OnInit {

  generations = [{
    name: 'Test Generation 1'
  }, {
      name: 'Test Generation 2'
    }];

  dateNow = Date.now();

  widgets: any;

  constructor(private _fuseSidebarService: FuseSidebarService) { }

  ngOnInit() {
    this.widgets = {
      weatherWidget: {
        locations: {
          Minot: {
            name: 'Minot',
            icon: 'icon-rainy2',
            temp: {
              C: '22',
              F: '72'
            },
            windSpeed: {
              KMH: 12,
              MPH: 7.5
            },
            windDirection: 'NW',
            rainProbability: '98%'
          }
        },
        currentLocation: 'Minot'
      }
    };
  }

  toggleSidebar(name: string): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
}
