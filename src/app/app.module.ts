import { NgModule, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core';
import { DataModule } from './data/data.module';
import { UserModule } from './user/user.module';
import { RollbarService, AppErrorHandler, rollbarFactory } from './app-error-handler.service';
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        DataModule.forRoot(),
        CoreModule,
        AppRoutingModule,
        UserModule
    ],
    providers: [
        // { provide: ErrorHandler, useClass: AppErrorHandler},
        // { provide: RollbarService, useFactory: rollbarFactory }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
