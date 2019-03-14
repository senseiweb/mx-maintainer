import { OData3Request } from './odata3-request';
import { OData3Changeset } from './odata3-changeset';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { UUID } from 'angular2-uuid';

export class OData3Batch {
    private batchId: string;
    private batchUrl: string;
    private batchQueue: (OData3Request | OData3Changeset)[];
    private headers: HttpHeaders;
    private proxyUrl: string;
    private proxyAllowInsecureCert: boolean;

    constructor(private url: string, uuid: UUID) {
        this.batchQueue = [];
        this.batchId = `batch_${uuid}`;
        this.batchUrl = url;
        this.headers = new HttpHeaders({
            Accept: 'multipart/mixed',
            'Content-Type': `multipart/mixed; boundary="${this.Id}"`,
            DataServiceVersion: '3.0;NetFx',
            MaxDataServiceVersion: '3.0;NetFx'
        });
    }

    get Id(): string {
        return this.batchId;
    }

    get ProxyUrl(): string {
        return this.proxyUrl;
    }

    get ProxyAllowInsecureCert(): boolean {
        return this.proxyAllowInsecureCert;
    }
    get Url(): string {
        return this.batchUrl;
    }

    get Headers(): HttpHeaders {
        return this.headers;
    }

    get Body(): string {
        let body = `--${this.Id}\r\n`; // header

        this.Queue.forEach(item => {
            body += `${item.Body}\r\n`; // body
        });

        body += `--${this.Id}--\r\n`; // footer

        return body;
    }

    get Queue(): (OData3Request | OData3Changeset)[] {
        return this.batchQueue;
    }

    addChangeset(changeset: OData3Changeset): void {
        this.batchQueue.push(changeset);
    }

    addRequest(request: OData3Request): void {
        this.batchQueue.push(request);
    }

    addHeaders(headers: HttpHeaders): void {
        headers.keys().forEach(key => {
            this.headers.append(key, headers.get(key));
        });
    }

    getBatchRequest(): { url: string; headers: HttpHeaders; body: string } {
        return {
            url: this.url,
            headers: this.Headers,
            body: this.Body
        };
    }

    setProxy(url: string, allowInsecureCert: boolean): void {
        this.proxyUrl = url;
        this.proxyAllowInsecureCert = allowInsecureCert;
    }
}
