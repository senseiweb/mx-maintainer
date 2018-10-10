import { EntityBase, ConfigKeys } from './_entity-base';
import { Injectable } from '@angular/core';

export interface SpConfigValue {
  [index: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpAppConfig extends EntityBase {

  private _configValue = '{}';

  constructor() {
    super('SpAppConfig');
    this.self = this;
    this.entityDefinition.dataProperties.configKey = { dataType: this.dt.String, isNullable: false };
    this.entityDefinition.dataProperties.configValue = { dataType: this.dt.String, isNullable: false };

    Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
  }

  configKey: ConfigKeys;

  get configValue () {
    return JSON.parse(this._configValue) as SpConfigValue;
  }

  set configValue(configValue: SpConfigValue) {
    this._configValue  = JSON.stringify(configValue);
  }

  initializer(entity: SpAppConfig) {
  }

}

