import { Injectable } from '@angular/core';

import { EntityManager, AutoGeneratedKeyType, config, DataService, EntityType, NamingConvention, MetadataStore } from 'breeze-client';

import * as eb from '../models/_entity-base';
import { EmProviderConfig } from './em-provider-config';
import * as _ from 'lodash';
import { CustomNameConventionService } from '../service-adapter/custom-namingConventionDict';
import { CustomMetadataHelperService } from '../service-adapter/custom-metadata-helper';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/app-config.service';

@Injectable({ providedIn: 'root' })
export class EmProviderService {
    activate = false;
    entityManager: EntityManager;
    servicePoint: string;

    constructor(
        private emCfg: EmProviderConfig,
        private http: HttpClient,
        private appCfg: AppConfig,
        private metadataHelper: CustomMetadataHelperService,
        private namingDict: CustomNameConventionService
    ) {
        this.fetchRequestDigest();
        this.init();
    }

    protected init(): void {
        const dataService = new DataService({
            serviceName: this.appCfg.apiAddress(this.emCfg.featureSpAppName),
            hasServerMetadata: false
        });

        dataService.odataServiceEndpoint = this.appCfg.featureSpAppSite(this.emCfg.featureSpAppName);
        this.metadataHelper.defaultNamespace = this.emCfg.nameSpace;
        this.metadataHelper.defaultAutoGenKeyType = AutoGeneratedKeyType.Identity;
        const clientToServerNameDictionary = {};
        this.emCfg.entities.forEach(entity => {
            const e = new entity() as eb.MetadataBase<eb.SpEntityBase>;
            e.entityDefinition.createNamingDictionary(clientToServerNameDictionary, this.emCfg.nameSpace);
        });
        const convention = this.namingDict.createNameDictionary('spNameConv', NamingConvention.camelCase, clientToServerNameDictionary);
        convention.setAsDefault();
        const metadataStore = new MetadataStore();

        this.entityManager = new EntityManager({
            dataService: dataService,
            metadataStore: metadataStore
        });

        const store = this.entityManager.metadataStore;
        this.emCfg.entities.forEach(entity => {
            const e = new entity() as eb.MetadataBase<eb.SpEntityBase>;
            const type = this.metadataHelper.addTypeToStore(store, e.entityDefinition as any) as EntityType;
            store.registerEntityTypeCtor(type.shortName, e.metadataFor, e.initializer);
            e.addDefaultSelect(type);
        });
    }

    private fetchRequestDigest(): void {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json;odata=verbose',
            Accept: 'application/json;odata=verbose'
        });
        this.http.post(`${this.appCfg.apiAddress(this.emCfg.featureSpAppName)}contextinfo`, {}, { headers: headers }).subscribe(response => {
            const digest = response['d']['GetContextWebInformation']['FormDigestValue'];
            let timeout = response['d']['GetContextWebInformation']['FormDigestTimeoutSeconds'];
            if (timeout) {
                timeout *= 1000;
                setTimeout(() => {
                    this.fetchRequestDigest();
                }, timeout);
            }
            this.emCfg.dsAdapter.utils.requestDigest = digest;
        });
    }
}