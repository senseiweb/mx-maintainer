// import { Injectable } from '@angular/core';
// import * as breeze from 'breeze-client';
// import { EmProviderService } from 'app/data';
// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Resolve } from '@angular/router';
// import { SpConfigData, configKeyEnum } from '../models';

// const configList = `lists/getbytitle('SpConfigData')/items`;

// @Injectable({
//   providedIn: 'root'
// })
// export class AagtConfigurationService implements Resolve<any> {

//   cachedConfigData: configKeyEnum[] = [];

//   constructor(private entityService: EmProviderService,
//     private http: HttpClient) { }

//   resolve(): void {
//     if (this.cachedConfigData.length) {
//       console.log();
//     }
//     const serviceUrl = `${this.entityService.servicePoint}/${configList}`;
//     const config = this.http.get(serviceUrl);
//     console.log(config);
//   }

//   async fetchAagtConfig(): Promise<any> {
//     if (this.cachedConfigData.length) {
//       return Promise.resolve();
//     }
//     const serviceUrl = `${this.entityService.servicePoint}/${configList}`;
//     const config = await this.http.get(serviceUrl);
//     console.log(config);
//   }
// }
