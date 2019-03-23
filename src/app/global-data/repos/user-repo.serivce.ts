import { Injectable } from '@angular/core';
import { AppConfig } from 'app/app-config.service';
import { BaseRepoService, EmProviderService } from 'app/global-data';
import { GlobalDataModule } from '../data.module';
import { GlobalUser } from '../models/user.model';
import { GlobalEmProviderService } from './global-emprovider.service';

@Injectable({ providedIn: GlobalDataModule })
export class GlobalUserRepo extends BaseRepoService<GlobalUser> {
    constructor(emService: GlobalEmProviderService, private appConfig: AppConfig) {
        super('UserItem', emService);
    }

    create(): GlobalUser {
        return this.createBase({
            title: ''
        });
    }

    setNavStruct(): void {
        this.appConfig.setNavStructure();
    }
}
