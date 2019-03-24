import { IAppConfig } from '@ctypes/app-config';
import { Injectable } from '@angular/core';
import * as availNav from 'app/core/app-nav-structure';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigation } from '@fuse/types';
import { SPUserProfileProperties } from './global-data';

@Injectable({ providedIn: 'root' })
export class AppConfig implements IAppConfig {
    webApplicationSite = 'http://localhost:4202';
    sharepointMainAppSite = '';
    spClientCtx: SP.ClientContext;
    fuseNavigation: FuseNavigationService;
    navStructure = {
        name: '',
        navItems: [] as FuseNavigation[]
    };
    spWeb: SP.Web;
    my: {
        id: string;
        lastName: string;
        firstName: string;
        spAccountName: string;
        profileProps: SPUserProfileProperties;
        spGroups: Array<{ id: number; title: string }>;
    };

    constructor() {
        this.my = {} as any;
        this.my.spGroups = [];
        console.log('appConfig initialized');
    }

    featureSpAppSite(appName: string): string {
        const site = `${this.sharepointMainAppSite}/mx-maintainer${appName}/_api/`;
        return site.replace('mx-maintainer//', 'mx-maintainer/');
    }

    apiAddress(appName: string): string {
        const site = `${this.webApplicationSite}/mx-maintainer/${appName}/_api/`;
        return site.replace('mx-maintainer//', 'mx-maintainer/')
        ;
    }

    async fetchUserData(): Promise<void> {
        const ctx = this.spClientCtx;
        const peopleManager = new SP.UserProfiles.PeopleManager(ctx);
        const oUser = this.spWeb.get_currentUser();
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
                    this.my.profileProps = props.get_userProfileProperties();
                    this.my.spGroups = myGroups;
                    resolve();
                },
                () => reject()
            );
        });
    }

    setNavStructure(): void {
        let newNavName = 'userDefault';
        let navItems = availNav.basicNavStructure;
        this.my.spGroups.forEach(grp => {
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

        if (this.navStructure.name === newNavName) {
            return;
        } else {
            this.navStructure.name = newNavName;
            this.navStructure.navItems = navItems;
        }

        this.fuseNavigation.register(this.navStructure.name, navItems);
        this.fuseNavigation.setCurrentNavigation(this.navStructure.name);
    }
}
