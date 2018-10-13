import { Injectable } from '@angular/core';
import { SPUserProfileProperties } from './entities/sp-user-profile-prop';
import { FuseConfig, FuseNavigation } from '@fuse/types';
import { Route } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { basicNavStructure, genMgrNavStructure } from './app-nav-structure';
import { SpConfigData } from './entities';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type aagtNavUnion = aagtNav | routeNav;
export type aagtNav = Omit<FuseNavigation, 'children'>;
export type routeNav = Omit<Route, 'children'>;


export interface AppInitData {
  requestDigestRaw: string;
  appWebUrl: string;
  currUser: UserInitData;
  configSettings?: SpConfigData[];
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
  appWebUrl: string;
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

  userNavStructure: Array<FuseNavigation> = basicNavStructure;

  constructor(fuseNavService: FuseNavigationService) {
    const lclStorage = localStorage.getItem('AppConfig');
    const initConfig = lclStorage ? JSON.parse(lclStorage) : this.demoConfig as AppInitData;
    this.rawRequestDigest = initConfig.requestDigestRaw;
    this.requestDigestKey = initConfig.requestDigestRaw.split(',')[0];
    this.requestDigestExpire = new Date(initConfig.requestDigestRaw.split(',')[1]);
    this.appWebUrl = initConfig.appWebUrl;
    this.currentUser = initConfig.currUser;
    this.initSpConfigData = initConfig.configSettings || [];
    this.currentUser.groups.push({ title: 'Genie', id: 9 });
    this.currentUser.groups.push({ title: 'KingMaker', id: 10 });
    this.addGroupBasedNav(this.currentUser.groups);
    fuseNavService.register('default', this.userNavStructure);
    fuseNavService.setCurrentNavigation('default');
  }

  private addGroupBasedNav(grpData: UserGrpInitData[]): void {
    if (!grpData.length) { return; }
    grpData.forEach(grp => {
      switch (grp.title) {
        case 'Genie':
          this.userNavStructure = this.userNavStructure.concat(genMgrNavStructure);
          break;
      }
    });
  }
}
