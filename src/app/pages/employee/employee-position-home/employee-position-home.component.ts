import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { SideBarComponent } from '@components/side-bar/side-bar.component';
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
import { IEmployeePosition } from '@core/interfaces/employee.interface';
import { EmployeePositionApi } from '@core/http/employee/employee-position.api';
import { TableComponent } from '@components/table/table.component';
// import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-employee-position-home',
  imports: [
    CommonModule,
    SideBarComponent,
    InputComponent,
    TableComponent,
    // PaginationComponent,
    BreadcrumbComponent,
    MatIconModule,
    ButtonLabelComponent,
    ButtonDeleteComponent,
    ButtonIconComponent,
    TooltipComponent,
    ToogleButtonComponent,
    ButtonCloseComponent,
  ],
  templateUrl: './employee-position-home.component.html',
  styleUrl: './employee-position-home.component.scss',
})
export class EmployeePositionHomeComponent implements OnInit {
  readonly employeePositionApi = inject(EmployeePositionApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);

  readonly currentView = 'employee-positions';
  readonly currentViewTranslated = 'cargos';
  readonly keyId = 'idEmployeePosition';
  readonly breadcrumbList = ['Cadastro', 'Cargos'];
  readonly inputSearchFilterList: KeyOfData[] = ['idEmployeePosition', 'name'];
  readonly inputSearchPlaceholder = 'Id, Cargo, Comentários';
  readonly initialTableHeaders = [
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idEmployeePosition',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Cargo',
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
  ] as ITableHeader<IEmployeePosition>[];
  tableHeadersLocalStorageId = `table_headers_${this.currentView}_${this.authStore.user().id}`;

  async ngOnInit() {
    this.onShowDataList();
    const tableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
    const headers = tableHeaders ? tableHeaders : this.initialTableHeaders;
    this.baseRegisterStore.onSetStateToNewValue('tableHeaders', headers);
  }

  onRedirectToEditPage = (data: IEmployeePosition): void => {
    this.baseRegisterStore.onSetStateToNewValue('data', data);
    this.baseRegisterStore.onSetStateToNewValue('isEditData', true);
    this.modalStore.onRedirectPage(
      `/${this.currentView}/edit/${(this.baseRegisterStore.data() as IEmployeePosition)[this.keyId]}`
    );
  };

  onCloneRegister = async (data: IEmployeePosition): Promise<void> => {
    this.baseRegisterStore.onSetStateToNewValue('isCopiedData', true);
    this.baseRegisterStore.onSetStateToNewValue('data', data);
    this.modalStore.onRedirectPage(`/${this.currentView}/new`);
  };

  onShowDataList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.employeePositionApi.onGetDataList();
      if (response.data) {
        const data = response.data as IEmployeePosition[];
        this.baseRegisterStore.onSetStateToNewValue('initialData', data);
        this.baseRegisterStore.onSetStateToNewValue('dataList', data);
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
      const response = await this.employeePositionApi.onDelete(id);
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

  async onDelete(data: IEmployeePosition): Promise<void> {
    await this.onDeleteRegister(data[this.keyId] as number);
  }

  onShowModalToDelete(data?: IEmployeePosition): void {
    const selectedData = data
      ? data
      : (this.baseRegisterStore.itemSelected() as IEmployeePosition) || '';
    this.modalStore.onShowAskModal(
      `Cadastro de ${this.currentViewTranslated}`,
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }
}
