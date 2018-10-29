import { FuseNavigation } from '@fuse/types';

export interface AgtNavConfig {
  [index: string]: FuseNavigation[];
}

export const basicNavStructure: Array<FuseNavigation> = [{
  id: 'appMetrics',
  title: 'Metrics',
  type: 'group',
  icon: 'apps',
  children: [{
    id: 'dashboards',
    title: 'Dashboards',
    icon: 'dashboard',
    type: 'collapsable',
    children: []
  }]
}];

function addADashboard(dashboard: FuseNavigation): void {
  basicNavStructure.filter(navItem =>
    navItem.id === 'appMetrics')[0]
    .children.filter(navItem =>
      navItem.id === 'dashboards')[0].children.push(dashboard);
}
export function makeAagtNavStructure(): Array<FuseNavigation> {
  addADashboard({
    id: 'statusboard',
    title: 'Status Boards',
    type: 'item',
    url: '/aagt/dashboard/aagt-dash'
  });
  return [{
    id: 'appAagt',
    title: 'Aircraft/Armanent Generation',
    type: 'group',
    children: [{
      id: 'genie',
      title: 'Genie',
      icon: 'contacts',
      type: 'collapsable',
      children: [{
        id: 'genlist',
        title: 'Generations',
        type: 'item',
        url: 'aagt/genie/list',
        exactMatch: true
      }, {
        id: 'genplanner',
        title: 'Planner',
        type: 'item',
        url: 'aagt/genie/planner/0',
      }, {
        id: 'actionManager',
        title: 'Task Management',
        type: 'item',
        url: 'aagt/genie/task-manager/all'
      }
      ]
    }]
  }];
}

export const kingMakerNavStructure: FuseNavigation = {
  id: 'appKingMaker',
  title: 'Administration',
  type: 'group',
  children: [{
    id: 'kmConfig',
    title: 'Configuration',
    icon: '',
    type: 'item',
    url: '/king-maker/configurations'
  }]
};
