import { SaveContext, SaveBundle, SaveResult, EntityState, Entity, AutoGeneratedKeyType, DataProperty, DataType } from 'breeze-client';
import { CustomDataServiceUtils } from './sp-dataservice-utils';
import { OData3BatchService, OData3Batch, OData3Request } from '@odata';
import { HttpHeaders } from '@angular/common/http';
import { UUID } from 'angular2-uuid';

export class SpDataServiceOdataSave {
    private batch: OData3Batch;
    private defaultHeaders: HttpHeaders;
    private uuid: UUID;

    constructor(
        private saveContext: SaveContext,
        private odataService: OData3BatchService,
        private saveBundle: SaveBundle,
        private utils: CustomDataServiceUtils,
        defaultBatchHeaders: HttpHeaders
    ) {
        this.uuid = UUID.UUID();
        const batchUrl = this.saveContext.dataService.serviceName.replace('web/', '$batch');
        this.batch = this.odataService.createBatch(batchUrl);
        this.defaultHeaders = defaultBatchHeaders;
        const batchHeaders = this.utils.getRequestDigestHeaders(defaultBatchHeaders);
        console.log(batchHeaders.keys().toString());
        this.batch.addHeaders(batchHeaders);
    }

    private normalizeSaveValue(prop: DataProperty, val: any): any {
        if (prop.isUnmapped) {
            return undefined;
        }
        const propDataType = prop.dataType as DataType;
        if (propDataType === DataType.DateTimeOffset) {
            val = val && new Date(val.getTime() - val.getTimezoneOffset() * 60000);
        } else if (prop.dataType) {
            // quoteJsonOData
            val = val != null ? val.toString() : val;
        }
        return val;
    }

    private prepareSaveBundles(): void {
        this.saveContext.tempKeys = [];
        this.saveContext.originalEntities = this.saveBundle.entities;
        const saveResult: SaveResult = {
            entities: [],
            entitiesWithErrors: [],
            keyMappings: []
        };
        this.saveContext.saveResult = saveResult;
        const aspectNames = [...new Set(this.saveBundle.entities.map(e => e.entityType.name))];

        aspectNames.forEach(name => {
            const changeSet = this.odataService.createChangeset(this.uuid);

            this.saveBundle.entities
                .filter(et => (et.entityType.name = name))
                .forEach((entity, index) => {
                    const state = entity.entityAspect.entityState;
                    const contentId = index + 1;
                    let request: OData3Request;

                    switch (state) {
                        case EntityState.Added:
                            request = this.processAddChangeSet(entity, contentId.toString());
                            break;
                        case EntityState.Modified:
                            // request = this.processDeleteChangeSet(entity, index);
                            break;
                        case EntityState.Deleted:
                            // request = this.processModifyChangeSet(entity, index);
                            break;
                        default:
                            throw new Error(`Cannot save an entity whose EntityState is ${state.name}`);
                    }

                    changeSet.addRequest(request);
                });

            this.batch.addChangeset(changeSet);
        });
    }

    private processAddChangeSet(entity: Entity, contentId: string): OData3Request {
        const em = this.saveContext.entityManager;
        const aspect = entity.entityAspect;
        const et = entity.entityType;
        const addHeaders = new HttpHeaders({
            'Content-Type': 'app'
        });

        if (!et.defaultResourceName) {
            throw new Error(`Missing resource name for type: ${et.name}`);
        }

        if (et.autoGeneratedKeyType !== AutoGeneratedKeyType.None) {
            this.saveContext.tempKeys[contentId] = aspect.getKey();
        }

        const url = this.saveContext.dataService.qualifyUrl(et.defaultResourceName);

        const helper = em.helper;
        const rawEntity = helper.unwrapInstance(entity, this.normalizeSaveValue);
        rawEntity.__metadata = {
            type: this.utils.clientTypeNameToServer(et.shortName)
        };

        const payload = JSON.stringify(rawEntity);

        return this.odataService.createRequest('POST', url, payload, contentId, this.defaultHeaders);
    }

    async save(): Promise<void> {
        this.prepareSaveBundles();
        const response = await this.odataService.submitBatch(this.batch);
        console.log(response);
    }
}
