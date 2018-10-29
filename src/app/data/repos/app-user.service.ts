import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as availNav from 'app/core/app-nav-structure';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
// import { environment } from 'environments/environment';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { SPUserProfileProperties } from 'app/data';
import { SpDataRepoService } from './sp-data-repo.service';

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
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-RequestDigest': ''
    })
  };
  myGroups: Array<{ id: number, title: string }> = [];
  preferredTheme = '';
  profileProps: SPUserProfileProperties  = {};
  requestDigestExpiration = 0;
  requsstDigestToken = '';
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
    private http: HttpClient,
    private spData: SpDataRepoService,
    private fuseNavigation: FuseNavigationService
  ) {

    // if (!environment.production) {
    //   this.myGroups.push({ id: 0, title: 'Genie' });
    //   this.myGroups.push({ id: 1, title: 'KingMaker' });
    // }
    // this.setNavStructure();
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

  getRequestDigest(): string {
    if (this.requestDigestExpiration > 2) {
      return this.requsstDigestToken;
    }

    this.http.post(`${this.spData.situeUrl}\\_api\\contextinfo`, this.httpOptions)
      .pipe(catchError(this.handleError))
      .subscribe((data) => {
        console.log(data);
        // Perform logic for new digest expiration
        return data['RequestDigest'];
      });

  }

  setNavStructure(): void {
    const defaultNavStructure = availNav.basicNavStructure;
    this.myGroups.forEach(grp => {
      switch (grp.title) {
        case 'Genie':
          defaultNavStructure.concat(availNav.makeAagtNavStructure());
          break;
        case 'KingMaker':
          defaultNavStructure.concat(availNav.kingMakerNavStructure);
          break;
      }
      this.fuseNavigation.register('userDefault', defaultNavStructure);
      this.fuseNavigation.setCurrentNavigation('userDefault');
    });
  }



  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
