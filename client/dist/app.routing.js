"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@angular/router");
const users_component_1 = require("./users/users.component");
const user_list_component_1 = require("./users/user-list/user-list.component");
const user_single_component_1 = require("./users/user-single/user-single.component");
const user_edit_component_1 = require("./users/user-edit/user-edit.component");
const user_create_component_1 = require("./users/user-create/user-create.component");
const login_component_1 = require("./login/login.component");
exports.routes = [
    {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: login_component_1.LoginComponent
    },
    {
        path: 'users',
        component: users_component_1.UsersComponent,
        children: [
            {
                path: '',
                component: user_list_component_1.UserListComponent
            },
            {
                path: 'create',
                component: user_create_component_1.UserCreateComponent
            },
            {
                path: ':id',
                component: user_single_component_1.UserSingleComponent
            },
            {
                path: ':id/edit',
                component: user_edit_component_1.UserEditComponent
            }
        ]
    }
];
exports.routing = router_1.RouterModule.forRoot(exports.routes, { useHash: true });
//# sourceMappingURL=app.routing.js.map