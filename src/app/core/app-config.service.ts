// import { Injectable } from '@angular/core';
// import { Route, Resolve } from '@angular/router';
// import { FuseConfig, FuseNavigation } from '@fuse/types';
// import { SPUserProfileProperties } from 'app/data/models/sp-user-profile-prop';
// import { BehaviorSubject } from 'rxjs';
// import { HttpHeaders } from '@angular/common/http';

// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
// export type aagtNavUnion = aagtNav | routeNav;
// export type aagtNav = Omit<FuseNavigation, 'children'>;
// export type routeNav = Omit<Route, 'children'>;


// export interface IAppInitData {
//     requestDigestRaw: string;
//     appWebUrl: string;
//     currUser: IUserInitData;
//     configSettings?: any[];
// }
// export interface IUserInitData {
//     id: string;
//     loginName: string;
//     profileProperties: SPUserProfileProperties;
//     groups?: any[];
// }

// @Injectable({ providedIn: 'root' })
// export class AppConfigService implements Resolve<any> {

//     static defaultFuseConfig: FuseConfig = {
//         colorTheme: 'theme-default',
//         customScrollbars: true,
//         layout: {
//             style: 'fusec-vertical-layout-3',
//             width: 'fullwidth',
//             navbar: {
//                 primaryBackground: 'fuse-navy-700',
//                 secondaryBackground: 'fuse-navy-900',
//                 folded: false,
//                 hidden: false,
//                 position: 'left',
//                 variant: 'fusec-vertical-style-2'
//             },
//             toolbar: {
//                 customBackgroundColor: false,
//                 background: 'fuse-white-500',
//                 hidden: false,
//                 position: 'above-fixed',
//             },
//             footer: {
//                 customBackgroundColor: true,
//                 background: 'fuse-navy-900',
//                 hidden: false,
//                 position: 'above-static'
//             },
//             sidepanel: {
//                 hidden: false,
//                 position: 'right'
//             }
//         }
//     };

//     // private mxMaintainerContextSite = 'https://cs2.eis.af.mil/sites/10918/mx-maintainer';
//     private mxMaintainerContextSite = '';
//     requestDigestKey: string;
//     requestDigestExpire: Date;
//     rawRequestDigest: string;
//     currentUser = {} as IUserInitData;
//     siteUrl: string;
//     initSpConfigData: Array<{ id: number, configKey: string; configValue: string }>;

//     constructor() {
//         const lclStorage = localStorage.getItem('AppConfig');
//         const initConfig = lclStorage ? JSON.parse(lclStorage) : this.demoConfig as IAppInitData;
//         this.rawRequestDigest = initConfig.requestDigestRaw;
//         this.requestDigestKey = initConfig.requestDigestRaw.split(',')[0];
//         this.requestDigestExpire = new Date(initConfig.requestDigestRaw.split(',')[1]);
//         this.siteUrl = initConfig.appWebUrl;
//         this.currentUser = initConfig.currUser;
//         this.initSpConfigData = initConfig.configSettings || [];
//     }
// }
