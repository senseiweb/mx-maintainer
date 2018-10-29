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

import { FuseConfig } from '@fuse/types';

const defaultFuseConfig: FuseConfig = {
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
    FuseModule.forRoot(defaultFuseConfig),
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
  providers: [],
  declarations: []
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('Core Module is injected only once into the main app module');
    }
  }
}
