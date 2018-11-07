import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Resolve } from '@angular/router';
import * as moment from 'moment';
import { Observable, Observer } from 'rxjs';
import { ScriptKey, ScriptModel, ScriptStore } from '../../app-script-model';
import { MxAppEnum, MxFilterTag, MxmTagMetadata } from '../models';

// At times it is easier to retrieve things using the
// the sharepoint JSOM libraries and cached them for later use
export class BaseSpJsom {
    private mxMaintainerContextSite = 'https://cs2.eis.af.mil/sites/10918/mx-maintainer/';
    appSite: string;
    protected actorInfo: SP.Social.SocialActorInfo;
    protected appCtx: SP.ClientContext;
    protected appWeb: SP.Web;
    protected appList: SP.ListCollection;
    protected followingManager: SP.Social.SocialFollowingManager;
    private scripts: ScriptModel[] = [];

    constructor(subSite: string) {
        this.appSite = this.mxMaintainerContextSite + subSite;
    }

    async getSpContext(): Promise<any> {
        this.appCtx = new SP.ClientContext(this.appSite);
        this.followingManager = new SP.Social.SocialFollowingManager(this.appCtx);
        this.appCtx.load(this.followingManager);
        this.appWeb = this.appCtx.get_web();
        this.appList = this.appWeb.get_lists();
        return new Promise((resolve) => {
            this.appCtx.executeQueryAsync(resolve, this.spQueryFailed);
        });
    }

    async followItem(uri: string, type: SP.Social.SocialActorType): Promise<any> {
        this.actorInfo = new SP.Social.SocialActorInfo();
        this.actorInfo.set_contentUri(uri);
        this.actorInfo.set_actorType(type);
        const isAlreadyFollowed = this.followingManager.isFollowed(this.actorInfo);
        await this.appCtx.executeQueryAsync(Promise.resolve, this.spQueryFailed);
        if (!isAlreadyFollowed) {
            this.followingManager.follow(this.actorInfo);
            return await this.appCtx.executeQueryAsync(Promise.resolve, this.spQueryFailed);
        }
        return Promise.resolve();
    }

    async stopFollowing(uri: string, type: SP.Social.SocialActorType): Promise<any> {
        this.actorInfo = new SP.Social.SocialActorInfo();
        this.actorInfo.set_contentUri(uri);
        this.actorInfo.set_actorType(type);
        const isAlreadyFollowed = this.followingManager.isFollowed(this.actorInfo);
        await this.appCtx.executeQueryAsync(Promise.resolve, this.spQueryFailed);
        if (isAlreadyFollowed) {
            this.followingManager.stopFollowing(this.actorInfo);
            return await this.appCtx.executeQueryAsync(Promise.resolve, this.spQueryFailed);
        }
        return Promise.resolve();
    }

    async fetchAppTags(supportedApp: MxAppEnum): Promise<MxFilterTag[]> {
        const spMxmTagList = this.clientWeb
            .get_lists()
            .getByTitle(this.tagsMetadata.entityDefinition.shortName);

        const queryPart = `
        <Eq>
          <FieldRef Name='SupportedApp' />
            <Value Type='Text'>
            ${supportedApp}
            </Value>
        </Eq>
    `;
        const requestedTags = spMxmTagList.getItems(this.spQueryBuild(queryPart));
        this.spClientCtx.load(requestedTags);
        await new Promise((resolve, reject) => {
            this.spClientCtx.executeQueryAsync(resolve, this.spQueryFailed);
        });
        return spMxmTagList as any;
    }

    spQueryFailed(_sender, error): Promise<any> {
        console.error(`Fetch Error: failed to get data from the server--> ${error.get_message()}`);
        return Promise.reject(error.get_message());
    }


    private spQueryBuild(spQueryPart: string): SP.CamlQuery {
        const query = new SP.CamlQuery();
        query.set_viewXml(`
      <View>
        <Query>
          <Where>
          ${spQueryPart}
          </Where>
        </Query>
      </View>
    `);
        return query;
    }

    load(key: ScriptKey): Observable<ScriptModel> {
        return new Observable<ScriptModel>((observer: Observer<ScriptModel>) => {
            const script = ScriptStore.find(s => s.id === key);

            // Complete if already loaded
            if (script && script.loaded) {
                observer.next(script);
                observer.complete();
            } else {
                this.scripts = [...this.scripts, script];

                const scriptElement = document.createElement('script');
                scriptElement.type = 'text/javascript';
                scriptElement.src = script.path;
                scriptElement.onload = () => {
                    script.loaded = true;
                    observer.next(script);
                    observer.complete();
                };
                scriptElement.onerror = (_error: any) => {
                    observer.error(`Failure loading secondary scripts: ${script.id}`);
                };

                document.getElementsByTagName('body')[0].appendChild(scriptElement);
            }
        });
    }
}
