import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCompanyComponent } from '@components/table/table-company/table-company.component';
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
import { BaseRegisterStore } from '@store/base/base.register.store';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { CompanyApi } from '@core/http/company/company.api';

@Component({
  selector: 'app-company-home',
  imports: [
    CommonModule,
    TableHeaderBoxComponent,
    InputComponent,
    TableCompanyComponent,
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

  tableHeadersLocalStorageId = 'table_headers_company' + this.authStore.user().id;

  async ngOnInit() {
    this.onShowDataList();
    const tableHeaders = loadStorage(this.tableHeadersLocalStorageId);
    if (tableHeaders) {
      this.baseRegisterStore.onSetSlicePropsToNewValue('tableHeaders', tableHeaders);
    }
  }

  onRedirectToEditPage = (companyData: ICompany): void => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', companyData);
    this.modalStore.onRedirectPage(
      `/companies/edit/${(this.baseRegisterStore.data() as ICompany).idCompany}`
    );
  };

  onCloneRegister = async (companyData: ICompany): Promise<void> => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', companyData);
    // await this.addressStore.onGetAddressInfo(companyData.idCompany);
    // await this.employeeStore.onGetEmployeeInfo(companyData.idCompany);
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', { idCompany: 0 });
    // this.addressStore.onSetSlicePropsToNewValue('addressData', { idAddress: 0 });
    // this.employeeStore.onSetFormInputNewValue('idEmployee', 0);
    this.modalStore.onRedirectPage('/companies/new');
  };

  onShowDataList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.companyApi.getCompaniesList();
      this.baseRegisterStore.onSetSlicePropsToNewValue('initialData', response.data);
      this.baseRegisterStore.onSetSlicePropsToNewValue('dataList', response.data);
      this.baseRegisterStore.onClearData(response.data);
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Listar empresas', error.error?.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  onDeleteRegister = async (idCompany: number, onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.companyApi.deleteCompany(idCompany);
      if (response.status) {
        this.onShowDataList();
        this.modalStore.onSetModalInfoType('success');
        this.modalStore.onShowInfoModal('Excluir empresa', response.message, onActionOk);
      } else {
        this.modalStore.onShowInfoModal('Excluir empresa', response.error?.message || '');
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Excluir empresa', error.error.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  async onDeleteCompany(): Promise<void> {
    const itemToDelete = this.baseRegisterStore.itemSelected() as ICompany;
    await this.onDeleteRegister(itemToDelete?.idCompany);
  }

  onShowModalToDelete(): void {
    this.modalStore.onShowAskModal(
      'Cadastro de empresas',
      `Deseja excluir o registro <b>${(this.baseRegisterStore.itemSelected() as ICompany)?.name || ''}</b>?`,
      () => this.onDeleteCompany()
    );
  }
}
