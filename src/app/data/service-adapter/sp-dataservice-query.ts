import {
    MappingContext,
    EntityQuery,
    core
} from 'breeze-client';
import { CustomDataServiceUtils } from './sp-dataservice-utils';
import { QueryResult } from 'breeze';

export class CustomQueryContext {
    
    private headers: Object;

    constructor(private mappingContext: MappingContext, private utils: CustomDataServiceUtils) {
        
    }

    query(headers: Object, ajaxCaller: any): Promise<any> {
        this.mappingContext = this.utils.getDefaultSelect(this.mappingContext);
        let url = this.utils.getAbsoluteUrl(this.mappingContext.dataService, this.mappingContext.getUrl());

        // Add query params if .withParameters was used
        const query = this.mappingContext.query as EntityQuery;

        if (!core.isEmpty(query.parameters)) {
            const paramString = this.toQueryString(query.parameters);
            const sep = url.indexOf('?') < 0 ? '?' : '&';
            url = url + sep + paramString;
        }

        const defaultHeaders = this.utils.getRequestDigestHeaders(headers);

        const promise = new Promise<QueryResult>((resolve, reject) => {

            ajaxCaller.ajax({
                type: 'GET',
                url: url,
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