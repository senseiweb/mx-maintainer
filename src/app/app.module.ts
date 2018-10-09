import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppSharedModule,
    BreezeBridgeHttpClientModule,
    HttpClientModule,
    TranslateModule.forRoot(),

    // Material moment date module
    MatMomentDateModule,

    // Fuse modules
    FuseModule.forRoot(AagtAppConfig.defaultFuseConfig),
    FuseProgressBarModule,
    FuseSidebarModule,

    // App modules
    AppRoutingModule,
    FusecLayoutModule,
    DashboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
