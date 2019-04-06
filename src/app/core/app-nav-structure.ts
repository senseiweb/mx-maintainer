import { FuseNavigation } from '@fuse/types';

export interface IAgtNavConfig {
    [index: string]: FuseNavigation[];
}

export const basicNavStructure: FuseNavigation[] = [
    {
        id: 'appMetrics',
        title: 'Metrics',
        type: 'group',
        icon: 'apps',
        children: [
            {
                id: 'dashboards',
                title: 'Dashboards',
                icon: 'dashboard',
                type: 'collapsable',
                children: [
                    {
                        id: 'userDash',
                        title: 'User',
                        type: 'item',
                        url: '/user/dashboard'
                    }
                ]
            }
        ]
    }
];

function addADashboard(dashboard: FuseNavigation): void {
    const dashboardHolder = basicNavStructure
        .filter(navItem => navItem.id === 'appMetrics')[0]
        .children.filter(navItem => navItem.id === 'dashboards')[0];

    if (!dashboardHolder.children.some(d => d.id === dashboard.id)) {
        dashboardHolder.children.push(dashboard);
    }
}
export function makeAagtNavStructure(): FuseNavigation[] {
    addADashboard({
        id: 'aagtDash',
        title: 'A/AGT OPS',
        type: 'item',
        url: '/aagt/dashboard'
    });
    return [
        {
            id: 'appAagt',
            title: 'Aircraft/Armanent Generation',
            type: 'group',
            children: [
                {
                    id: 'genie',
                    title: 'Genie',
                    icon: 'contacts',
                    type: 'collapsable',
                    children: [
                        {
                            id: 'genlist',
                            title: 'Generations',
                            type: 'item',
                            url: 'aagt/genie/list',
                            exactMatch: true
                        },
                        {
                            id: 'genplanner',
                            title: 'Planner',
                            type: 'item',
                            url: 'aagt/genie/planner/new'
                        },
                        {
                            id: 'actionManager',
                            title: 'Action Management',
                            type: 'item',
                            url: 'aagt/genie/action-items',
                            exactMatch: false
                        },
                        {
                            id: 'teamManager',
                            title: 'Team Management',
                            type: 'item',
                            url: 'aagt/genie/teams',
                            exactMatch: false
                        }
                    ]
                }
            ]
        }
    ];
}

export function makeKingMakerNavStructure(): FuseNavigation[] {
    return [
        {
            id: 'appKingMaker',
            title: 'Administration',
            type: 'group',
            children: [
                {
                    id: 'kmConfig',
                    title: 'Configuration',
                    icon: '',
                    type: 'item',
                    url: '/king-maker/configurations'
                }
            ]
        }
    ];
}
