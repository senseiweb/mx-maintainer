import { EntityBase, ConfigKeys } from './_entity-base';
import { Injectable } from '@angular/core';

export interface SpConfigValue {
  [index: string]: string;
}

@Injectable()
export class SpAppConfig extends EntityBase {

  shortName = 'SpAppConfig';
  private _configValue: string;

  constructor() {
    super();
    this.self = this;
    this.entityDefinition.shortName = this.shortName;
    this.entityDefinition.defaultResourceName = `/lists/getByTitle('${this.shortName}')/items`;
    this.entityDefinition.dataProperties.ConfigKey = { dataType: this.dt.String, isNullable: false };
    this.entityDefinition.dataProperties.ConfigValue = { dataType: this.dt.String, isNullable: false };

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

