import * as eb from '../models/_entity-base';

export class EmProviderConfig {
  entities: Array<eb.Instantiable<eb.MetadataBase<eb.SpEntityBase>>>;
  nameSpace: string;
  serviceEndpoint: string;
}
