import { HttpHeaders } from '@angular/common/http';
import { core, EntityQuery, MappingContext } from 'breeze-client';
import { QueryResult } from 'breeze-client/src/entity-manager';
import { CustomDataServiceUtils } from './sp-dataservice-utils';

export class CustomQueryContext {
    private headers: Object;

    constructor(private mappingContext: MappingContext, private utils: CustomDataServiceUtils) {}

    query(headers: { [index: string]: string }, ajaxCaller: any): Promise<any> {
        this.mappingContext = this.utils.getDefaultSelect(this.mappingContext);
        let url = this.utils.getAbsoluteUrl(this.mappingContext.dataService, this.mappingContext.getUrl());

        // Add query params if .withParameters was used
        const query = this.mappingContext.query as EntityQuery;

        if (!core.isEmpty(query.parameters)) {
            const paramString = this.toQueryString(query.parameters);
            const sep = url.indexOf('?') < 0 ? '?' : '&';
            url = url + sep + paramString;
        }
        const defaultHeaders = {};
        const requestHeaders = this.utils.getRequestDigestHeaders(headers);

        const newHeaderkeys = Object.keys(requestHeaders);

        newHeaderkeys.forEach(hKey => {
            defaultHeaders[hKey] = requestHeaders[hKey];
        });

        const promise = new Promise<QueryResult>((resolve, reject) => {
            ajaxCaller.ajax({
                type: 'GET',
                url,
                dataType: 'json',
                headers: defaultHeaders,
                params: query.parameters,
                success: resolve,
                error: reject
            });
        });

        return promise;
    }

    private toQueryString(obj: Object) {
        const parts: string[] = [];

        for (const i in obj) {
            if (obj.hasOwnProperty(i)) {
                parts.push(`${encodeURIComponent(i)}=${encodeURIComponent(obj[i])}`);
            }
        }
        return parts.join('&');
    }
}
