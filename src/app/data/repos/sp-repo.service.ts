import { Injectable } from '@angular/core';
import { BaseSpJsom } from './base-spjsom-repo.service';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Resolve } from '@angular/router';

@Injectable({providedIn: 'root'})
export class SpRepoService extends BaseSpJsom implements Resolve<any> {

    peopleManger: SP.UserProfiles.PeopleManager;
    requestDigest: string;
    digestExpiry: moment.Moment;
    peopleManager: SP.UserProfiles.PeopleManager;
    spUser: SP.User;

    constructor(private http: HttpClient) {
        super('');
    }

    async resolve(): Promise<any> {
        this.requestDigest = await this.getRequestDigest(this.appSite) as string;
        this.appCtx = SP.ClientContext.get_current();
        const peopleManger = new SP.UserProfiles.PeopleManager(this.appCtx);
        this.appWeb = this.appCtx.get_web();
        const spUserProfile = peopleManger.getMyProperties();
        this.spUser = this.appWeb.get_currentUser();
        this.spUser.retrieve();
        const userGroups = this.spUser.get_groups();
        this.appCtx.load(this.appWeb);
        this.appCtx.load(this.spUser);
        this.appCtx.load(this.peopleManger);
        this.appCtx.load(userGroups);
        this.appCtx.load(spUserProfile);
        await this.appCtx.executeQueryAsync(Promise.resolve, this.spQueryFailed);
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
