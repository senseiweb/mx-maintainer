import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigation } from '@fuse/types';
import * as availNav from 'app/core/app-nav-structure';
import { SPUserProfileProperties } from './global-data';

export class SpConfig {
    static cfgWebApplicationSite = 'http://localhost:4202';
    static cfgSharepointMainAppSite = '';
    static cfgFuseNavService: FuseNavigationService;
    static spClientCtx: SP.ClientContext;
    static spWeb: SP.Web;
    static cfgMy: {
        id: string;
        lastName: string;
        firstName: string;
        spAccountName: string;
        profileProps: SPUserProfileProperties;
        spGroups: Array<{ id: number; title: string }>;
    } = {
        id: 'Not Set',
        lastName: 'Not Set',
        firstName: 'Not Set',
        spAccountName: 'Not Set',
        profileProps: {},
        spGroups: []
    };
}

export enum SpListType {
    ActionItem
}

export enum SpListName {
    ActionItem = 'ActionItem',
    AssetTriggerAction = 'AssetTriggerAction',
    Asset = 'Asset',
    Assumption = 'Assumption',
    Generation = 'Generation',
    GenerationAsset = 'GenerationAsset',
    TeamAvailability = 'TeamAvailability',
    Team = 'Team',
    TeamCategory = 'TeamCategory',
    TriggerAction = 'TriggerAction',
    Trigger = 'Trigger'
}

export const enum MxmAppName {
    Aagt
}

// tslint:disable-next-line: ban-types
export const MxmAssignedModels = new Map<MxmAppName, Function[]>();

export const cfgNavStructure = {
    name: '',
    navItems: [] as FuseNavigation[]
};

export const cfgFeatureSpAppSite = (appName: string): string => {
    const site = `${
        SpConfig.cfgSharepointMainAppSite
    }/mx-maintainer/${appName}/_api/`;
    return site.replace('mx-maintainer//', 'mx-maintainer/');
};

export const cfgApiAddress = (appName: string): string => {
    const site = `${
        SpConfig.cfgWebApplicationSite
    }/mx-maintainer/${appName}/_api/`;
    return site.replace('mx-maintainer//', 'mx-maintainer/');
};

export const cfgFetchUserData = async (): Promise<void> => {
    const ctx = SpConfig.spClientCtx;
    const peopleManager = new SP.UserProfiles.PeopleManager(ctx);
    const oUser = SpConfig.spWeb.get_currentUser();
    oUser.retrieve();
    const groups = oUser.get_groups();
    const props = peopleManager.getMyProperties();
    ctx.load(oUser);
    ctx.load(groups);
    ctx.load(props);
    const myGroups = [{ id: 0, title: 'Genie' }];

    await new Promise((resolve, reject) => {
        ctx.executeQueryAsync(
            () => {
                const i = groups.getEnumerator();
                while (i.moveNext()) {
                    const currGrp = i.get_current();
                    myGroups.push({
                        title: currGrp.get_title(),
                        id: currGrp.get_id()
                    });
                }
                SpConfig.cfgMy.profileProps = props.get_userProfileProperties();
                SpConfig.cfgMy.spGroups = myGroups;
                resolve();
            },
            () => reject()
        );
    });
};

export const cfgSetNavStructure = (): void => {
    let newNavName = 'userDefault';
    let navItems = availNav.basicNavStructure;
    SpConfig.cfgMy.spGroups.forEach(grp => {
        let grpNavItems: FuseNavigation[];

        switch (grp.title) {
            case 'Genie':
                grpNavItems = availNav.makeAagtNavStructure();
                break;
            case 'KingMaker':
                grpNavItems = availNav.makeKingMakerNavStructure();
                break;
        }
        navItems = navItems.concat(grpNavItems);
        newNavName += `-${grpNavItems[0].id}`;
    });

    if (cfgNavStructure.name === newNavName) {
        return;
    } else {
        cfgNavStructure.name = newNavName;
        cfgNavStructure.navItems = navItems;
    }

    SpConfig.cfgFuseNavService.register(cfgNavStructure.name, navItems);
    SpConfig.cfgFuseNavService.setCurrentNavigation(cfgNavStructure.name);
};
