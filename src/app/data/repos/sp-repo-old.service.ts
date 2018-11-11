// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Resolve } from '@angular/router';
// import * as moment from 'moment';
// import { Observable, Observer } from 'rxjs';
// import { ScriptKey, ScriptModel, ScriptStore } from '../../app-script-model';
// import { MxAppEnum, MxFilterTag, SPUserProfileProperties } from '../models';

// @Injectable({ providedIn: 'root' })
// // At times it is easier to retrieve things using the
// // the sharepoint JSOM libraries and cached them for later use
// export class SpDataRepoService implements Resolve<any> {
//     mxMaintainerContextSite = 'https://cs2.eis.af.mil/sites/10918/mx-maintainer';
//     followingManager: SP.Social.SocialFollowingManager;
//     actorInfo: SP.Social.SocialActorInfo;
//     spClientCtx: any;
//     situeUrl: string;
//     private scripts: ScriptModel[] = [];
//     clientWeb: any;
//     peopleManger: any;
//     isInitializer = false;
//     filterTags: MxFilterTag[];
//     SP: any;
//     constructor (
//         private http: HttpClient
//     ) {
//         this.situeUrl = this.mxMaintainerContextSite;
//         this.spClientCtx = {
//             load: () => { },
//             executeQueryAsync: (resolve) => resolve()
//         };
//         this.SP = {
//             ClientContext: {
//                 get_current: () => { }
//             },
//             UserProfiles: {
//                 PeopleManager: {},
//             },
//             Social: {
//                 SocialActorInfo: () => { }
//             }
//         };
//         this.peopleManger = {
//             getMyProperties: () => {
//                 return {
//                     get_userProfileProperties: () => {
//                         const props = {} as SPUserProfileProperties;
//                         props.LastName = 'Smith';
//                         props.FirstName = 'Agent';
//                         return props;
//                     }
//                 };
//             }
//         };
//         this.clientWeb = {
//             get_currentUser: (): SP.User => {
//                 const demoUser: SP.User | any = {};
//                 demoUser.get_id = () => 920;
//                 demoUser.get_userId = () => 'i0:#/3893234';
//                 demoUser.get_email = () => 'me@me.com';
//                 demoUser.retrieve = () => 'Hello World';

//                 demoUser.get_groups = () => {
//                     return {
//                         getEnumerator: () => {
//                             return { moveNext: () => false };
//                         }
//                     };
//                 };
//                 return demoUser;
//             },
//         };
//     }

//     async resolve(): Promise<any> {
//         if (this.isInitializer) { return Promise.resolve(); }
//         // const digestValue = await this.getRequestDigest(this.mxMaintainerContextSite);
//         let data = await this.http
//             .get(`${this.mxMaintainerContextSite}/_api/web/list/('MxFilterTag')/items`)
//             .toPromise() as any;
//         data = JSON.parse(data);
//         this.filterTags = data.d.results;
//         console.log(this.filterTags);
//         this.isInitializer = true;
//     }

//     async fetchAppTags(_supportedApp: MxAppEnum): Promise<MxFilterTag[]> {
//         return Promise.resolve(this.filterTags);
//     }

//     async getRequestDigest(_contextSite: string): Promise<{ rawDigest: string, localExpireTime: moment.Moment }> {
//         return Promise.resolve({ rawDigest: 'jdjskekjlafjkljakfdpaieoapinadsafdafda', localExpireTime: moment() });
//     }

//     //   private spQueryBuild(spQueryPart: string): SP.CamlQuery {
//     //     const query = new SP.CamlQuery();
//     //     query.set_viewXml(`
//     //       <View>
//     //         <Query>
//     //           <Where>
//     //           ${spQueryPart}
//     //           </Where>
//     //         </Query>
//     //       </View>
//     //     `);
//     //     return query;
//     //   }

//     load(key: ScriptKey): Observable<ScriptModel> {
//         return new Observable<ScriptModel>((observer: Observer<ScriptModel>) => {
//             const script = ScriptStore.find(s => s.id === key);

//             // Complete if already loaded
//             if (script && script.loaded) {
//                 observer.next(script);
//                 observer.complete();
//             } else {
//                 this.scripts = [...this.scripts, script];

//                 const scriptElement = document.createElement('script');
//                 scriptElement.type = 'text/javascript';
//                 scriptElement.src = script.path;
//                 scriptElement.onload = () => {
//                     script.loaded = true;
//                     observer.next(script);
//                     observer.complete();
//                 };
//                 scriptElement.onerror = (_error: any) => {
//                     observer.error(`Failure loading secondary scripts: ${script.id}`);
//                 };

//                 document.getElementsByTagName('body')[0].appendChild(scriptElement);
//             }
//         });
//     }
// }
