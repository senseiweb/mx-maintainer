import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ScriptModel, ScriptStore, ScriptKey } from 'app/app-script-model';
import { Observable } from 'rxjs/observable';
import { Observer } from 'rxjs/Observer';
import { MxAppEnum, MxFilterTag, MxmTagMetadata } from '../models';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({ providedIn: 'root' })
// At times it is easier to retrieve things using the
// the sharepoint JSOM libraries and cached them for later use
export class SpDataRepoService implements Resolve<any> {
  mxMaintainerContextSite = 'https://cs2.eis.af.mil/sites/10918/mx-maintainer';
  followingManager: SP.Social.SocialFollowingManager;
  actorInfo: SP.Social.SocialActorInfo;
  spClientCtx: SP.ClientContext;
  situeUrl: string;
  private scripts: Array<ScriptModel> = [];
  clientWeb: SP.Web;
   peopleManger: SP.UserProfiles.PeopleManager;
  isInitializer = false;

  constructor(
    private tagsMetadata: MxmTagMetadata,
    private http: HttpClient
  ) {}

  async resolve(): Promise<any> {
    if (this.isInitializer) { return Promise.resolve(); }
    const digestValue = await this.getRequestDigest(this.mxMaintainerContextSite);
    this.spClientCtx = SP.ClientContext.get_current();
    this.clientWeb = this.spClientCtx.get_web();
    this.peopleManger = new SP.UserProfiles.PeopleManager(this.spClientCtx);
    this.followingManager = new SP.Social.SocialFollowingManager(this.spClientCtx);
    this.actorInfo = new SP.Social.SocialActorInfo();
    this.spClientCtx.load(this.clientWeb);
    await new Promise((resolve, reject) => {
      this.spClientCtx.executeQueryAsync(resolve, (sender, error) => {
        console.error(`Critical Error: failed to get data from the server--> ${error.get_message()}`);
        reject(error.get_message());
      });
    });
    this.isInitializer = true;
  }

  async fetchAppTags(supportedApp: MxAppEnum): Promise<Array<MxFilterTag>> {
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
      this.spClientCtx.executeQueryAsync(resolve, (sender, error) => {
        console.error(`Fetch Error: failed to get data from the server--> ${error.get_message()}`);
        reject(error.get_message());
      });
    });
    return spMxmTagList as any;
  }

  async getRequestDigest(contextSite: string): Promise<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    try {
      const response = await this.http.post(`${contextSite}\\_api\\contextinfo`, httpOptions);
      console.log(response);
      return response['RequestDigest'];
    } catch (e) {
      console.log('Error getting request digest ' + e);
    }
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
        scriptElement.onerror = (error: any) => {
          observer.error(`Failure loading secondary scripts: ${script.id}`);
        };

        document.getElementsByTagName('body')[0].appendChild(scriptElement);
      }
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
