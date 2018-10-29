import { Injectable } from '@angular/core';
import { SPUserProfileProperties } from 'app/data/models/sp-user-profile-prop';
import { FuseConfig, FuseNavigation } from '@fuse/types';
import { Route } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type aagtNavUnion = aagtNav | routeNav;
export type aagtNav = Omit<FuseNavigation, 'children'>;
export type routeNav = Omit<Route, 'children'>;


export interface AppInitData {
  requestDigestRaw: string;
  appWebUrl: string;
  currUser: UserInitData;
  configSettings?: any[];
}
export interface UserInitData {
  id: string;
  loginName: string;
  profileProperties: SPUserProfileProperties;
  groups?: Array<any>;
}

@Injectable({providedIn: 'root'})
export class AppConfigService {

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
        position: 'above-static'
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
  siteUrl: string;
  initSpConfigData: { id: number, configKey: string; configValue: string }[];
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
    const lclStorage = localStorage.getItem('AppConfig');
    const initConfig = lclStorage ? JSON.parse(lclStorage) : this.demoConfig as AppInitData;
    this.rawRequestDigest = initConfig.requestDigestRaw;
    this.requestDigestKey = initConfig.requestDigestRaw.split(',')[0];
    this.requestDigestExpire = new Date(initConfig.requestDigestRaw.split(',')[1]);
    this.siteUrl = initConfig.appWebUrl;
    this.currentUser = initConfig.currUser;
    this.initSpConfigData = initConfig.configSettings || [];
  }
}
