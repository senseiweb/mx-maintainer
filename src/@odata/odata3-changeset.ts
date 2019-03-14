import { OData3Request } from './odata3-request';
import { UUID } from 'angular2-uuid';
import { Injectable } from '@angular/core';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';

export class OData3Changeset {
    private changesetId: string;
    private requestQueue: OData3Request[];

    constructor(uuid: UUID) {
        this.requestQueue = [];
        this.changesetId = `changeset_${uuid}`;
    }

    get Id(): string {
        return this.changesetId;
    }
    get Body(): string {
        let body = `Content-Type: multipart/mixed; boundary=${this.Id}\r\n
        Content-Transfer-Encoding:binary\r\n\r\n`;

        this.requestQueue.forEach(item => {
            body += `--${this.Id}\r\n${item.Body}\r\n`;
        });
        body += `--${this.Id}--\r\n`;

        return body;
    }

    addRequest(request: OData3Request): void {
        this.requestQueue.push(request);
    }
}
