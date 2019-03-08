import { Injectable } from '@angular/core';
import {
    EntityManager,
    AutoGeneratedKeyType,
    config,
    DataService,
    EntityType,
    NamingConvention
} from 'breeze-client';
import { CustomNameConventionService } from '../service-adapter.ts/custom-namingConventionDict';
import * as eb from '../models/_entity-base';
import { EmProviderConfig } from './em-provider-config';
import { BehaviorSubject } from 'rxjs';
import { AppUserService } from './app-user.service';
import { SpDataserviceAdapter } from '../service-adapter.ts/custom-sp-data-adapter';

@Injectable({ providedIn: 'root' })
export class EmProviderService {
    activate = false;
    entityManager: EntityManager ;
    servicePoint: string;
    onRequestDigestChange: BehaviorSubject<string>;

    constructor(private emCfg: EmProviderConfig,
        private spDataProvider: SpDataserviceAdapter,
        private namingDict: CustomNameConventionService,
        private appUserSvc: AppUserService) {
        this.init();
    }

    protected init(): void {

        const dataAdapter = config.initializeAdapterInstance('dataService', 'SpCustomOData', true) as any;

        this.appUserSvc.onRequestDigestChange
            .subscribe(digest => {
                dataAdapter.getRequestDigest = digest;
            });

        const clientToServerNameDictionary = {
            'SpConfigData:#SP.Data.Aagt': { configKey: 'Title' },
            'ActionItem:#SP.Data.Aagt': { action: 'Title' },
            'Asset:#SP.Data.Aagt': { alias: 'Title' }
        };

        // @ts-ignore
        const convention = this.namingDict.createNameDictionary(
            'spNameConv', NamingConvention.camelCase, clientToServerNameDictionary);

        convention.setAsDefault();

        const dataService = new DataService({
            serviceName: `${this.appUserSvc.appConfigDate.siteUrl}/${this.emCfg.serviceEndpoint}_api/web`,
            hasServerMetadata: false
        });
        this.servicePoint = dataService.serviceName;
        this.entityManager = new EntityManager({ dataService });
        // @ts-ignore
        const metaHelper = new config.MetadataHelper(this.emCfg.nameSpace, AutoGeneratedKeyType.Identity);

        const store = this.entityManager.metadataStore;

        this.emCfg.entities.forEach(entity => {
            const e = new entity() as eb.MetadataBase<eb.SpEntityBase>;
            const type = metaHelper.addTypeToStore(store,
                e.entityDefinition as any) as EntityType;
            store.registerEntityTypeCtor(type.shortName,
                e.metadataFor, e.initializer);
            e.addDefaultSelect(type);
        });
    }

}
