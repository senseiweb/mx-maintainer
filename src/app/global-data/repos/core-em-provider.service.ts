import { Injectable } from '@angular/core';

import {
    config,
    DataService,
    EntityManager,
    MetadataStore,
    NamingConvention
} from 'breeze-client';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OData3BatchService } from '@odata';
import {
    cfgApiAddress,
    cfgFeatureSpAppSite,
    MxmAssignedModels
} from 'app/app-config.service';
import * as _ from 'lodash';
import { GlobalDataModule } from '../data.module';
import { CustomNameConventionService } from '../service-adapter/custom-namingConventionDict';
import { SpODataDataService } from '../service-adapter/sharepoint-odata-dataservice';
import { CustomDataServiceUtils } from '../service-adapter/sp-dataservice-utils';

/**
 * Provides data access for the global objects and base
 * objects registration such as the metadata complex object.
 */
@Injectable({ providedIn: GlobalDataModule })
export class GlobalEntityMgrProviderService {
    activate = false;
    entityManager: EntityManager;
    servicePoint: string;
    metadataStore: MetadataStore;
    private dataService: DataService;
    constructor(
        private http: HttpClient,
        private odataService: OData3BatchService,
        private namingDictService: CustomNameConventionService,
        private spDataAdapater: SpODataDataService
    ) {
        this.fetchRequestDigest();
        this.init();
    }

    protected init(): void {
        const dataAdapter = config.initializeAdapterInstance(
            'dataService',
            this.spDataAdapater.name,
            true
        );
        dataAdapter.utils = new CustomDataServiceUtils();
        dataAdapter.odataService = this.odataService;

        this.dataService = new DataService({
            serviceName: cfgApiAddress(''),
            hasServerMetadata: false,
            adapterName: 'SpODataService'
        });

        this.dataService.odataServiceEndpoint = cfgFeatureSpAppSite('');

        const clientToServerNameDictionary = {};

        const convention = this.namingDictService.createNameDictionary(
            'spNameConv',
            NamingConvention.camelCase,
            clientToServerNameDictionary
        );

        convention.setAsDefault();

        const metadataStore = (this.metadataStore = new MetadataStore());

        this.entityManager = new EntityManager({
            dataService: this.dataService,
            metadataStore
        });

        const appModels = MxmAssignedModels.get('Global');

        appModels.forEach(bzScaffold =>
            (bzScaffold as any).prototype.spBzEntity.createTypeForStore(
                metadataStore,
                this.namingDictService,
                'SP.Data'
            )
        );
    }

    private fetchRequestDigest(): void {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json;odata=verbose',
            Accept: 'application/json;odata=verbose'
        });
        this.http
            .post(`${cfgApiAddress('')}contextinfo`, {}, { headers })
            .subscribe(response => {
                const digest =
                    response['d']['GetContextWebInformation'][
                        'FormDigestValue'
                    ];
                let timeout =
                    response['d']['GetContextWebInformation'][
                        'FormDigestTimeoutSeconds'
                    ];
                if (timeout) {
                    timeout *= 1000;
                    setTimeout(() => {
                        this.fetchRequestDigest();
                    }, timeout);
                }
                this.entityManager.dataService.requestDigest = digest;
            });
    }
}
