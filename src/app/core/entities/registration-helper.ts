import * as et from './index';
import * as breeze from 'breeze-client';
import 'breeze-client-labs/breeze.metadata-helper';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class RegistrationHelper {
    constructor(
        private _actionItem: et.ActionItem,
        private _assetTrigger: et.AssetTriggerTask,
        private _asset: et.Asset,
        private _assumption: et.Assumption,
        private _genOp: et.Generation,
        private _producer: et.Producer,
        private _spAppConfig: et.SpAppConfig,
        private _spMetadata: et.SpMetadata,
        private _triggerProdCap: et.TriggerProductionCapability,
        private _trigger: et.Trigger,
        private _workShift: et.WorkShift) {
    }

    register(store: breeze.MetadataStore, helper: breeze.config.MetadataHelper): void {
        this._actionItem.registerMe(store, helper);
        this._assetTrigger.registerMe(store, helper);
        this._asset.registerMe(store, helper);
        this._assumption.registerMe(store, helper);
        this._genOp.registerMe(store, helper);
        this._producer.registerMe(store, helper);
        this._spAppConfig.registerMe(store, helper);
        this._spMetadata.registerMe(store, helper);
        this._triggerProdCap.registerMe(store, helper);
        this._trigger.registerMe(store, helper);
        this._workShift.registerMe(store, helper);
    }
}
