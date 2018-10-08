import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigation } from '@fuse/types';
import { GenieComponent } from './genie.component';
import { ListGenyComponent } from './list-geny/list-geny.component';
import { PlannerComponent } from './planner/planner.component';

const routes: Routes = [{
  path: '',
  component: GenieComponent,
  children: [{
    path: '',
    component: ListGenyComponent,
  }, {
    path: 'planner',
    component: PlannerComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenMgrRoutingMoudle {
  private genieNavConfig: Array<FuseNavigation> = [{
    id: 'gen-list',
    title: 'Generations',
    type: 'item',
    icon: '',
    url: '/genie'
  }, {
    id: 'gen-planner',
    title: 'Planner',
    type: 'item',
    icon: '',
    url: '/genie/planner'
  }];

  constructor(navService: FuseNavigationService) {
    const genNavConfig = navService.getNavigationItem('genie') as FuseNavigation;
    genNavConfig.type = 'collapsable';
    this.genieNavConfig.forEach(navItem => navService.addNavigationItem(navItem, 'genie')
    );
  }
}

export const routedComponents = [GenieComponent, ListGenyComponent, PlannerComponent];
