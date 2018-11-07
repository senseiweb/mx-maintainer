import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigation } from '@fuse/types';
import * as availNav from 'app/core/app-nav-structure';
import { SPUserProfileProperties } from 'app/data';
import { environment } from 'environments/environment';
import { SpDataRepoService } from './base-spjsom-repo.service';

export interface IUserGrpInitData {
    id: number;
    title: string;
}

@Injectable({ providedIn: 'root' })
export class UserService implements Resolve<any> {

    myGroups: Array<{ id: number, title: string }> = [];
    preferredTheme = '';
    profileProps: SPUserProfileProperties = {};
    requestDigestExpiration = 0;
    requestDigestToken = '';
    navStructure = {
        name: '',
        navItems: [] as FuseNavigation[]
    };

    id: number;
    saluation = {
        lastName: this.profileProps.LastName,
        firstName: this.profileProps.FirstName,
        title: '',
        rankName: () => `${this.saluation.firstName} ${this.saluation.lastName}`
    };
    spAccountName;
    // fuseNavigation = {} as any;
    // spData = {} as any;
    // http = {} as any;

    constructor(
        private spData: SpDataRepoService,
        private fuseNavigation: FuseNavigationService
    ) {

        if (!environment.production) {
            this.myGroups.push({ id: 0, title: 'Genie' });
        }
    }

    async resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<any> {
        const clCtx = this.spData.spClientCtx;
        const spUserProfile = this.spData.peopleManger.getMyProperties();
        const spUserInfo = this.spData.clientWeb.get_currentUser();
        spUserInfo.retrieve();
        const userGroups = spUserInfo.get_groups();
        clCtx.load(spUserInfo);
        clCtx.load(userGroups);
        clCtx.load(spUserProfile);
        try {
            await new Promise((resolve, reject) => {
                clCtx.executeQueryAsync(resolve, (_sender, error) => {
                    reject(error.get_message());
                });
            });
            this.id = spUserInfo.get_id();
            this.spAccountName = spUserInfo.get_userId();
            this.profileProps = spUserProfile.get_userProfileProperties();
            const grpIterator = userGroups.getEnumerator();
            while (grpIterator.moveNext()) {
                this.myGroups.push({
                    title: grpIterator.get_current().get_title(),
                    id: grpIterator.get_current().get_id()
                });
            }
        } catch (error) {
            console.error(`error getting user info ==> ${error}`);
        }
    }

    logout(): void {
    }

    setNavStructure(): void {
        let newNavName = 'userDefault';
        let navItems = availNav.basicNavStructure;

        this.myGroups.forEach(grp => {
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
        console.log(`Name Created: ${newNavName}`);
        console.log(this.navStructure);
        this.fuseNavigation.register(this.navStructure.name, navItems);
        this.fuseNavigation.setCurrentNavigation(this.navStructure.name);
    }
}
