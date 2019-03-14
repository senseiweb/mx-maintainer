import { HttpHeaders } from '@angular/common/http';

export class OData3Request {
    private headers: HttpHeaders;

    constructor(private method: string, private url: string, private data: {}, private contentId: string, headers: HttpHeaders) {
        this.headers = new HttpHeaders({
            DataServiceVersion: '3.0;NetFx',
            MaxDataServiceVersion: '3.0;NetFx',
            'Content-Type': 'application/json;odata=minimalmetadata',
            Accept: 'application/json;odata=minimalmetadata'
        });
        this.addHeaders(headers);
    }

    get Body(): string {
        let body = `Content-Type: application/http
        Content-Transfer-Encoding:binary\n
        ${this.method} ${this.url} HTTP/1.1\n`;
        const keys = this.Headers.keys();
        for (const key of keys) {
            body += `${key}: ${this.Headers.get(key)}\n`;
        }
        body += this.contentId ? `Content-ID:${this.contentId}\n` : `\n`;
        body += this.data ? `\n${JSON.stringify(this.data)}\n` : `\n`;
        return body;
    }
    ID;
    get Headers(): HttpHeaders {
        return this.headers;
    }

    addHeaders(headers: HttpHeaders): void {
        if (!headers) {
            return;
        }
        headers.keys().forEach(key => {
            this.headers.append(key, headers.get(key));
        });
    }
}
