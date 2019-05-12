import { Injectable } from '@angular/core';
import { RawEntity } from '@ctypes/breeze-type-customization';
import { BaseRepoService, SpEntityBase } from 'app/global-data';
import { IEntityChangedEvent } from 'app/global-data/repos/base-emprovider.service';
import { EntityAction } from 'breeze-client';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { AssetTriggerAction, GenerationAsset, TriggerAction } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class AssetTriggerActionRepoService extends BaseRepoService<
    AssetTriggerAction
> {
    constructor(private entityService: AagtEmProviderService) {
        super('AssetTriggerAction', entityService);
    }

    // private initWatchers(): void {
    //     this.entityService.onEntityManagerChange
    //         .pipe(
    //             this.entityService.filterAttached,
    //             this.filterGenAssets,
    //             map(ga => ga.entity)
    //         )
    //         .subscribe(ga => this.createAtaForGenAsset(ga as GenerationAsset));

    //     this.entityService.onEntityManagerChange
    //         .pipe(
    //             this.entityService.filterAttached,
    //             this.filterTrigActions,
    //             map(ta => ta.entity)
    //         )
    //         .subscribe(ta => this.createAtaForTrigAction(ta as TriggerAction));

    //     this.entityService.onEntityManagerChange
    //         .pipe(
    //             this.entityService.filterDeleted,
    //             filter(
    //                 ec =>
    //                     ec.entity instanceof GenerationAsset ||
    //                     ec.entity instanceof TriggerAction
    //             ),
    //             map(ta => ta.entity as any)
    //         )
    //         .subscribe(() => this.deleteAta);

    //     this.entityService.onEntityManagerChange.pipe(this.filterProp);
    // }

    private filterGenAssets(
        changedArgs: Observable<IEntityChangedEvent>
    ): Observable<IEntityChangedEvent> {
        return changedArgs.pipe(
            filter(changedArg => changedArg.entity instanceof GenerationAsset)
        );
    }

    private filterTrigActions(
        changedArgs: Observable<IEntityChangedEvent>
    ): Observable<IEntityChangedEvent> {
        return changedArgs.pipe(
            filter(changedArg => changedArg.entity instanceof TriggerAction)
        );
    }

    private filterProp<T = SpEntityBase>(
        changedArgs?: Observable<IEntityChangedEvent>,
        property?: keyof RawEntity<T>
    ): Observable<IEntityChangedEvent> {
        return changedArgs.pipe(
            filter(
                changedArg =>
                    changedArg.entityAction === EntityAction.PropertyChange
            ),
            tap(changedArg => console.log(changedArg))
        );
    }

    // private createAtaForGenAsset(genAsset: GenerationAsset): void {
    //     const triggerActions = this.entityManager.getEntities(
    //         SpListName.TriggerAction
    //     ) as TriggerAction[];

    //     triggerActions.forEach(triggerAction => {
    //         if (this.retrievedDeleted(genAsset.id, triggerAction.id)) {
    //             return;
    //         }
    //         this.createBase({
    //             genAsset,
    //             triggerAction,
    //             sequence: triggerAction.sequence,
    //             actionStatus: 'Unscheduled',
    //             outcome: 'untouched'
    //         });
    //     });
    // }

    // private createAtaForTrigAction(triggerAction: TriggerAction): void {
    //     const genAssets = this.entityManager.getEntities(
    //         SpListName.GenerationAsset
    //     ) as GenerationAsset[];

    //     genAssets.forEach(genAsset => {
    //         if (this.retrievedDeleted(genAsset.id, triggerAction.id)) {
    //             return;
    //         }
    //         this.createBase({
    //             genAsset,
    //             triggerAction,
    //             sequence: triggerAction.sequence,
    //             actionStatus: 'Unscheduled',
    //             outcome: 'untouched'
    //         });
    //     });
    // }

    // private deleteAta(parentEntity: GenerationAsset | TriggerAction): void {
    //     const atas = parentEntity.assetTriggerActions;
    //     atas.forEach(ata => ata.entityAspect.entity.entityAspect.setDeleted());
    // }

    // private retrievedDeleted(genAssetId: number, triggerActionId): boolean {
    //     const deletedVersion = this.entityManager
    //         .getEntities(this.entityType)
    //         .find(
    //             (ata: AssetTriggerAction) =>
    //                 ata.genAssetId === genAssetId &&
    //                 ata.triggerActionId === triggerActionId
    //         );

    //     if (deletedVersion) {
    //         deletedVersion.entityAspect.rejectChanges();
    //         return true;
    //     }
    //     return false;
    // }
}
