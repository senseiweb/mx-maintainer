import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import 'hammerjs';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from 'app/@fake-db';
import { TranslateModule } from '@ngx-translate/core';
import { FuseModule } from '@fuse/fuse.module';
import { FusecLayoutModule } from 'app/fusec-layout/fusec-layout.module';
import { FuseProgressBarModule, FuseSidebarModule } from '@fuse/components';

import { CoreModule, AagtAppConfig } from './core';
import { BreezeBridgeHttpClientModule } from 'breeze-bridge2-angular';
import { AppSharedModule } from './app-shared.module';
import { DashboardModule } from './dashboard';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'environments/environment';

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
    environment.production ?
      [] :
      InMemoryWebApiModule.forRoot(FakeDbService),
    TranslateModule.forRoot(),

    // Material moment date module
    MatMomentDateModule,

    // Fuse modules
    FuseModule.forRoot(AagtAppConfig.defaultFuseConfig),
    FuseProgressBarModule,
    FuseSidebarModule,

    // App modules
    FusecLayoutModule,
    DashboardModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
