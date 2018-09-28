import * as et from './index';
import * as breeze from 'breeze-client';
import 'breeze-client-labs/breeze.metadata-helper';

export class RegistrationHelper {
    constructor(
        private _genOps: et.GenerationOperation, 
        private _helper: breeze.config.MetadataHelper) 
    {

    }

    register(store:breeze.MetadataStore, helper: breeze.config.MetadataHelper): void 
    {
        this._genOps.registerMe(store, helper)
    }
}