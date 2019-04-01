import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Instantiable } from '@ctypes/breeze-type-customization';
import { AppConfig } from 'app/app-config.service';
import {
    AutoGeneratedKeyType,
    DataService,
    EntityManager,
    EntityType
} from 'breeze-client';
import { init } from 'rollbar';
import { BehaviorSubject } from 'rxjs';
import { MetadataBase, SpEntityBase } from '../models';
import { CustomMetadataHelperService } from '../service-adapter/custom-metadata-helper';
import { CustomNameConventionService } from '../service-adapter/custom-namingConventionDict';
import { EmProviderService } from './em-provider.service';

export class BaseEmProviderService {
    private featureAppSiteName: string;
    entityManager: EntityManager;
    private dataService: DataService;
    onSaveInProgressChange: BehaviorSubject<boolean>;

    constructor(
        private http: HttpClient,
        private metaHelper: CustomMetadataHelperService,
        private appCfg: AppConfig,
        private nameConv: CustomNameConventionService,
        private emProviderService: EmProviderService,
        appSiteName: string,
        private featureNameSpace: string,
        private appEntities: Array<
            Instantiable<MetadataBase<SpEntityBase>>
        > = []
    ) {
        this.featureAppSiteName = appSiteName;
        this.onSaveInProgressChange = new BehaviorSubject(false);
        this.init();
    }

    init(): void {
        this.dataService = new DataService({
            serviceName: this.appCfg.apiAddress(this.featureAppSiteName),
            hasServerMetadata: false,
            adapterName: 'SpODataService'
        });

        this.dataService.odataServiceEndpoint = this.appCfg.featureSpAppSite(
            this.featureAppSiteName
        );

        this.metaHelper.defaultNamespace = this.featureNameSpace;
        this.metaHelper.defaultAutoGenKeyType = AutoGeneratedKeyType.Identity;
        const clientToServerNameDictionary = {};
        this.appEntities.forEach(entity => {
            const e = new entity();
            e.entityDefinition.createNamingDictionary(
                clientToServerNameDictionary,
                this.featureNameSpace
            );
        });

        this.nameConv.updateDictionary(clientToServerNameDictionary);

        this.entityManager = new EntityManager({
            dataService: this.dataService,
            metadataStore: this.emProviderService.metadataStore
        });

        this.appEntities.forEach(entity => {
            const e = new entity();
            const type = this.metaHelper.addTypeToStore(
                this.emProviderService.metadataStore,
                e.entityDefinition as any
            ) as EntityType;
            this.emProviderService.metadataStore.registerEntityTypeCtor(
                type.shortName,
                e.metadataFor,
                e.initializer
            );
            e.addDefaultSelect(type);
        });

        this.getRequestDigest();
    }

    getRequestDigest(): void {
        // tslint:disable-next-line: no-this-assignment
        const that = this;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json;odata=verbose',
            Accept: 'application/json;odata=verbose'
        });
        this.http
            .post(
                `${this.appCfg.apiAddress(this.featureAppSiteName)}contextinfo`,
                {},
                { headers }
            )
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
                        this.getRequestDigest();
                    }, timeout);
                }
                that.entityManager.dataService.requestDigest = digest;
            });
    }

    async saveAllChanges(): Promise<void> {
        try {
            this.onSaveInProgressChange.next(true);
            const results = await this.entityManager.saveChanges();
        } catch (e) {
            console.error(`Saving changes failed ==> ${e}`);
            Promise.reject();
        } finally {
            this.onSaveInProgressChange.next(false);
        }
    }
}
