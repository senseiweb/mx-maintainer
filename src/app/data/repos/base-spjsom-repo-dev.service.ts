import { Observable, Observer } from 'rxjs';
import { ScriptKey, ScriptModel, ScriptStore } from '../../app-script-model';


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

    async getChoiceValues(listName: string, columnName: string): Promise<string[]> {
        if (listName === 'ActionItem' && columnName === 'TeamType') {
            return ['EW', 'Load Team', 'Tow Team', 'Specialist-Com/Nav'];
        }
        if (listName === 'Generation' && columnName === 'Iso') {
            return ['None', 'Unknown', 'Global Thunder', 'Hectic Roller', 'Prairie Viligance'];
        }
        const list = this.appList.getByTitle(listName);
        const field = list.get_fields().getByInternalNameOrTitle(columnName);
        const choiceField = this.appCtx.castTo(field, SP.FieldChoice) as SP.FieldChoice;
        this.appCtx.load(choiceField);
        await this.appCtx.executeQueryAsync(Promise.resolve, this.spQueryFailed);
        return choiceField.get_choices();
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
