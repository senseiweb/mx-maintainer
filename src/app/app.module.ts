import { APP_INITIALIZER, ErrorHandler, InjectionToken, NgModule } from '@angular/core';
import { IAppConfig } from '@ctypes/app-config';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { AppConfig } from './app-config.service';
import { rollbarFactory, AppErrorHandler, RollbarService } from './app-error-handler.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { GlobalDataModule } from './global-data';
import { UserModule } from './user/user.module';

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
    imports: [GlobalDataModule, CoreModule, UserModule, AppRoutingModule],
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
