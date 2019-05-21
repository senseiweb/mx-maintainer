import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FuseProgressBarModule, FuseSidebarModule } from '@fuse/components';
import { FuseModule } from '@fuse/fuse.module';
import { TranslateModule } from '@ngx-translate/core';
import { FusecLayoutModule } from 'app/fusec-layout/fusec-layout.module';

import 'hammerjs';

import { FuseConfig } from '@fuse/types';

const defaultFuseConfig: FuseConfig = {
    colorTheme: 'theme-default',
    customScrollbars: true,
    layout: {
        style: 'fusec-vertical-layout-1',
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
            position: 'below-fixed'
        },
        footer: {
            customBackgroundColor: true,
            background: 'fuse-navy-900',
            hidden: false,
            position: 'below-fixed'
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
        HttpClientModule,
        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Fuse modules
        FuseModule.forRoot(defaultFuseConfig),
        FuseProgressBarModule,
        FuseSidebarModule,

        // App modules
        FusecLayoutModule
    ],
    exports: [
        BrowserModule,
        BrowserAnimationsModule,
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
            throw new Error(
                'Core Module is injected only once into the main app module'
            );
        }
    }
}
