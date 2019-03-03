import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigation } from '@fuse/types';
import * as availNav from 'app/core/app-nav-structure';
import { SPUserProfileProperties } from 'app/data';
import { environment } from 'environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface IUserGrpInitData {
    id: number;
    title: string;
}

@Injectable({ providedIn: 'root' })
export class AppUserService implements Resolve<any> {

    appConfigDate = {
        siteUrl: 'http://localhost:8080/sites/mxmaintainer'
    };

    headers: HttpHeaders;

    myGroups: Array<{ id: number, title: string }> = [];
    preferredTheme = '';
    onProfilePropsChange: BehaviorSubject<SPUserProfileProperties>;
    onRequestDigestChange: BehaviorSubject<string>;
    onUserGroupsChange: BehaviorSubject<{id: number, title: string}[]>
    navStructure = {
        name: '',
        navItems: [] as FuseNavigation[]
    };

    id: number;
    saluation = {
        lastName: '',
        firstName: '',
        title: '',
        rankName: () => `${this.saluation.firstName} ${this.saluation.lastName}`
    };

    spAccountName;

    constructor(
        private http: HttpClient,
        private fuseNavigation: FuseNavigationService
    ) {
        if (!environment.production) {
            this.myGroups.push({ id: 0, title: 'Genie' });
        }
        this.onRequestDigestChange = new BehaviorSubject('');
        this.onProfilePropsChange = new BehaviorSubject({});
        this.onUserGroupsChange = new BehaviorSubject([]);
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json;odata=verbose',
            'Accept': 'application/json;odata=verbose'
        });
    }

    async resolve(): Promise<any> {
        const preLoad = [
            this.fetchRequestDigest(),
            this.fetchUserProfileProperties(),
            this.fetchUserGroups()
        ]
        return new Promise(async (resolve, reject) => {
            try {
                await Promise.all(preLoad);
                resolve();
            } catch (e) {
                console.log(e);
                reject();
            }
        });
    }

    private fetchRequestDigest(): void {
        const httpOptions = { headers: this.headers };
        this.http.post(`${this.appConfigDate.siteUrl}/_api/contextinfo`, {}, httpOptions)
            .subscribe(response => {
                console.log(response);
                const digest = response['d']['GetContextWebInformation']['FormDigestValue'];
                let timeout = response['d']['GetContextWebInformation']['FormDigestTimeoutSeconds'];
                if (timeout) {
                    timeout *= 1000;
                    setTimeout(() => {
                        this.fetchRequestDigest();
                    }, timeout);
                }
                this.onRequestDigestChange.next(digest);
            });
    }

    private fetchUserProfileProperties(): void {
        const httpOptions = { headers: this.headers };
        this.http.post(`${this.appConfigDate.siteUrl}/_api/SP.UserProfiles.PeopleManager/GetMyProperties`,
            {}, httpOptions)
            .subscribe(response => {
                if (!response) {
                    console.log('bad response');
                    return;
                }
                const props = response['d']['UserProfileProperties']['results'] as any[];
                const profileProps: SPUserProfileProperties = {};
                props.forEach(p => {
                    profileProps[p.Key] = p.Value;
                })
                console.log(profileProps);
                this.saluation.firstName = profileProps.FirstName;
                this.saluation.lastName = profileProps.LastName;
                this.onProfilePropsChange.next(profileProps);
            });
    }

    private async fetchUserGroups(): Promise<void> {
        const ctx = SP.ClientContext.get_current();
        const ctxWeb = ctx.get_web();
        const spUser = ctxWeb.get_currentUser();
        spUser.retrieve();
        const userGroups = spUser.get_groups();
        ctx.load(ctxWeb);
        ctx.load(spUser);
        ctx.load(userGroups);
        const groups = [];
        try {
            await ctx.executeQueryAsync(() => {
                const i = userGroups.getEnumerator();
                while (i.moveNext()) {
                    const currGrp = i.get_current();
                    groups.push({
                        title: currGrp.get_title(),
                        id: currGrp.get_id()
                    });
                }
            });
            console.log(groups);
            console.log(spUser);
            this.onUserGroupsChange.next(groups as any);
            Promise.resolve(groups);
        } catch (error) {
            return Promise.reject();
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
