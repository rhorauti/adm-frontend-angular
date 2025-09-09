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
import { EmployeeApi } from '@core/http/employee/employee.api';
import { IEmployee } from '@core/interfaces/employee.interface';

@Component({
  selector: 'app-employee-home',
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
  templateUrl: './employee-home.component.html',
  styleUrl: './employee-home.component.scss',
})
export class EmployeeHomeComponent implements OnInit {
  readonly employeeApi = inject(EmployeeApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);

  readonly currentView = 'employees';
  readonly currentViewTranslated = 'Funcionários';
  readonly keyId = 'idEmployee';
  readonly breadcrumbList = ['Cadastro', 'Funcionários'];
  readonly inputSearchFilterList: KeyOfData[] = ['idEmployee', 'name', 'email'];
  readonly inputSearchPlaceholder = 'Id, Nome, Email';
  readonly initialTableHeaders = [
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idEmployee',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Foto',
      databaseField: 'photoUrl',
    },
    {
      id: 2,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Nome',
      databaseField: 'name',
    },
    {
      id: 3,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Departmento',
      databaseField: 'department',
    },
    {
      id: 4,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Cargo',
      databaseField: 'position',
    },
    {
      id: 5,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'E-mail',
      databaseField: 'email',
    },
    {
      id: 6,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Telefone fixo',
      databaseField: 'deskphone',
    },
    {
      id: 7,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Celular',
      databaseField: 'cellphone',
    },
  ] as ITableHeader<IEmployee>[];
  tableHeadersLocalStorageId = `table_headers_${this.currentView} + ${this.authStore.user().id}`;

  async ngOnInit() {
    this.onShowDataList();
    const tableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
    const headers = tableHeaders ? tableHeaders : this.initialTableHeaders;
    this.baseRegisterStore.onSetSlicePropsToNewValue('tableHeaders', headers);
  }

  onRedirectToEditPage = (data: IEmployee): void => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', data);
    this.baseRegisterStore.onSetSlicePropsToNewValue('isEditData', true);
    this.modalStore.onRedirectPage(
      `/${this.currentView}/edit/${(this.baseRegisterStore.data() as IEmployee)[this.keyId]}`
    );
  };

  onCloneRegister = async (data: IEmployee): Promise<void> => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('isCopiedData', true);
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', data);
    this.modalStore.onRedirectPage(`/${this.currentView}/new`);
  };

  onShowDataList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.employeeApi.onGetDataList();
      if (response.data) {
        const data = response.data as IEmployee[];
        this.baseRegisterStore.onSetSlicePropsToNewValue('initialData', data);
        this.baseRegisterStore.onSetSlicePropsToNewValue('dataList', data);
        this.baseRegisterStore.onClearData(data);
      } else {
        return;
      }
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
      const response = await this.employeeApi.onDelete(id);
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

  async onDelete(data: IEmployee): Promise<void> {
    await this.onDeleteRegister(data[this.keyId] as number);
  }

  onShowModalToDelete(data?: IEmployee): void {
    const selectedData = data ? data : (this.baseRegisterStore.itemSelected() as IEmployee) || '';
    this.modalStore.onShowAskModal(
      `Cadastro de ${this.currentViewTranslated}`,
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }
}
