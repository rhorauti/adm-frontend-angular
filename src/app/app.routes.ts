import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { NewPasswordComponent } from './pages/auth/new-password/new-password.component';
import { RedirectComponent } from './pages/auth/redirect/redirect.component';
import { CompanyComponent } from './pages/register/company/company.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'new-password',
    component: NewPasswordComponent,
  },
  {
    path: 'redirect',
    component: RedirectComponent,
  },
  {
    path: 'company',
    component: CompanyComponent,
  },
  {
    path: '**',
    component: LoginComponent,
  },
];
