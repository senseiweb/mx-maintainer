import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigation } from '@fuse/types';
import * as availNav from 'app/core/app-nav-structure';
import { SPUserProfileProperties } from 'app/data';
import { environment } from 'environments/environment';
import { SpRepoService } from './sp-repo.service';

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

    constructor(
        private spRootData: SpRepoService,
        private fuseNavigation: FuseNavigationService
    ) {
        if (!environment.production) {
            this.myGroups.push({ id: 0, title: 'Genie' });
        }
    }

    async resolve(): Promise<any> {
        this.profileProps = this.spRootData.peopleManager
            .getMyProperties()
            .get_userProfileProperties();

        this.id = this.spRootData.spUser.get_id();
        this.spAccountName = this.spRootData.spUser.get_userId();
        const groups = this.spRootData.spUser.get_groups();
        const iterator = groups.getEnumerator();
        while (iterator.moveNext()) {
            const currRec = iterator.get_current();
            this.myGroups.push({
                title: currRec.get_title(),
                id: currRec.get_id()
            });
        }
        this.setNavStructure();
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
