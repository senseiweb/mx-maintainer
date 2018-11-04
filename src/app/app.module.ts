import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core';
import { DataModule } from './data/data.module';
import { UserModule } from './user/user.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        CoreModule,
        AppRoutingModule,
        DataModule.forRoot(),
        UserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
