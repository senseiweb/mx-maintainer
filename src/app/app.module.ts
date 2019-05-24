import {
    APP_INITIALIZER,
    ErrorHandler,
    InjectionToken,
    NgModule
} from '@angular/core';
import { IAppConfig } from '@ctypes/app-config';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import {
    cfgFetchUserData,
    cfgSetNavStructure,
    MY_FORMATS,
    SpConfig
} from './app-config.service';

import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE
} from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AppRoutingModule } from './app-routing.module';
import { AppSharedModule } from './app-shared.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { GlobalDataModule } from './global-data';
import { UserModule } from './user/user.module';

export const tokens: Map<string, InjectionToken<IAppConfig>> = new Map();
tokens.set('tokenName', new InjectionToken<IAppConfig>('tokenName'));

function loadCtx(fuseNav: FuseNavigationService): () => Promise<boolean> {
    return (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            const spCtx = SP.ClientContext.get_current();
            const spWeb = spCtx.get_web();
            SpConfig.cfgFuseNavService = fuseNav;
            spCtx.load(spWeb);
            spCtx.executeQueryAsync(
                (sender, args) => {
                    SpConfig.cfgSharepointMainAppSite = spWeb.get_url();
                    SpConfig.spClientCtx = spCtx;
                    SpConfig.spWeb = spWeb;
                    cfgFetchUserData().then(() => {
                        cfgSetNavStructure();
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
    imports: [
        GlobalDataModule,
        CoreModule,
        UserModule,
        AppSharedModule,
        AppRoutingModule
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: loadCtx,
            multi: true,
            deps: [FuseNavigationService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
