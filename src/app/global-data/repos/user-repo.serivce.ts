import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService } from 'app/global-data';
import { GlobalDataModule } from '../data.module';
import { GlobalUser } from '../models/user.model';
import { AppConfig } from 'app/app-config.service';

@Injectable({ providedIn: GlobalDataModule })
export class GlobalUserRepo extends BaseRepoService<GlobalUser> {
    constructor(emService: EmProviderService, private appConfig: AppConfig) {
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
