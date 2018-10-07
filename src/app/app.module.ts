import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import 'hammerjs';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FuseModule } from '@fuse/fuse.module';
import { FusecLayoutModule } from 'app/fusec-layout/fusec-layout.module';
import { FuseProgressBarModule, FuseSidebarModule } from '@fuse/components';

import { CoreModule, AagtAppConfig } from './core';
import { BreezeBridgeHttpClientModule } from 'breeze-bridge2-angular';
import { AppSharedModule } from './app-shared.module';
import { DashboardModule } from './dashboard';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppSharedModule,
    BreezeBridgeHttpClientModule,
    HttpClientModule,
    DashboardModule,
    TranslateModule.forRoot(),

    // Material moment date module
    MatMomentDateModule,

    // Fuse modules
    FuseModule.forRoot(AagtAppConfig.defaultFuseConfig),
    FuseProgressBarModule,
    FuseSidebarModule,

    // App modules
    CoreModule,
    FusecLayoutModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
