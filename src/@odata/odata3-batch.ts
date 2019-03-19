import { UUID } from 'angular2-uuid';
import { OData3Changeset } from './odata3-changeset';
import { OData3Request } from './odata3-request';

export class OData3Batch {
    private batchId: string;
    private batchUrl: string;
    private batchQueue: Array<OData3Changeset | OData3Request>;
    private headers: { [index: string]: string };
    private proxyUrl: string;
    private proxyAllowInsecureCert: boolean;

    constructor(private url: string, uuid: UUID) {
        this.batchQueue = [];
        this.batchId = `batch_${uuid}`;
        this.batchUrl = url;
        this.headers = {
            Accept: 'application/json;odata=verbose',
            'Content-Type': `multipart/mixed; boundary="${this.Id}"`,
            DataServiceVersion: '3.0'
        };
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

    get Headers(): { [index: string]: string } {
        return this.headers;
    }

    get Body(): string {
        let body = `--${this.Id}\r\n`; // header
        let previousQuedItemType: any;

        // hack to make the changeset support muliple headers but only one footer;
        this.Queue.forEach((item: any, index) => {
            if (!previousQuedItemType) {
                if (item.dataElementType === 'changeset') {
                    body += this.getChangeSetHeader(item);
                }
                previousQuedItemType = item.dataElementType;
                body += `${item.Body}\r\n`; // body
                return;
            }

            if (item.dataElementType !== previousQuedItemType && index < this.Queue.length) {
                if (previousQuedItemType === 'changeset') {
                    body += `${item.Body}\r\n`;
                    body += `--${item.Id}--\r\n`; // foote
                    return;
                }
                if (item === 'changeset') {
                    body += this.getChangeSetHeader(item);
                }
                body += `${item.Body}\r\n`;
                previousQuedItemType = item.dataElementType;
                return;
            }

            if (index === this.Queue.length - 1 && previousQuedItemType === 'changeset') {
                body += `${item.Body}\r\n`;
                body += `--${item.Id}--\r\n`; // footer
            } else {
                body += `${item.Body}\r\n`;
            }
        });

        body += `--${this.Id}--\r\n`;

        return body;
    }

    get Queue(): Array<OData3Changeset | OData3Request> {
        return this.batchQueue;
    }

    addChangeset(changeset: OData3Changeset): void {
        this.batchQueue.push(changeset);
    }

    getChangeSetHeader(changset: OData3Changeset): string {
        let chngSetBody = `Content-Type: multipart/mixed; boundary="${changset.Id}"\r\n`;
        chngSetBody += `Content-Length: ${changset.Body.length}\r\n`;
        chngSetBody += 'Content-Transfer-Encoding:binary\r\n\r\n';
        chngSetBody += '\r\n';
        // chngSetBody += changset.Body;
        return chngSetBody;
    }

    // addRequest(request: OData3Request): void {
    //     this.batchQueue.push(request);
    // }

    addHeaders(headers: { [index: string]: string }): void {
        const newHeaderkeys = Object.keys(headers);
        newHeaderkeys.forEach(hKey => {
            if (this.Headers[hKey]) {
                return;
            }
            this.Headers[hKey] = headers[hKey];
        });
    }

    getBatchRequest(): { url: string; headers: { [index: string]: string }; body: string } {
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
