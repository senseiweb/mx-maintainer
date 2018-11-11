import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashComponent } from './user-dash/user-dash.component';
import { UserBaseComponent } from './user-base/user-base.component';
import { SpRepoService } from 'app/data/repos';
import { UserService} from 'app/data';

const userRoutes: Routes = [
    {
        path: 'user',
        component: UserBaseComponent,
        resolve: { data: SpRepoService, userService: UserService},
        children: [{
            path: 'dashboard',
            component: UserDashComponent
        }]
    }
];
export const routedComponents = [UserBaseComponent, UserDashComponent];

@NgModule({
    imports: [
        RouterModule.forChild(userRoutes),
    ],
    exports: [
        RouterModule
    ]
})
export class UserRoutingModule {
    constructor() { }
}
