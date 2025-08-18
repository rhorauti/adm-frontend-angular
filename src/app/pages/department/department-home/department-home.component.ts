// import { Component, inject, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
// import { TableHeaderBoxComponent } from '@components/side-bar/side-bar.component';
// import { PaginationComponent } from '@components/pagination/pagination.component';
// import { MatIconModule } from '@angular/material/icon';
// import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
// import { ButtonDeleteComponent } from '@components/button/button-delete/button-delete.component';
// import { ButtonIconComponent } from '@components/button/button-icon/button-icon.component';
// import { TooltipComponent } from '@components/tooltip/tooltip.component';
// import { ToogleButtonComponent } from '@components/toogle-button/toogle-button.component';
// import { InputComponent } from '@components/input/input.component';
// import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
// import { ModalStore } from '@store/modal/modal.store';
// import { AuthStore } from '@store/auth/auth.store';
// import { loadStorage } from '@core/utils/misc';
// import { IDepartment } from '@core/interfaces/department.interface';
// import { DepartmentStore } from '@store/department/department.store';

// @Component({
//   selector: 'app-department-home',
//   imports: [
//     CommonModule,
//     TableHeaderBoxComponent,
//     InputComponent,
//     PaginationComponent,
//     BreadcrumbComponent,
//     MatIconModule,
//     ButtonLabelComponent,
//     ButtonDeleteComponent,
//     ButtonIconComponent,
//     TooltipComponent,
//     ToogleButtonComponent,
//     ButtonCloseComponent,
//   ],
//   templateUrl: './department-home.component.html',
//   styleUrl: './department-home.component.scss',
// })
// export class DepartmentHomeComponent implements OnInit {
//   readonly departmentStore = inject(DepartmentStore);
//   readonly authStore = inject(AuthStore);
//   readonly modalStore = inject(ModalStore);

//   tableHeadersLocalStorageId = 'table_headers_deparment' + this.authStore.user().id;

//   async ngOnInit() {
//     this.departmentStore.onGetDepartmentList();
//     const tableHeaders = loadStorage(this.tableHeadersLocalStorageId);
//     if (tableHeaders) {
//       this.departmentStore.onSetTableHeaders(tableHeaders);
//     }
//   }

//   async onDeleteDepartment(): Promise<void> {
//     const itemToDelete = this.departmentStore.itemSelected() as IDepartment;
//     await this.departmentStore.onDeleteRegister(itemToDelete?.idDepartment);
//   }

//   onShowModalToDelete(): void {
//     this.modalStore.onShowAskModal(
//       'Cadastro de departamentos',
//       `Deseja excluir o registro <b>${this.departmentStore.itemSelected()?.name || ''}</b>?`,
//       () => this.onDeleteDepartment()
//     );
//   }
// }
