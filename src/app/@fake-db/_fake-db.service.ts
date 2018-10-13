import {
    InMemoryDbService,
    RequestInfoUtilities,
    ParsedRequestUrl
} from 'angular-in-memory-web-api';

import { AssetsFakeDb } from './assets';
import { GenerationFakeDb  } from './generation';
import { Asset, bareEntity, Generation, SpConfigData } from 'app/core';
import { SpConfigDataFakeDb } from './sp-confg-data.db';

export interface FakeSpDb<T> {
    entities: bareEntity<T>[];
}

export class FakeDbService implements InMemoryDbService {
   private resourceRegEx = /'(\w+)'/i;
    private urlBase = 'https://cs2.eis.af.mil/sites/12042/wing/5bw/5mxg/5mos/programs/codi/_api/web/lists/';

    constructor() {
    }

    private getDatabase<T>(inMemDb: any, dbFunc: any): void {
        const propName = dbFunc.dbKey;
        const newedUpClass = new dbFunc() as bareEntity<T>;
        inMemDb[propName] = newedUpClass.entities;
        console.log(`created db for: ${propName}`);
        return inMemDb;
    }

    createDb(): any {
        const inMemDb = { } as any;
        this.getDatabase<Asset>(inMemDb, AssetsFakeDb);
        this.getDatabase<Generation>(inMemDb, GenerationFakeDb);
        this.getDatabase<SpConfigData>(inMemDb, SpConfigDataFakeDb);
        return inMemDb;
    }

    parseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {
        const clean_url = decodeURIComponent(url);
        const resource = clean_url.match(this.resourceRegEx)[1];
        console.log(resource);
        const newUrl = `api/${resource}/`;
        // console.log('newUrl', newUrl);
        const parsed = utils.parseRequestUrl(newUrl);
        console.log(`parseRequestUrl override of '${clean_url}':`, parsed);
        return parsed;
    }

    private implementFilterOps(filterUrl: string): string {
        
    }

}
