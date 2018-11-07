import { Injectable } from '@angular/core';
import { BaseSpJsom } from './base-spjsom-repo.service';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Resolve } from '@angular/router';

@Injectable()
export class SpRootDataService extends BaseSpJsom implements Resolve<any> {

    peopleManger: SP.UserProfiles.PeopleManager;
    requestDigest: string;
    digestExpiry: moment.Moment;

    constructor(private http: HttpClient) {
        super('');
    }

    async resolve(): Promise<any> {
        this.requestDigest = await this.getRequestDigest(this.appSite) as string;
        this.appCtx = SP.ClientContext.get_current();
        this.peopleManger = new SP.UserProfiles.PeopleManager(this.appCtx);
        this.appWeb = this.appCtx.get_web();
        this.appCtx.load(this.appWeb);
        this.appCtx.load(this.peopleManger);
        await new Promise((resolve, reject) => {
            this.appCtx.executeQueryAsync(resolve, (_sender, error) => {
                console.error(`Critical Error: failed to get data from the server--> ${error.get_message()}`);
                reject(error.get_message());
            });
        });
    }

    async getRequestDigest(contextSite?: string): Promise<string> {
        const now = moment();
        if (now.add(1, 'minute') <= this.digestExpiry) {
            return Promise.resolve(this.requestDigest);
        }
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json;odata=verbose',
                'Accept': 'application/json;odata=verbose'
            })
        };
        try {
            const response = await this.http.post(`${contextSite}/_api/contextinfo`, {}, httpOptions).toPromise();
            console.log(response);
            const rawdigest = response['d']['GetContextWebInformation']['FormDigestValue'];
            const timeOut = response['d']['GetContextWebInformation']['FormDigestTimeoutSeconds'];
            const currentTime = moment();
            this.digestExpiry = currentTime.add(timeOut, 'seconds');
            return rawdigest;
        } catch (e) {
            console.error(e);
        }
    }
}
