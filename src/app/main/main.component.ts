import { Component } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { GenerationRepoService } from '../core';

@Component({
    selector   : 'main',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class MainComponent {

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _genManagerRepo: GenerationRepoService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        console.log(_genManagerRepo);
    }
}
