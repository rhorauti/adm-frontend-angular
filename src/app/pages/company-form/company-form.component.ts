import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { SelectComponent } from '@components/select/select.component';
import { AddressApi } from '@core/http/address/address.api';
import { EmployeeApi } from '@core/http/employee/employee.api';
import { AddressStore } from '@store/address/address.store';
import { CompanyStore } from '@store/company/company.store';
import { EmployeeStore } from '@store/employee/employee.store';
import { ModalStore } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-form',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    ButtonLabelComponent,
    FormsModule,
    InputComponent,
    SelectComponent,
    ModalInfoComponent,
  ],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss',
})
export class CompanyFormComponent implements OnInit, OnDestroy {
  readonly companyStore = inject(CompanyStore);
  readonly addressStore = inject(AddressStore);
  readonly employeeStore = inject(EmployeeStore);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);
  private addressApi = inject(AddressApi);
  private employeeApi = inject(EmployeeApi);

  subscription: Subscription | undefined = undefined;
  idCompany = '';

  ngOnInit(): void {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.idCompany = params.get('id') || '';
    });
    this.onGetAddressInfo(Number(this.idCompany));
    this.onGetEmployeeInfo(Number(this.idCompany));
  }

  async onGetAddressInfo(idCompany: number): Promise<void> {
    try {
      const address = await this.addressApi.onGetCompanyAddress(idCompany);
      if (address.data) {
        this.addressStore.onSetAddressValue(address.data);
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      console.log('Erro ao trazer as informações de endereço' + error.message);
      this.modalStore.onShowInfoModal(
        'Formulário de cadastro',
        'Erro ao trazer as informações de endereço.'
      );
    }
  }

  async onGetEmployeeInfo(idCompany: number): Promise<void> {
    try {
      const employee = await this.employeeApi.onGetCompanyEmployee(idCompany);
      if (employee.data) {
        this.employeeStore.onSetEmployeeValue(employee.data);
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      console.log('Erro ao trazer as informações de contato' + error.message);
      this.modalStore.onShowInfoModal(
        'Formulário de cadastro',
        'Erro ao trazer as informações do contato.'
      );
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  formTitle = computed(() => {
    if (this.companyStore.tab().selectedTabIdx == 0) {
      return 'Novo Cliente';
    } else if (this.companyStore.tab().selectedTabIdx == 1) {
      return 'Novo Fornecedor';
    } else {
      return 'MyCompany';
    }
  });

  onCloseCompanyFormInfoModal(): void {
    this.modalStore.onCloseInfoModal(() => {
      this.addressStore.onClearData();
      this.employeeStore.onClearData();
      this.companyStore.onShowDataList();
      this.modalStore.onRedirectPage('/companies');
    });
  }

  onBackToCompaniesPage(): void {
    this.addressStore.onClearData();
    this.employeeStore.onClearData();
    this.companyStore.onClearData();
    this.modalStore.onRedirectPage('/companies');
  }
}
