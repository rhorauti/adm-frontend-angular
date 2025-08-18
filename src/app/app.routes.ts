import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { NewPasswordComponent } from './pages/auth/new-password/new-password.component';
import { RedirectComponent } from './pages/auth/redirect/redirect.component';
// import { MaintenanceTaskHomeComponent } from '@pages/maintenance/maintenance-task-home/maintenance-task-home.component';
import { CompanyHomeComponent } from '@pages/company/company-home/company-home.component';
import { CompanyFormComponent } from '@pages/company/company-form/company-form.component';
import { MaintenanceTaskFormComponent } from '@pages/maintenance/maintenance-task-form/maintenance-task-form.component';
// import { DepartmentHomeComponent } from '@pages/department/department-home/department-home.component';
import { DepartmentFormComponent } from '@pages/department/department-form/department-form.component';
import { EmployeePositionHomeComponent } from '@pages/employee/employee-position-home/employee-position-home.component';
import { EmployeePositionFormComponent } from '@pages/employee/employee-position-form/employee-position-form.component';
import { EmployeeHomeComponent } from '@pages/employee/employee-home/employee-home.component';
import { EmployeeFormComponent } from '@pages/employee/employee-form/employee-form.component';
import { ProductHomeComponent } from '@pages/product/product-home/product-home.component';
import { ProductFormComponent } from '@pages/product/product-form/product-form.component';

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
    path: 'companies',
    component: CompanyHomeComponent,
  },
  {
    path: 'companies/new',
    component: CompanyFormComponent,
  },
  {
    path: 'companies/edit/:id',
    component: CompanyFormComponent,
  },
  {
    path: 'products',
    component: ProductHomeComponent,
  },
  {
    path: 'products/new',
    component: ProductFormComponent,
  },
  {
    path: 'products/edit/:id',
    component: ProductFormComponent,
  },
  // {
  //   path: 'departments',
  //   component: DepartmentHomeComponent,
  // },
  {
    path: 'departments/new',
    component: DepartmentFormComponent,
  },
  {
    path: 'departments/edit/:id',
    component: DepartmentFormComponent,
  },
  {
    path: 'employees',
    component: EmployeeHomeComponent,
  },
  {
    path: 'employees/new',
    component: EmployeeFormComponent,
  },
  {
    path: 'employees/edit/:id',
    component: EmployeeFormComponent,
  },
  {
    path: 'employee-positions',
    component: EmployeePositionHomeComponent,
  },
  {
    path: 'employee-positions/new',
    component: EmployeePositionFormComponent,
  },
  {
    path: 'employee-positions/edit/:id',
    component: EmployeePositionFormComponent,
  },
  // {
  //   path: 'maintenance/tasks',
  //   component: MaintenanceTaskHomeComponent,
  // },
  {
    path: 'maintenance/tasks/new',
    component: MaintenanceTaskFormComponent,
  },
  {
    path: 'maintenance/tasks/edit/:id',
    component: MaintenanceTaskFormComponent,
  },
  {
    path: '**',
    component: LoginComponent,
  },
];
