import { OData3Request } from './odata3-request';
import { UUID } from 'angular2-uuid';
import { Injectable } from '@angular/core';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';

export class OData3Changeset {
    private changesetId: string;
    request: OData3Request;
    dataElementType = 'changeset';
    constructor(uuid: UUID) {
        // this.requestQueue = [];
        this.changesetId = `changeset_${uuid}`;
    }

    get Id(): string {
        return this.changesetId;
    }

    get Body(): string {
        // requestBody += `${item.Body}\r\n`;
        // bodySize += item.Body.length;

        let body = `--${this.Id}\r\n`;
        body += this.request.Body;
        return body;
    }

    // Hack sharepoint does not send back content id so only support one request per changeset
    // addRequest(request: OData3Request): void {
    //     this.requestQueue.push(request);
    // }
}
