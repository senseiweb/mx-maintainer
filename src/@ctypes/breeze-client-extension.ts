import { BreezeConfig, AdapterType, BaseAdapter } from 'breeze-client/src/config';

import { SaveResult, SaveContext, HttpResponse } from 'breeze-client/src/entity-manager';

import { AjaxAdapter } from 'breeze-client/src/interface-registry';

import { EntityKey, Entity } from 'breeze-client';
import { EntityType } from 'breeze-client/src/entity-metadata';
import { CustomDataServiceUtils } from 'app/global-data/service-adapter/sp-dataservice-utils';
import { OData3BatchService } from '@odata';

declare module 'breeze-client/src/config' {
    interface BreezeConfig {
        getAdapterInstance<T extends BaseAdapter>(interfaceName: AdapterType, adapterName?: string): AjaxAdapter;
    }
    interface BaseAdapter {
        utils?: CustomDataServiceUtils;
        odataService?: OData3BatchService;
    }
}

declare module 'breeze-client/src/entity-metadata' {
    interface EntityType {
        custom?: Object;
        _mappedPropertiesCount: number;
    }
    // export interface HttpResponse {
    //     saveContext: SaveContext;
    // }
}

declare module 'breeze-client/src/data-service' {
    interface DataServiceConfig {
        odataServiceEndpoint?: string;
    }

    interface DataService {
        odataServiceEndpoint?: string;
    }
}

declare module 'breeze-client/src/entity-manager' {
    export interface SaveContext {
        tempKeys: EntityKey[];
        originalEntities: Entity[];
        saveResult: SaveResult;
    }

    export interface SaveResult {
        entitiesWithErrors: Entity[];
    }

    // export interface HttpResponse {
    //     saveContext: SaveContext | any;
    // }
    // not subclasses of Error
    /**
    For use by breeze plugin authors only. The class is for use in building a [[IDataServiceAdapter]] implementation.
    @adapter (see [[IDataServiceAdapter]])
    @hidden @internal
    */
    export interface EntityErrorFromServer {
        entityTypeName: string;
        keyValues: any[];

        errorName: string;
        errorMessage: string;
        propertyName: string;
    }

    /** Shape of a save error returned from the server.
For use by breeze plugin authors only. The class is for use in building a [[IDataServiceAdapter]] implementation.
@adapter (see [[IDataServiceAdapter]])
@hidden @internal
*/
    export interface SaveErrorFromServer extends ServerError {
        entityErrors: EntityErrorFromServer[];
    }
}
