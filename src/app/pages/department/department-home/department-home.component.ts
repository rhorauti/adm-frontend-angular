import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@components/table/table.component';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { TableHeaderBoxComponent } from '@components/side-bar/side-bar.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { ButtonDeleteComponent } from '@components/button/button-delete/button-delete.component';
import { ButtonIconComponent } from '@components/button/button-icon/button-icon.component';
import { TooltipComponent } from '@components/tooltip/tooltip.component';
import { ToogleButtonComponent } from '@components/toogle-button/toogle-button.component';
import { InputComponent } from '@components/input/input.component';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { ModalStore } from '@store/modal/modal.store';
import { AuthStore } from '@store/auth/auth.store';
import { loadStorage } from '@core/utils/misc';
import { BaseRegisterStore, defaultTableHeaderIcon } from '@store/base/base.register.store';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { KeyOfData } from '@core/types/base.type';
import { ITableHeader } from '@core/interfaces/table.interface';
import { IDepartment } from '@core/interfaces/department.interface';
import { DepartmentApi } from '@core/http/department/department.api';

@Component({
  selector: 'app-department-home',
  imports: [
    CommonModule,
    TableHeaderBoxComponent,
    InputComponent,
    TableComponent,
    PaginationComponent,
    BreadcrumbComponent,
    MatIconModule,
    ButtonLabelComponent,
    ButtonDeleteComponent,
    ButtonIconComponent,
    TooltipComponent,
    ToogleButtonComponent,
    ButtonCloseComponent,
  ],
  templateUrl: './department-home.component.html',
  styleUrl: './department-home.component.scss',
})
export class DepartmentHomeComponent implements OnInit {
  readonly departmentApi = inject(DepartmentApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);

  readonly currentView = 'departments';
  readonly breadcrumbList = ['Cadastro', 'Departamentos'];
  readonly inputSearchFilterList: KeyOfData[] = ['idDepartment', 'name'];
  readonly inputSearchPlaceholder = 'Id ou Departamento';
  readonly initialTableHeaders = [
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idDepartment',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Departamento',
      databaseField: 'name',
    },
    {
      id: 2,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Comentários',
      databaseField: 'comment',
    },
  ] as ITableHeader<IDepartment>[];
  tableHeadersLocalStorageId = `table_headers_${this.currentView} + ${this.authStore.user().id}`;

  async ngOnInit() {
    this.onShowDataList();
    const tableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
    const headers = tableHeaders ? tableHeaders : this.initialTableHeaders;
    this.baseRegisterStore.onSetSlicePropsToNewValue('tableHeaders', headers);
  }

  onRedirectToEditPage = (departmentData: IDepartment): void => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', departmentData);
    this.modalStore.onRedirectPage(
      `/${this.currentView}/edit/${(this.baseRegisterStore.data() as IDepartment).idDepartment}`
    );
  };

  onCloneRegister = async (data: IDepartment): Promise<void> => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', data);
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', { idDepartment: 0 });
    this.modalStore.onRedirectPage(`/${this.currentView}/new`);
  };

  onShowDataList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.departmentApi.onGetDataList();
      const dept = response.data as IDepartment[];
      this.baseRegisterStore.onSetSlicePropsToNewValue('initialData', dept);
      this.baseRegisterStore.onSetSlicePropsToNewValue('dataList', dept);
      this.baseRegisterStore.onClearData(dept);
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Listar registros', error.error?.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  onDeleteRegister = async (id: number, onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.departmentApi.onDelete(id);
      if (response.status) {
        this.onShowDataList();
        this.modalStore.onSetModalInfoType('success');
        this.modalStore.onShowInfoModal('Excluir registro', response.message, onActionOk);
      } else {
        this.modalStore.onShowInfoModal('Excluir registro', response.error?.message || '');
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Excluir registro', error.error.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  async onDelete(data: IDepartment): Promise<void> {
    await this.onDeleteRegister(data.idDepartment);
  }

  onShowModalToDelete(data?: IDepartment): void {
    const selectedData = data ? data : (this.baseRegisterStore.itemSelected() as IDepartment) || '';
    this.modalStore.onShowAskModal(
      'Cadastro de departamentos',
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }
}
