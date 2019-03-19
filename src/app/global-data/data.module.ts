import { NgModule } from '@angular/core';
import { SpMetadataMetadata } from './models';
import { BreezeBridgeHttpClientModule } from 'breeze-bridge2-angular';
import { SpODataDataService } from './service-adapter/sharepoint-odata-dataservice';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { config, BaseAdapter } from 'breeze-client';
import { CustomDataServiceUtils } from './service-adapter/sp-dataservice-utils';
import { OData3BatchService } from '@odata';
import { EmProviderService, EmProviderConfig } from './repos/';
import { GlobalUserMetadata } from './models/user.model';

const appEntities = [SpMetadataMetadata, GlobalUserMetadata] as any;
let defaultDsAdapter: BaseAdapter;

function configureEm(odataBatchSrvc: OData3BatchService): EmProviderConfig {
    const emConfig = new EmProviderConfig(appEntities);
    const sharepointDataService = new SpODataDataService();
    const dataAdapter = config.initializeAdapterInstance('dataService', sharepointDataService.name, true);
    dataAdapter.utils = new CustomDataServiceUtils();
    dataAdapter.odataService = odataBatchSrvc;
    emConfig.dsAdapter = dataAdapter;
    defaultDsAdapter = dataAdapter;
    return emConfig;
}

@NgModule({
    imports: [BreezeBridgeHttpClientModule],
    exports: [BreezeBridgeHttpClientModule],
    providers: [EmProviderService],
    declarations: []
})
export class GlobalDataModule {
    static forRoot(): ModuleWithProviders {
        console.log('forRoot called');
        return {
            ngModule: GlobalDataModule,
            providers: [
                {
                    provide: EmProviderConfig,
                    useFactory: configureEm,
                    deps: [OData3BatchService]
                }
            ]
        };
    }

    static forFeature(emConfig: EmProviderConfig) {
        emConfig.dsAdapter = defaultDsAdapter;
        return {
            ngModule: GlobalDataModule,
            providers: [
                {
                    provide: EmProviderConfig,
                    useValue: emConfig
                }
            ]
        };
    }
    constructor() {}
}
