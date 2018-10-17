import * as et from './index';
import * as breeze from 'breeze-client';
import 'breeze-client-labs/breeze.metadata-helper';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class RegistrationHelper {

    constructor(
        private _actionItemMetadata: et.ActionItemMetadata,
        private _assetMetadata: et.AssetMetadata,
        private _assetTriggerMetadata: et.AssetTriggerTaskMetadata,
        private _assumptionMetadata: et.AssumptionMetadata,
        private _genOpMetadata: et.GenerationMetadata,
        private _producerMetadata: et.ProducerMetadata,
        private _spConfigDataMetadata: et.SpConfigDataMetadata,
        private _spMetadataMetadata: et.SpMetadataMetadata,
        private _triggerProdCapMetadata: et.TriggerProductionCapabilityMetadata,
        private _triggerMetadata: et.TriggerMetadata,
        private _workShiftMetadata: et.WorkShiftMetadata) {
    }

    register(store: breeze.MetadataStore, helper: breeze.config.MetadataHelper): void {
        this._assetMetadata.registerMe(store, helper, et.Asset, this._assetMetadata.initializer);
        this._actionItemMetadata.registerMe(store, helper, et.ActionItem, this._actionItemMetadata.initializer);
        this._assetTriggerMetadata.registerMe(store, helper, et.AssetTriggerTask, this._assetTriggerMetadata.initializer);
        this._assumptionMetadata.registerMe(store, helper, et.Assumption, this._assumptionMetadata.initializer);
        this._genOpMetadata.registerMe(store, helper, et.Generation, this._genOpMetadata.initializer);
        this._producerMetadata.registerMe(store, helper, et.Producer, this._producerMetadata.initializer);
        this._spConfigDataMetadata.registerMe(store, helper, et.SpConfigData, this._spConfigDataMetadata.initializer);
        this._spMetadataMetadata.registerMe(store, helper, et.SpMetadata);
        this._triggerProdCapMetadata.registerMe(store, helper, et.TriggerProductionCapability, this._triggerProdCapMetadata.initializer);
        this._triggerMetadata.registerMe(store, helper, et.Trigger, this._triggerMetadata.initializer);
        this._workShiftMetadata.registerMe(store, helper, et.WorkShift, this._workShiftMetadata.initializer);
    }
}
