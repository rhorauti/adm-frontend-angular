import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@pages/auth/login/login.component').then(c => c.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('@pages/auth/signup/signup.component').then(c => c.SignupComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('@pages/auth/reset-password/reset-password.component').then(
        c => c.ResetPasswordComponent
      ),
  },
  {
    path: 'new-password',
    loadComponent: () =>
      import('@pages/auth/new-password/new-password.component').then(c => c.NewPasswordComponent),
  },
  {
    path: 'redirect',
    loadComponent: () =>
      import('@pages/auth/redirect/redirect.component').then(c => c.RedirectComponent),
  },
  {
    path: 'companies',
    loadComponent: () =>
      import('@pages/company/company-home/company-home.component').then(
        c => c.CompanyHomeComponent
      ),
  },
  {
    path: 'companies/new',
    loadComponent: () =>
      import('@pages/company/company-form/company-form.component').then(
        c => c.CompanyFormComponent
      ),
  },
  {
    path: 'companies/new/:id',
    loadComponent: () =>
      import('@pages/company/company-form/company-form.component').then(
        c => c.CompanyFormComponent
      ),
  },
  {
    path: 'companies/edit/:id',
    loadComponent: () =>
      import('@pages/company/company-form/company-form.component').then(
        c => c.CompanyFormComponent
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('@pages/product/product-home/product-home.component').then(
        c => c.ProductHomeComponent
      ),
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('@pages/product/product-form/product-form.component').then(
        c => c.ProductFormComponent
      ),
  },
  {
    path: 'products/edit/:id',
    loadComponent: () =>
      import('@pages/product/product-form/product-form.component').then(
        c => c.ProductFormComponent
      ),
  },
  {
    path: 'departments',
    loadComponent: () =>
      import('@pages/department/department-home/department-home.component').then(
        c => c.DepartmentHomeComponent
      ),
  },
  {
    path: 'departments/new',
    loadComponent: () =>
      import('@pages/department/department-form/department-form.component').then(
        c => c.DepartmentFormComponent
      ),
  },
  {
    path: 'departments/new/:id',
    loadComponent: () =>
      import('@pages/department/department-form/department-form.component').then(
        c => c.DepartmentFormComponent
      ),
  },
  {
    path: 'departments/edit/:id',
    loadComponent: () =>
      import('@pages/department/department-form/department-form.component').then(
        c => c.DepartmentFormComponent
      ),
  },
  {
    path: ':idCompany/employees',
    loadComponent: () =>
      import('@pages/employee/employee-home/employee-home.component').then(
        c => c.EmployeeHomeComponent
      ),
  },
  {
    path: ':idCompany/employees/new',
    loadComponent: () =>
      import('@pages/employee/employee-form/employee-form.component').then(
        c => c.EmployeeFormComponent
      ),
  },
  {
    path: ':idCompany/employees/new/:idEmployee',
    loadComponent: () =>
      import('@pages/employee/employee-form/employee-form.component').then(
        c => c.EmployeeFormComponent
      ),
  },
  {
    path: ':idCompany/employees/edit/:idEmployee',
    loadComponent: () =>
      import('@pages/employee/employee-form/employee-form.component').then(
        c => c.EmployeeFormComponent
      ),
  },
  {
    path: 'employee-positions',
    loadComponent: () =>
      import('@pages/employee/employee-position-home/employee-position-home.component').then(
        c => c.EmployeePositionHomeComponent
      ),
  },
  {
    path: 'employee-positions/new',
    loadComponent: () =>
      import('@pages/employee/employee-position-form/employee-position-form.component').then(
        c => c.EmployeePositionFormComponent
      ),
  },
  {
    path: 'employee-positions/new/:id',
    loadComponent: () =>
      import('@pages/employee/employee-position-form/employee-position-form.component').then(
        c => c.EmployeePositionFormComponent
      ),
  },
  {
    path: 'employee-positions/edit/:id',
    loadComponent: () =>
      import('@pages/employee/employee-position-form/employee-position-form.component').then(
        c => c.EmployeePositionFormComponent
      ),
  },
  {
    path: 'production-lines',
    loadComponent: () =>
      import('@pages/production/production-line-home/production-line-home.component').then(
        c => c.ProductionLineHomeComponent
      ),
  },
  {
    path: 'production-lines/new',
    loadComponent: () =>
      import('@pages/production/production-line-form/production-line-form.component').then(
        c => c.ProductionLineFormComponent
      ),
  },
  {
    path: 'production-lines/new/:id',
    loadComponent: () =>
      import('@pages/production/production-line-form/production-line-form.component').then(
        c => c.ProductionLineFormComponent
      ),
  },
  {
    path: 'production-lines/edit/:id',
    loadComponent: () =>
      import('@pages/production/production-line-form/production-line-form.component').then(
        c => c.ProductionLineFormComponent
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('@pages/product/product-home/product-home.component').then(
        c => c.ProductHomeComponent
      ),
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('@pages/product/product-form/product-form.component').then(
        c => c.ProductFormComponent
      ),
  },
  {
    path: 'products/new/:id',
    loadComponent: () =>
      import('@pages/product/product-form/product-form.component').then(
        c => c.ProductFormComponent
      ),
  },
  {
    path: 'products/edit/:id',
    loadComponent: () =>
      import('@pages/product/product-form/product-form.component').then(
        c => c.ProductFormComponent
      ),
  },
  {
    path: 'product-types',
    loadComponent: () =>
      import('@pages/product/product-type-home/product-type-home.component').then(
        c => c.ProductTypeHomeComponent
      ),
  },
  {
    path: 'product-types/new',
    loadComponent: () =>
      import('@pages/product/product-type-form/product-type-form.component').then(
        c => c.ProductTypeFormComponent
      ),
  },
  {
    path: 'product-types/new/:id',
    loadComponent: () =>
      import('@pages/product/product-type-form/product-type-form.component').then(
        c => c.ProductTypeFormComponent
      ),
  },
  {
    path: 'product-types/edit/:id',
    loadComponent: () =>
      import('@pages/product/product-type-form/product-type-form.component').then(
        c => c.ProductTypeFormComponent
      ),
  },
  {
    path: 'units',
    loadComponent: () =>
      import('@pages/unit/unit-home/unit-home.component').then(c => c.UnitHomeComponent),
  },
  {
    path: 'units/new',
    loadComponent: () =>
      import('@pages/unit/unit-form/unit-form.component').then(c => c.UnitFormComponent),
  },
  {
    path: 'units/new/:id',
    loadComponent: () =>
      import('@pages/unit/unit-form/unit-form.component').then(c => c.UnitFormComponent),
  },
  {
    path: 'units/edit/:id',
    loadComponent: () =>
      import('@pages/unit/unit-form/unit-form.component').then(c => c.UnitFormComponent),
  },
  {
    path: ':department/task-types',
    loadComponent: () =>
      import('@pages/task/task-type-home/task-type-home.component').then(
        c => c.TaskTypeHomeComponent
      ),
  },
  {
    path: ':department/task-types/new',
    loadComponent: () =>
      import('@pages/task/task-type-form/task-type-form.component').then(
        c => c.TaskTypeFormComponent
      ),
  },
  {
    path: ':department/task-types/new/:idTaskType',
    loadComponent: () =>
      import('@pages/task/task-type-form/task-type-form.component').then(
        c => c.TaskTypeFormComponent
      ),
  },
  {
    path: ':department/task-types/edit/:idTaskType',
    loadComponent: () =>
      import('@pages/task/task-type-form/task-type-form.component').then(
        c => c.TaskTypeFormComponent
      ),
  },
  {
    path: ':department/tasks',
    loadComponent: () =>
      import('@pages/task/task-home/task-home.component').then(c => c.TaskHomeComponent),
  },
  {
    path: ':department/tasks/new',
    loadComponent: () =>
      import('@pages/task/task-form/task-form.component').then(c => c.TaskFormComponent),
  },
  {
    path: ':department/tasks/edit/:idTask',
    loadComponent: () =>
      import('@pages/task/task-form/task-form.component').then(c => c.TaskFormComponent),
  },
  {
    path: '**',
    loadComponent: () => import('@pages/auth/login/login.component').then(c => c.LoginComponent),
  },
];
