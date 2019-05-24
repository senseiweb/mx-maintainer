import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
    {
        path: 'aagt',
        loadChildren: './features/aagt/aagt.module#AagtModule'
    },
    {
        path: '',
        redirectTo: '/user/dashboard',
        pathMatch: 'full'
    }
]; 

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            useHash: true
            // enableTracing: true
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
