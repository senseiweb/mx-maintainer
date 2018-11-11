// import { Injectable } from '@angular/core';
// import { AagtModule } from 'app/aagt/aagt.module';
// import {
//     BaseRepoService,
//     EmProviderService,
//     MxAppEnum,
//     SpDataRepoService
// } from 'app/data';
// import { MxFilterTag } from 'app/data';
// import * as breeze from 'breeze-client';

// @Injectable({ providedIn: AagtModule })
// export class TagRepoService extends BaseRepoService<MxFilterTag> {
//     private gotTags = false;
//     constructor (
//         entityService: EmProviderService,
//         private spData: SpDataRepoService
//     ) {
//         super('MxFilterTag', entityService);
//     }

//     async fetchTags(): Promise<MxFilterTag[]> {
//         if (this.gotTags) {
//             return Promise.resolve(this.entityManager.getEntities(
//                 this.entityType.shortName
//             ) as MxFilterTag[]);
//         }
//         try {
//             const tags = await this.spData.fetchAppTags(MxAppEnum.aagt);
//             this.gotTags = true;
//             tags.forEach(tag => {
//                 this.entityManager.createEntity(
//                     this.entityType.shortName,
//                     tag,
//                     breeze.EntityState.Unchanged
//                 );
//             });
//             return Promise.resolve(this.entityManager.getEntities(
//                 this.entityType.shortName
//             ) as MxFilterTag[]);
//         } catch (e) {
//             this.queryFailed(e);
//         }
//     }
// }
