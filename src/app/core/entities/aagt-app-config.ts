import { Injectable } from '@angular/core';
import { SPUserProfileProperties } from './sp-user-profile-prop';

export interface AppInitData {
  requestDigestRaw: string;
  appWebUrl: string;
  currUser: UserInitData;
}
export interface UserInitData {
  id: string;
  loginName: string;
  profileProperties: SPUserProfileProperties;
  groups: Array<UserGrpInitData>;
}
export interface UserGrpInitData {
  id: number;
  title: string;
}

@Injectable()
export class AagtAppConfig {
  requestDigestKey: string;
  requestDigestExpire: Date;
  rawRequestDigest: string;
  currentUser = {} as UserInitData;
  appWebUrl: string;

  constructor() {
    const initConfig = JSON.parse(localStorage.getItem('AppConfig')) as AppInitData;
    this.rawRequestDigest = initConfig.requestDigestRaw;
    this.requestDigestKey = initConfig.requestDigestRaw.split(',')[0];
    this.requestDigestExpire = new Date(initConfig.requestDigestRaw.split(',')[1]);
    this.appWebUrl = initConfig.requestDigestRaw;
    this.currentUser = initConfig.currUser;
  }


}
