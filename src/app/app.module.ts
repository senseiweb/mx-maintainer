import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import 'hammerjs';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { FuseModule } from '@fuse/fuse.module';
import { fuseConfig } from './fuse-config';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { LayoutModule } from './layout/layout.module';

import { CoreModule } from './core';
import { BreezeBridgeHttpClientModule } from 'breeze-bridge2-angular';
import { DashboardModule } from './dashboard';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BreezeBridgeHttpClientModule,
    HttpClientModule,
    DashboardModule,
    TranslateModule.forRoot(),

    // Material moment date module
    MatMomentDateModule,
    // Material
    MatButtonModule,
    MatIconModule,

    // Fuse modules
    FuseModule.forRoot(fuseConfig),
    FuseProgressBarModule,
    FuseSidebarModule,
    FuseSharedModule,
    FuseThemeOptionsModule,

    // App modules
    CoreModule,
    LayoutModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
