import { NgModule } from '@angular/core';
import { SpMetadataMetadata } from './global-models';
import { EmProviderService, EmProviderConfig } from './global-repos/';

import { BreezeBridgeHttpClientModule } from 'breeze-bridge2-angular';

import { ModuleWithProviders } from '@angular/compiler/src/core';

const appEntities = [SpMetadataMetadata] as any;

@NgModule({
    imports: [BreezeBridgeHttpClientModule],
    exports: [BreezeBridgeHttpClientModule],
    providers: [EmProviderService],
    declarations: []
})
export class DataModule {
    static forRoot(): ModuleWithProviders {
        const mainConfig = new EmProviderConfig(appEntities);
        return {
            ngModule: DataModule,
            providers: [
                {
                    provide: EmProviderConfig,
                    useValue: mainConfig
                }
            ]
        };
    }

    static forFeature(config: EmProviderConfig) {
        return {
            ngModule: DataModule,
            providers: [
                {
                    provide: EmProviderConfig,
                    useValue: config
                }
            ]
        };
    }
    constructor() {}
}
