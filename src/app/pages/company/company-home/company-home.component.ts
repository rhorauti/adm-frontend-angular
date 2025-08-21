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
import { ICompany } from '@core/interfaces/company.interface';
import { AuthStore } from '@store/auth/auth.store';
import { loadStorage } from '@core/utils/misc';
import { BaseRegisterStore, defaultTableHeaderIcon } from '@store/base/base.register.store';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { CompanyApi } from '@core/http/company/company.api';
import { KeyOfData } from '@core/types/base.type';
import { ITableHeader } from '@core/interfaces/table.interface';

@Component({
  selector: 'app-company-home',
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
  templateUrl: './company-home.component.html',
  styleUrl: './company-home.component.scss',
})
export class CompanyHomeComponent implements OnInit {
  readonly companyApi = inject(CompanyApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);

  readonly currentView = 'companies';
  readonly breadcrumbList = ['Cadastro', 'Empresas'];
  readonly inputSearchFilterList: KeyOfData[] = ['idCompany', 'nickname', 'name'];
  readonly inputSearchPlaceholder = 'Id, Nome Fantasia, Razão Social';
  readonly initialTableHeaders = [
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idCompany',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Nome Fantasia',
      databaseField: 'nickname',
    },
    {
      id: 2,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Razão Social',
      databaseField: 'name',
    },
    {
      id: 3,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'CNPJ/CPF',
      databaseField: 'cnpj',
    },
    {
      id: 4,
      isHeaderActive: false,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Inscr.Estadual',
      databaseField: 'ie',
    },
    {
      id: 5,
      isHeaderActive: false,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Inscr.Municipal',
      databaseField: 'im',
    },
  ] as ITableHeader<ICompany>[];
  tableHeadersLocalStorageId = `table_headers_${this.currentView} + ${this.authStore.user().id}`;

  async ngOnInit() {
    this.onShowDataList();
    const tableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
    const headers = tableHeaders ? tableHeaders : this.initialTableHeaders;
    this.baseRegisterStore.onSetSlicePropsToNewValue('tableHeaders', headers);
  }

  onRedirectToEditPage = (data: ICompany): void => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', data);
    this.modalStore.onRedirectPage(
      `/${this.currentView}/edit/${(this.baseRegisterStore.data() as ICompany).idCompany}`
    );
  };

  onCloneRegister = async (data: ICompany): Promise<void> => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('isCopiedData', true);
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', data);
    this.modalStore.onRedirectPage(`/${this.currentView}/new`);
  };

  onShowDataList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.companyApi.onGetDataList();
      this.baseRegisterStore.onSetSlicePropsToNewValue('initialData', response.data);
      this.baseRegisterStore.onSetSlicePropsToNewValue('dataList', response.data);
      this.baseRegisterStore.onClearData(response.data);
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
      const response = await this.companyApi.onDelete(id);
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

  async onDelete(data: ICompany): Promise<void> {
    await this.onDeleteRegister(data.idCompany);
  }

  onShowModalToDelete(data?: ICompany): void {
    const selectedData = data ? data : (this.baseRegisterStore.itemSelected() as ICompany) || '';
    this.modalStore.onShowAskModal(
      'Cadastro de empresas',
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }
}
