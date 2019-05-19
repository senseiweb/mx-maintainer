import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpListEntities } from '@ctypes/app-config';
import {
    EntityChangeArgType,
    GetEntityProp,
    GetEntityType,
    IEntityChangedEvent,
    IEntityPropertyChange
} from '@ctypes/breeze-type-customization';
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

export class BaseEmProviderService {
    private featureAppSiteName: string;
    entityManager: EntityManager;
    private dataService: DataService;
    onSaveInProgressChange: BehaviorSubject<boolean>;
    private onEntityManagerChange: Subject<IEntityChangedEvent<any, any, any>>;

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

        this.entityManager.entityChanged.subscribe(changedArgs => {
            changedArgs.shortName = changedArgs.entity.shortname;

            switch (changedArgs.entityAction as EntityAction) {
                case EntityAction.PropertyChange:
                    changedArgs.entityAction = 'PropertyChange';
                    break;
                case EntityAction.EntityStateChange:
                    changedArgs.entityAction = 'EntityState';
                    break;
            }

            this.onEntityManagerChange.next(changedArgs);
        });

        this.getRequestDigest();
    }

    // filterAttached(
    //     changedArgs: Observable<IEntityChangedEvent>
    // ): Observable<IEntityChangedEvent> {
    //     return changedArgs.pipe(
    //         filter(
    //             changedArg => changedArg.entityAction === EntityAction.Attach
    //         )
    //     );
    // }

    // filterDeleted(
    //     changedArgs: Observable<IEntityChangedEvent>
    // ): Observable<IEntityChangedEvent> {
    //     return changedArgs.pipe(
    //         filter(
    //             changedArg =>
    //                 changedArg.entity.entityAspect.entityState.isDeleted() &&
    //                 changedArg.entityAction === EntityAction.EntityStateChange
    //         )
    //     );
    // }

    // onModelChanges<
    //     TShortName extends SpListEntities['shortname'],
    //     TEntityAction extends EntityChangeArgs<
    //         SelectedEntityKind<TShortName>,
    //         any
    //     >['entityAction'],
    //     TEntityProp extends keyof SelectedEntityKind<TShortName>
    // >(
    //     shortName: TShortName,
    //     etAction: TEntityAction
    // ): Observable<IEntityChangedEvent<TShortName, TEntityAction, any>>;

    onModelChanges<
        TShortName extends SpListEntities['shortname'],
        TEntityAction extends EntityChangeArgType<
            TShortName,
            any
        >['entityAction'],
        TEntityProp extends GetEntityProp<TShortName>
    >(
        shortName: TShortName,
        etAction: TEntityAction,
        property?: TEntityProp
    ): Observable<IEntityChangedEvent<TShortName, TEntityAction, TEntityProp>> {
        const ecObserverable = this.onEntityManagerChange.pipe(
            filter(
                (
                    chngArgs: IEntityChangedEvent<
                        TShortName,
                        TEntityAction,
                        any
                    >
                ) =>
                    chngArgs.shortName === shortName &&
                    chngArgs.entityAction === etAction
            )
        );

        if (property) {
            ecObserverable.pipe(
                filter(
                    (
                        chngArgs: IEntityChangedEvent<
                            TShortName,
                            TEntityAction,
                            TEntityProp
                        >
                    ) =>
                        (chngArgs.args as IEntityPropertyChange<
                            TShortName,
                            TEntityProp
                        >).propertyName === property
                )
            );
        }

        return ecObserverable;
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
