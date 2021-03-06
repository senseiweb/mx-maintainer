import {
    AjaxAdapter,
    AutoGeneratedKeyType,
    DataProperty,
    DataType,
    Entity,
    EntityState,
    HttpResponse,
    SaveBundle,
    SaveContext,
    SaveResult
} from 'breeze-client';
import { SpEntityBase } from '../models';
import { CustomDataServiceUtils } from './sp-dataservice-utils';

interface ISaveRequest {
    url: string;
    payload?: string;
    // tells breeze adapater whether or not to parse the data
    dataType: 'json' | 'raw';
    method: 'POST' | 'PATCH' | 'DELETE' | 'MERGE';
    headers: any;
}

export class SpDataServiceSave {
    headers: any;
    request: ISaveRequest;

    constructor(
        private saveContext: SaveContext,
        private saveBundle: SaveBundle,
        private utils: CustomDataServiceUtils
    ) {
        const digest = saveContext.entityManager.dataService.requestDigest;
        this.headers = {
            Accept: 'application/json;odata=verbose',
            DataServiceVersion: '3.0',
            'Content-Type': 'application/json;odata=verbose',
            'X-RequestDigest': digest
        };
    }

    private async prepareSaveBundle(entity: Entity): Promise<HttpResponse> {
        this.saveContext.tempKeys = [];
        this.saveContext.originalEntities = [entity];
        const saveResult: SaveResult = {
            entities: [],
            entitiesWithErrors: [],
            keyMappings: [],
            deletedKeys: []
        };
        this.saveContext.saveResult = saveResult;
        const state = entity.entityAspect.entityState;

        let request: ISaveRequest = {} as any;

        switch (state) {
            case EntityState.Added:
                request = this.processAddChangeSet(entity);
                break;
            case EntityState.Modified:
                request = this.processUpdateChangeSet(entity);
                break;
            case EntityState.Deleted:
                request = this.processDeleteChangeSet(entity as any);
                break;
            default:
                throw new Error(
                    `Cannot save an entity whose EntityState is ${state.name}`
                );
        }

        return new Promise((resolve, reject) => {
            this.utils.ajaxAdapter.ajax({
                type: request.method,
                url: request.url,
                dataType: request.dataType,
                data: request.payload,
                headers: request.headers,
                success: (sr: SaveResult) => resolve(sr as any),
                error: error => reject(error)
            });
        });
    }

    private processAddChangeSet(entity: Entity): ISaveRequest {
        const em = this.saveContext.entityManager;
        const aspect = entity.entityAspect;
        const et = entity.entityType;

        if (!et.defaultResourceName) {
            throw new Error(`Missing resource name for type: ${et.name}`);
        }

        if (et.autoGeneratedKeyType !== AutoGeneratedKeyType.None) {
            this.saveContext.tempKeys[1] = aspect.getKey();
        }

        const url = em.dataService.qualifyUrl(et.defaultResourceName);

        const helper = em.helper;
        const rawEntity = helper.unwrapInstance(
            entity,
            this.utils.normalizeSaveValue
        );
        rawEntity.__metadata = {
            type: this.utils.clientTypeNameToServer(et.shortName)
        };

        const payload = JSON.stringify(rawEntity);
        const request: ISaveRequest = {
            method: 'POST',
            url,
            dataType: 'json',
            payload,
            headers: this.headers
        };

        return request;
    }

    private processDeleteChangeSet(entity: SpEntityBase): ISaveRequest {
        const em = this.saveContext.entityManager;
        const queryUrl = em.dataService.qualifyUrl(
            entity.entityType.defaultResourceName
        );
        const url = this.utils.makeUpdateDeleteItemsUri(entity['id'], queryUrl);
        const deleteHeaders = this.headers;
        deleteHeaders['IF-MATCH'] = '*';
        deleteHeaders['X-Http-Method'] = 'DELETE';
        const request: ISaveRequest = {
            method: 'POST',
            url,
            dataType: 'raw',
            headers: deleteHeaders
        };
        return request;
    }

    processError(error: any): Error {
        throw new Error(error);
    }

    private processUpdateChangeSet(entity: Entity): ISaveRequest {
        const em = this.saveContext.entityManager;
        const queryUrl = em.dataService.qualifyUrl(
            entity.entityType.defaultResourceName
        );
        const url = this.utils.makeUpdateDeleteItemsUri(entity['id'], queryUrl);
        // check to see if __metadata type is added from this
        const changedData = em.helper.unwrapChangedValues(
            entity,
            em.metadataStore,
            this.utils.normalizeSaveValue
        );
        changedData['__metadata'] = {
            type: entity['__metadata'].type
        };
        const payload = JSON.stringify(changedData);
        const updateHeaders = this.headers;
        updateHeaders['IF-MATCH'] = '*';
        updateHeaders['X-Http-Method'] = 'MERGE';
        const request: ISaveRequest = {
            method: 'POST',
            url,
            payload,
            dataType: 'json',
            headers: updateHeaders
        };
        return request;
    }

    private prepareSaveResult(response: HttpResponse): SaveResult {
        const jra = this.saveContext.dataService.jsonResultsAdapter;
        const saveResult = this.saveContext.saveResult;
        const rawEntity = jra.extractSaveResults(response.data);

        const et = this.saveContext.originalEntities[0];

        if (et.entityAspect.entityState.isDeleted()) {
            saveResult.deletedKeys.push({
                entityTypeName: et.entityType.name,
                keyValues: [et.entityAspect.getKey()]
            });
            saveResult.entities.push(et);
            return saveResult;
        }

        // assume one entity per save, but may need to revisit if multiple result entities are exctracted
        const tempKey = this.saveContext.tempKeys[1];
        if (tempKey) {
            const tmpEt = tempKey.entityType;
            if (tmpEt.autoGeneratedKeyType !== AutoGeneratedKeyType.None) {
                const tempValue = tempKey.values[0];
                const realKey = tmpEt.getEntityKeyFromRawEntity(
                    rawEntity,
                    DataProperty.getRawValueFromServer
                );
                const keyMapping = {
                    entityTypeName: tmpEt.name,
                    tempValue,
                    realValue: realKey.values[0]
                };
                this.saveContext.saveResult.keyMappings.push(keyMapping);
            }
        }

        saveResult.entities.push(rawEntity || et);
        return saveResult;
    }

    async save(): Promise<SaveResult> {
        try {
            const response = await this.prepareSaveBundle(
                this.saveBundle.entities[0]
            );
            this.saveContext.saveResult.httpResponse = response;
            const saveeResult = this.prepareSaveResult(response);
            return saveeResult;
        } catch (error) {
            // this.processError(error);
            throw new Error(error);
        }
    }
}
