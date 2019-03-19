import { HttpHeaders } from '@angular/common/http';

export class OData3Request {
    private headers: { [index: string]: string };
    dataElementType = 'request';

    constructor(private method: string, private url: string, private data: {}, private contentId: string, headers: { [index: string]: string }) {
        this.headers = {
            'Content-Type': 'application/json;odata=verbose',
            'Accept-Charset': 'UTF-8',
            Accept: 'application/json;odata=verbose'
        };
        if (headers) {
            this.addHeaders(headers);
        }
    }

    get Body(): string {
        let body = 'Content-Type: application/http\r\n';
        body += 'Content-Transfer-Encoding:binary\r\n\r\n';
        body += '\r\n';
        body += `${this.method} ${this.url} HTTP/1.1\r\n`;
        const keys = Object.keys(this.Headers);
        for (const key of keys) {
            body += `${key}: ${this.Headers[key]}\r\n`;
        }
        body += this.contentId ? `Content-ID:${this.contentId}\r\n` : `\r\n`;
        body += this.data ? `\r\n${this.data}\r\n` : `\r\n`;
        console.log(body);
        return body;
    }

    get Headers(): { [index: string]: string } {
        return this.headers;
    }

    addHeaders(headers: { [index: string]: string }): void {
        const newHeaderkeys = Object.keys(headers);
        newHeaderkeys.forEach(hKey => {
            if (this.Headers[hKey]) {
                return;
            }
            this.Headers[hKey] = headers[hKey];
        });
    }
}
