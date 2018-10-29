import { Injectable } from '@angular/core';

import * as availNav from 'app/core/app-nav-structure';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { SPUserProfileProperties } from 'app/data';
import { SpDataRepoService } from './sp-data-repo.service';
import { FuseNavigation } from '@fuse/types';

export interface UserGrpInitData {
  id: number;
  title: string;
}

// @Injectable()
// export class UserService {
//   requestDigestExpiration = 0;
//   requsstDigestToken = '';
//   id: number;
//   saluation = {
//     lastName: 'lastName',
//     firstName: 'firstName',
//     title: '',
//     rankName: () => `${this.saluation.firstName} ${this.saluation.lastName}`
//   };
//   getRequestDigest = () => 'digest';
//  }

@Injectable({providedIn: 'root'})
export class UserService implements Resolve<any> {

  myGroups: Array<{ id: number, title: string }> = [];
  preferredTheme = '';
  profileProps: SPUserProfileProperties  = {};
  requestDigestExpiration = 0;
  requestDigestToken = '';
  defaultNavStructure: Array<FuseNavigation> = [];
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
      this.myGroups.push({ id: 1, title: 'KingMaker' });
    }
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
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
        clCtx.executeQueryAsync(resolve, (sender, error) => {
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
    if (this.defaultNavStructure.length) { return; }
    this.defaultNavStructure = availNav.basicNavStructure;
    this.myGroups.forEach(grp => {
      switch (grp.title) {
        case 'Genie':
          this.defaultNavStructure.concat(availNav.makeAagtNavStructure());
          break;
        case 'KingMaker':
          this.defaultNavStructure.concat(availNav.kingMakerNavStructure);
          break;
      }
    });
    this.fuseNavigation.register('userDefault', this.defaultNavStructure);
    this.fuseNavigation.setCurrentNavigation('userDefault');
  }
}
