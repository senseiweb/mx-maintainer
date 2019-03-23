import { NgModule } from '@angular/core';
import { BreezeBridgeHttpClientModule } from 'breeze-bridge2-angular';

@NgModule({
    imports: [BreezeBridgeHttpClientModule],
    exports: [BreezeBridgeHttpClientModule],
    providers: [],
    declarations: []
})
export class GlobalDataModule {
    constructor() {}
}
