import { Routes } from '@angular/router';

import { AppSideLogInComponent } from './LogIn/LogIn.component';
import { AppSideRegisterComponent } from './register/register.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'LogIn',
        component: AppSideLogInComponent,
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
      },
    ],
  },
];
