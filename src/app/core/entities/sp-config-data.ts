import * as ebase from './_entity-base';
import { Injectable } from '@angular/core';

export enum configKeyEnum {
  isoTypes = 'app-iso-types',
  groupIder = 'app-group-ids'
}

export type SpCfgValueAppIsoType = string[];

export interface SpCfgAppGrpId {
  admGrpName: string;
  genMgrGrpName: string;
  timeKeeperGrpName: string;
}
export interface SpCfg<T> extends SpConfigData {
  configValue: T;
}
export interface SpCfgIsoType extends SpCfg<SpCfgValueAppIsoType> {
  configKey: configKeyEnum.isoTypes;
}
export interface SpCfgGrpId extends SpCfg<SpCfgAppGrpId> {
  configKey: configKeyEnum.groupIder;
}

export class SpConfigData extends ebase.SpEntityBase {
  private _configValue = '{}';

  configKey: configKeyEnum;

  get configValue () {
    return JSON.parse(this._configValue);
  }

  set configValue(cv) {
    if (typeof (cv) === 'string') {
      this._configValue = cv;
    } else {
      this._configValue = JSON.stringify(cv);
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class SpConfigDataMetadata extends ebase.MetadataBase {


  constructor() {
    super('SpConfigData');
    this.entityDefinition.dataProperties.configKey = {
      dataType: this.dt.String,
      isNullable: false
    };
    this.entityDefinition.dataProperties.configValue = { dataType: this.dt.String, isNullable: false };

    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: SpConfigData) {
  }

}

