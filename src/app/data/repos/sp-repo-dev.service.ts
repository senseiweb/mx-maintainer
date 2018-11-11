import { Injectable } from '@angular/core';
import { BaseSpJsom } from './base-spjsom-repo.service';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Resolve } from '@angular/router';

@Injectable({ providedIn: 'root'})
export class SpRepoService extends BaseSpJsom implements Resolve<any> {

    peopleManger: SP.UserProfiles.PeopleManager;
    requestDigest: string;
    digestExpiry: moment.Moment;
    peopleManager: SP.UserProfiles.PeopleManager | any;
    spUser: SP.User;

    constructor(private http: HttpClient) {
        super('');
    }

    async resolve(): Promise<any> {
        this.peopleManager = {
                getMyProperties: () => {
                    return {
                        get_userProfileProperties: () => {
                            return {
                                LastName: 'Developer',
                                FirstName: 'Application'
                            };
                        }
                    };
            }
        };

        this.spUser = {} as any;
        this.spUser.get_id = () => 1332453223;
        this.spUser.get_userId = () => 'ioafiouasifodsafda' as any;
        const enumerator = { moveNext: () => false };
        this.spUser.get_groups = () => {
            return {
                getEnumerator: () => enumerator
            } as any;
        };

        return Promise.resolve();
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
