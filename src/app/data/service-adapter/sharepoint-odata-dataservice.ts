
import { CustomDataServiceUtils } from './sp-dataservice-utils';
import 'breeze-client/adapters/adapter-model-library-backing-store.umd';
import 'breeze-client/adapters/adapter-uri-builder-odata.umd';

import {
    AbstractDataServiceAdapter,
    MappingContext,
    DataService,
    core,
    config,
    EntityQuery,
    DataServiceAdapter,
    MetadataStore,
    SaveContext,
    SaveBundle,
    SaveResult,
    JsonResultsAdapter,
    ChangeRequestInterceptor,
    NodeContext,
    HttpResponse
} from 'breeze-client';


import { Injectable } from '@angular/core';
import { ChangeRequestInterceptorCtor } from 'breeze-client/src/interface-registry';
import { CustomQueryContext } from './sp-dataservice-query';
import { CustomSaveContext } from './sp-dataservice-save';

@Injectable({ providedIn: 'root' })
export class SpODataDataService implements DataServiceAdapter {
    ajaxImpl: any;
    defaultHeaders: { [index: string]: string };
    name: string;
    jsonResultsAdapter: JsonResultsAdapter;
    changeRequestInterceptor: ChangeRequestInterceptorCtor;
    utils: CustomDataServiceUtils;
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

    fetchMetadata(metadataStore: MetadataStore, dataService: any): Promise<any> {
        return Promise.reject(
            new Error('Fetch Metadata is not available on this adapter;')
        );
    }

    initialize(): void {
        this.ajaxImpl = config.getAdapterInstance('ajax');
        this.jsonResultsAdapter = this.getJsonResultsAdapter();
        // Force a wait until the next tick then attached the utils class
        Promise.resolve()
            .then(() => {
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
            extractSaveResults: undefined,
            visitNode: this.visitNode.bind(this)
        };

        return new JsonResultsAdapter(jraConfig);
    }

    saveChanges(saveContext: SaveContext, saveBundle: SaveBundle): Promise<SaveResult> {
        const saver = new CustomSaveContext(saveContext, saveBundle, this.utils);
        return saver.save(this.defaultHeaders);
    }

    visitNode(node: any, mpCtx: MappingContext, ndCtx: NodeContext): Object {
        let result: any = {}
        if (!node) { return result; }

    }
}

config.registerAdapter('dataService', SpODataDataService);
