import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
    cfgApiAddress,
    cfgFeatureSpAppSite,
    MxmAppName,
    MxmAssignedModels
} from 'app/app-config.service';
import { DataService, EntityAction, EntityManager } from 'breeze-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SpEntityBase } from '../models';
import { CustomNameConventionService } from '../service-adapter/custom-namingConventionDict';
import { GlobalEntityMgrProviderService } from './core-em-provider.service';

export interface IEntityChangedEvent {
    entityAction: EntityAction;
    entity: SpEntityBase;
    args: any;
}
export class BaseEmProviderService {
    private featureAppSiteName: string;
    entityManager: EntityManager;
    private dataService: DataService;
    onSaveInProgressChange: BehaviorSubject<boolean>;
    onEntityManagerChange: Subject<IEntityChangedEvent>;

    constructor(
        private http: HttpClient,
        private nameConv: CustomNameConventionService,
        private emProviderService: GlobalEntityMgrProviderService,
        appSiteName: string,
        private featureNameSpace: string,
        private appName: MxmAppName
    ) {
        this.featureAppSiteName = appSiteName;
        this.onSaveInProgressChange = new BehaviorSubject(false);
        this.onEntityManagerChange = new Subject();
        this.init();
    }

    init(): void {
        this.dataService = new DataService({
            serviceName: cfgApiAddress(this.featureAppSiteName),
            hasServerMetadata: false,
            adapterName: 'SpODataService'
        });

        this.dataService.odataServiceEndpoint = cfgFeatureSpAppSite(
            this.featureAppSiteName
        );

        this.entityManager = new EntityManager({
            dataService: this.dataService,
            metadataStore: this.emProviderService.metadataStore
        });

        const appModels = MxmAssignedModels.get(this.appName);

        appModels.forEach(bzScaffold =>
            (bzScaffold as any).prototype.spBzEntity.createTypeForStore(
                this.entityManager.metadataStore,
                this.nameConv,
                this.featureNameSpace
            )
        );

        this.entityManager.entityChanged.subscribe(changedArgs =>
            this.onEntityManagerChange.next(changedArgs)
        );

        this.getRequestDigest();
    }

    filterAttached(
        changedArgs: Observable<IEntityChangedEvent>
    ): Observable<IEntityChangedEvent> {
        return changedArgs.pipe(
            filter(
                changedArg => changedArg.entityAction === EntityAction.Attach
            )
        );
    }

    filterDeleted(
        changedArgs: Observable<IEntityChangedEvent>
    ): Observable<IEntityChangedEvent> {
        return changedArgs.pipe(
            filter(
                changedArg =>
                    changedArg.entity.entityAspect.entityState.isDeleted() &&
                    changedArg.entityAction === EntityAction.EntityStateChange
            )
        );
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
                `${cfgApiAddress(this.featureAppSiteName)}contextinfo`,
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
