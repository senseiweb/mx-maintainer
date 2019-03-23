import 'breeze-client/adapters/adapter-model-library-backing-store.umd';
import 'breeze-client/adapters/adapter-uri-builder-odata.umd';
import { CustomDataServiceUtils } from './sp-dataservice-utils';

import {
    config,
    core,
    AbstractDataServiceAdapter,
    ChangeRequestInterceptor,
    DataService,
    DataServiceAdapter,
    EntityQuery,
    EntityType,
    HttpResponse,
    JsonResultsAdapter,
    MappingContext,
    MetadataStore,
    NodeContext,
    SaveBundle,
    SaveContext,
    SaveResult
} from 'breeze-client';

import { Injectable } from '@angular/core';
import { OData3BatchService } from '@odata';
import { ChangeRequestInterceptorCtor } from 'breeze-client/src/interface-registry';
import { GlobalDataModule } from '../data.module';
import { SpDataServiceOdataSave } from './sp-dataservice-odata-save';
import { CustomQueryContext } from './sp-dataservice-query';
import { SpDataServiceSave } from './sp-dataservice-save';

@Injectable({ providedIn: GlobalDataModule })
export class SpODataDataService implements DataServiceAdapter {
    ajaxImpl: any;
    defaultHeaders: { [index: string]: string };
    name: string;
    odataService: OData3BatchService;
    jsonResultsAdapter: JsonResultsAdapter;
    changeRequestInterceptor: ChangeRequestInterceptorCtor;
    utils: CustomDataServiceUtils;
    odataServiceEndpoint: string;

    constructor() {
        this.name = 'SpODataService';
    }

    executeQuery(mappingContext: MappingContext): any {
        const queryer = new CustomQueryContext(mappingContext, this.utils);
        return queryer.query(this.defaultHeaders, this.ajaxImpl);
    }

    extractResults(response: HttpResponse): any {
        const data = response.data && response.data.d;
        return data.results === undefined ? data : data.results;
    }

    extractSaveResults(serializeData: string): any {
        const jsonData = JSON.parse(serializeData);
        const data = jsonData.d;
        return data.results === undefined ? data : data.results;
    }

    fetchMetadata(metadataStore: MetadataStore, dataService: any): Promise<any> {
        return Promise.reject(new Error('Fetch Metadata is not available on this adapter;'));
    }

    initialize(): void {
        this.ajaxImpl = config.getAdapterInstance('ajax');
        this.jsonResultsAdapter = this.getJsonResultsAdapter();
        // Force a wait until the next tick then attached the utils class
        Promise.resolve().then(() => {
            this.utils.ajaxAdapter = this.ajaxImpl;
        });

        this.defaultHeaders = {
            Accept: 'application/json;odata=verbose',
            DataServiceVersion: '3.0',
            'Content-Type': 'application/json;odata=verbose'
        };
    }

    getJsonResultsAdapter(): JsonResultsAdapter {
        const jraConfig = {
            name: 'SpCustomRestJson',
            extractResults: this.extractResults.bind(this),
            extractSaveResults: this.extractSaveResults.bind(this),
            visitNode: this.visitNode.bind(this)
        };

        return new JsonResultsAdapter(jraConfig);
    }

    saveChanges(saveContext: SaveContext, saveBundle: SaveBundle): Promise<SaveResult> {
        const saver =
            saveBundle.entities.length === 1
                ? new SpDataServiceSave(saveContext, saveBundle, this.utils)
                : new SpDataServiceOdataSave(saveContext, this.odataService, saveBundle, this.utils, this.defaultHeaders);
        return saver.save();
    }

    visitNode(node: any, mappingContext: MappingContext, nodeContext: NodeContext): object {
        // TODO: maybe a problem when using expand relative objects...see sharepoint bz example
        const result: any = {};
        if (node == null) {
            return result;
        }

        // if (mappingContext.mergeOptions.noTracking) {
        //     return (result.ignore = true);
        // }

        const metadata = node.__metadata;

        if (metadata != null) {
            // TODO: may be able to make this more efficient by caching of the previous value.
            // const entityTypeName = MetadataStore.normalizeTypeName(metadata.type);
            const entityTypeName = this.utils.serverTypeNameToClient(metadata.type);
            const et = entityTypeName && (mappingContext.entityManager.metadataStore.getEntityType(entityTypeName, true) as EntityType);
            // OData response doesn't distinguish a projection from a whole entity.
            // We'll assume that whole-entity data would have at least as many properties  (<=)
            // as the EntityType has mapped properties on the basis that
            // most projections remove properties rather than add them.
            // If not, assume it's a projection and do NOT treat as an entity
            if (et && et.dataProperties.length <= Object.keys(node).length - 1) {
                // if (et && et._mappedPropertiesCount === Object.keys(node).length - 1) { // OLD
                result.entityType = et;
                let uriKey = metadata.uri || metadata.id;
                if (uriKey) {
                    // Strip baseUri to make uriKey a relative uri
                    // Todo: why is this necessary when absolute works for every OData source tested?
                    const re = new RegExp('^' + mappingContext.dataService.serviceName, 'i');
                    uriKey = uriKey.replace(re, '');
                }
                result.extraMetadata = {
                    uriKey,
                    etag: metadata.etag
                };
            }
        }
        // OData v3 - projection arrays will be enclosed in a results array
        if (node.results) {
            result.node = node.results;
        }

        const propertyName = nodeContext.propertyName;
        result.ignore =
            node.__deferred != null ||
            propertyName === '__metadata' ||
            // EntityKey properties can be produced by EDMX models
            (propertyName === 'EntityKey' && node.$type && core.stringStartsWith(node.$type, 'System.Data'));
        return result;
    }
}

config.registerAdapter('dataService', SpODataDataService);
