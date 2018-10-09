import { FuseNavigation } from '@fuse/types';
export interface AgtNavConfig {
  [index: string]: FuseNavigation[];
}

export const basicNavStructure: Array<FuseNavigation>  = [{
    id: 'appMetrics',
    title: 'Metrics',
    type: 'group',
    icon: 'apps',
    children: [{
      id: 'dashboards',
      title: 'Dashboards',
      icon: 'dashboard',
      type: 'collapsable',
      children: [{
        id: 'statusboard',
        title: 'Status Boards',
        type: 'item',
        url: '/dashboard/status-board'
      }]
    }]
  }];

export const genMgrNavStructure: Array<FuseNavigation> = [{
  id: 'appGenMgr',
  title: 'Generation Management',
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
      url: '/genie'
    }, {
      id: 'genplanner',
      title: 'Planner',
      type: 'item',
      url: '/genie/planner'
    }
    ]
  }]
}];




