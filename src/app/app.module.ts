import { NgModule, ErrorHandler, APP_INITIALIZER, InjectionToken } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core';
import { DataModule } from './global-data';
import { UserModule } from './user/user.module';
import { RollbarService, AppErrorHandler, rollbarFactory } from './app-error-handler.service';
import { IAppConfig } from '@ctypes/app-config';
import { AppConfig } from './app-config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

export const tokens: Map<string, InjectionToken<IAppConfig>> = new Map();
tokens.set('tokenName', new InjectionToken<IAppConfig>('tokenName'));

function loadCtx(appConfig: AppConfig, fuseNav: FuseNavigationService): () => Promise<boolean> {
    return (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            const spCtx = SP.ClientContext.get_current();
            const spWeb = spCtx.get_web();
            appConfig.fuseNavigation = fuseNav;
            spCtx.load(spWeb);
            spCtx.executeQueryAsync(
                (sender, args) => {
                    appConfig.sharepointMainAppSite = spWeb.get_url();
                    appConfig.spClientCtx = spCtx;
                    appConfig.spWeb = spWeb;
                    appConfig.fetchUserData().then(() => {
                        appConfig.setNavStructure();
                        resolve(true);
                    });
                },
                () => reject(false)
            );
        });
    };
}
@NgModule({
    declarations: [AppComponent],
    imports: [DataModule.forRoot(), CoreModule, AppRoutingModule, UserModule],
    providers: [
        // { provide: ErrorHandler, useClass: AppErrorHandler},
        // { provide: RollbarService, useFactory: rollbarFactory }
        {
            provide: APP_INITIALIZER,
            useFactory: loadCtx,
            multi: true,
            deps: [AppConfig, FuseNavigationService]
        }
        // {
        //     provide: tokens.get('tokenName'),
        //     useValue: new Service()
        // }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
