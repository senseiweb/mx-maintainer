import {
    InMemoryDbService,
    RequestInfoUtilities,
    ParsedRequestUrl,
    ResponseOptions,
    RequestInfo
} from 'angular-in-memory-web-api';

import { AssetsFakeDb } from './assets';
import { GenerationFakeDb } from './generation';
import { bareEntity } from 'app/data';
import { Asset, Generation } from 'app/aagt/data';

export interface FakeSpDb<T> {
    entities: bareEntity<T>[];
}

export class FakeAagtDbService implements InMemoryDbService {
    private resourceRegEx = /'(\w+)'/i;
    private filterRegEx = /(?<=\$filter=)(?<filterProp>\w+)|(?<=\s)(?<operation>\w{2,3})(?=\s)|(?<=\s)'(?<filterVal>\S+?)'/gmi;
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
        return inMemDb;
    }

    parseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {
        const clean_url = decodeURIComponent(url);
        const filterParams = this.implementFilterOps(clean_url);
        const resource = clean_url.match(this.resourceRegEx)[1];
        let newUrl: string;

        if (filterParams !== null) {
            newUrl = `api/${resource}?${filterParams}`;
            console.log(`the filter url => ${newUrl}`);
        } else {
            newUrl = `api/${resource}`;
        }
        const parsed = utils.parseRequestUrl(newUrl);
        console.log(`parseRequestUrl override of '${clean_url}':`, parsed);
        return parsed;
    }

    responseInterceptor(resOptions: ResponseOptions, reqInfo: RequestInfo) {
        const method = reqInfo.method.toUpperCase();
        resOptions.body = JSON.stringify({ d: { results: resOptions.body } });
        const body = JSON.stringify(resOptions);
        console.log(`responseInterceptor: ${method} ${reqInfo.req.url}: \n${body}`);

        return resOptions;
    }

    private implementFilterOps(filterUrl: string): string {
        if (!filterUrl.includes('$filter')) {
            return null;
        }
        const filterRegEx = /\$filter=(?<filterProp>\w+)\s+?(?<operator>\w{2,3})\W'(?<findValue>\S+?)'/i;
        console.log(`for url: ${filterUrl}`);
        const foundMatches = <any> filterUrl.match(filterRegEx);

        const filterQuery = `${foundMatches.groups.filterProp}=^${foundMatches.groups.findValue}`;
        console.log(`filter done => ${filterQuery}`);
        return filterQuery;
    }

}
