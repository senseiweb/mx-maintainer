import { Injectable } from '@angular/core';
import { SPUserProfileProperties } from './entities/sp-user-profile-prop';
import { FuseConfig, FuseNavigation } from '@fuse/types';
import { Route } from '@angular/router';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type aagtNavUnion = aagtNav | routeNav;
export type aagtNav = Omit<FuseNavigation, 'children'>;
export type routeNav = Omit<Route, 'children'>;

export interface AagtNavigationItem extends aagtNav, routeNav {
  children?: Array<aagtNav | routeNav>;
}

export interface AppInitData {
  requestDigestRaw: string;
  appWebUrl: string;
  currUser: UserInitData;
}
export interface UserInitData {
  id: string;
  loginName: string;
  profileProperties: SPUserProfileProperties;
  groups?: Array<UserGrpInitData>;
}
export interface UserGrpInitData {
  id: number;
  title: string;
}
@Injectable()
export class AagtAppConfig {

  static defaultFuseConfig: FuseConfig = {
    colorTheme: 'theme-default',
    customScrollbars: true,
    layout: {
      style: 'fusec-vertical-layout-3',
      width: 'fullwidth',
      navbar: {
        primaryBackground: 'fuse-navy-700',
        secondaryBackground: 'fuse-navy-900',
        folded: false,
        hidden: false,
        position: 'left',
        variant: 'fusec-vertical-style-2'
      },
      toolbar: {
        customBackgroundColor: false,
        background: 'fuse-white-500',
        hidden: false,
        position: 'above-fixed',
      },
      footer: {
        customBackgroundColor: true,
        background: 'fuse-navy-900',
        hidden: false,
        position: 'below-fixed'
      },
      sidepanel: {
        hidden: false,
        position: 'right'
      }
    }
  };

  requestDigestKey: string;
  requestDigestExpire: Date;
  rawRequestDigest: string;
  currentUser = {} as UserInitData;
  appWebUrl: string;
  demoConfig: AppInitData = {
    requestDigestRaw: '3728829323,10-Oct-2018',
    appWebUrl: 'https://example.com',
    currUser: {
      id: '1232',
      loginName: '1039302',
      profileProperties: {
      }
    }
  };

  constructor() {
    const spConfigInit = localStorage.getItem('AppConfig');
    const initConfig = spConfigInit ? JSON.parse(spConfigInit) : this.demoConfig as AppInitData;
    this.rawRequestDigest = initConfig.requestDigestRaw;
    this.requestDigestKey = initConfig.requestDigestRaw.split(',')[0];
    this.requestDigestExpire = new Date(initConfig.requestDigestRaw.split(',')[1]);
    this.appWebUrl = initConfig.requestDigestRaw;
    this.currentUser = initConfig.currUser;
  }

  fuseNavigation: Array<AagtNavigationItem> = [];
}
