import { EntityBase } from './_entity-base';

export class SpMetadata extends EntityBase {
  shortName = '__metadata';

  constructor() {
    super();
    this.self = this;
    this.entityDefinition.isComplexType = true;
    this.entityDefinition.shortName = this.shortName;
    this.entityDefinition.dataProperties.id = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.uri = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.etag = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.type = { dataType: this.dt.String };
  }

  uri: string;
  etag: string;
  type: string;
}
