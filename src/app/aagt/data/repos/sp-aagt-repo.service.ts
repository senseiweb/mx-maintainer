// import { Injectable } from '@angular/core';
// import { BaseSpJsom, SpRepoService, BaseRepoService } from 'app/data/repos/';
// import { AagtListName } from '../models';
// import { AagtModule } from 'app/aagt/aagt.module';
// import { AagtDataModule } from '../aagt-data.module';

// @Injectable({providedIn: AagtDataModule})
// export class SpAagtRepoService extends BaseSpJsom {

//     private teamTypeLookup: string[];
//     private isoLookup: string[];

//     constructor() {
//         super('/aagt');
//         // this.init();
//     }

//     // init(): void {
//     //     this.getSpContext();
//     // }

//     // async getTeamTypeLookup(): Promise<string[]> {
//     //     if (this.teamTypeLookup) {
//     //        return Promise.resolve(this.teamTypeLookup);
//     //     }
//     //     this.teamTypeLookup = await this.getChoiceValues(AagtListName.ActionItem, 'TeamType');
//     //     console.log(this.teamTypeLookup);
//     //     return this.teamTypeLookup;
//     // }

//     // async getIsoLookup(): Promise<string[]> {
//     //     if (this.isoLookup) {
//     //        return Promise.resolve(this.isoLookup);
//     //     }
//     //     this.isoLookup = await this.getChoiceValues(AagtListName.Gen, 'Iso');
//     //     return this.isoLookup;
//     // }
// }
