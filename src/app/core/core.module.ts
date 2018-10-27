import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import 'hammerjs';

import { HttpClientModule } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeAagtDbService } from 'app/@fake-db';
import { TranslateModule } from '@ngx-translate/core';
import { FuseModule } from '@fuse/fuse.module';
import { FusecLayoutModule } from 'app/fusec-layout/fusec-layout.module';
import { FuseProgressBarModule, FuseSidebarModule } from '@fuse/components';
import { BreezeBridgeHttpClientModule } from 'breeze-bridge2-angular';
import { environment } from 'environments/environment';

import { AppConfigService } from './app-config.service';
import { UserService } from './app-user.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BreezeBridgeHttpClientModule,
    HttpClientModule,
    environment.production || environment.sharepoint ?
    [] :
    InMemoryWebApiModule.forRoot(FakeAagtDbService),
    TranslateModule.forRoot(),

    // Material moment date module
    MatMomentDateModule,

    // Fuse modules
    FuseModule.forRoot(AppConfigService.defaultFuseConfig),
    FuseProgressBarModule,
    FuseSidebarModule,

    // App modules
    FusecLayoutModule,
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    BreezeBridgeHttpClientModule,
    HttpClientModule,

    // Material moment date module
    MatMomentDateModule,

    // Fuse modules
    FuseProgressBarModule,
    FuseSidebarModule,

    // App modules
    FusecLayoutModule
  ],
  providers: [UserService, AppConfigService],
  declarations: []
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('Core Module is injected only once into the main app module');
    }
  }
}
