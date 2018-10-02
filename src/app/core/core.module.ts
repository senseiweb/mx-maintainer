import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmProviderService, BaseRepoService } from './data';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    EmProviderService,
    BaseRepoService
  ],
  declarations: []
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('Core Module is injected only once into the main app module');
    }
  }
}
