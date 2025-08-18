import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { SelectComponent } from '@components/select/select.component';
import { CompanyApi } from '@core/http/company/company.api';
import { IAddress } from '@core/interfaces/address.interface';
import { ICompany } from '@core/interfaces/company.interface';
import { IEmployee } from '@core/interfaces/employee.interface';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { AddressStore } from '@store/address/address.store';
import { BaseRegisterStore } from '@store/base/base.register.store';
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
  ],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss',
})
export class CompanyFormComponent implements OnInit, OnDestroy {
  readonly companyApi = inject(CompanyApi);
  readonly addressStore = inject(AddressStore);
  readonly employeeStore = inject(EmployeeStore);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);

  subscription: Subscription | undefined = undefined;
  idCompany = 0;

  companyData = {
    idCompany: 0,
    nickname: '',
    name: '',
    cnpj: '',
    ie: '',
    im: '',
  } as ICompany;

  companyName = this.companyData.name;

  ngOnInit(): void {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.idCompany = Number(params.get('id')) || 0;
    });
    this.addressStore.onGetAddressInfo(Number(this.idCompany));
    this.employeeStore.onGetEmployeeInfo(Number(this.idCompany));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  formTitle = computed(() => {
    if (this.idCompany == 0) {
      return 'Nova Empresa';
    } else {
      return this.companyName;
    }
  });

  onBackToCompaniesPage = (): void => {
    this.addressStore.onClearData();
    this.employeeStore.onClearData();
    this.modalStore.onRedirectPage('/companies');
  };

  finalData = {
    company: {
      idCompany: 0,
      nickname: '',
      name: '',
      cnpj: '',
      ie: '',
      im: '',
    } as ICompany,
    address: {
      idAddress: 0,
      postalCode: '',
      address: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
    } as IAddress,
    employee: {
      idEmployee: 0,
      name: '',
      cpf: '',
      department: '',
      position: '',
      email: '',
      deskphone: '',
      cellphone: '',
      photoUrl: '',
    } as IEmployee,
  };

  onSetFinalData = (): void => {
    const company = this.baseRegisterStore.data() as ICompany;
    this.finalData.company.idCompany = company.idCompany;
    this.finalData.company.nickname = company.nickname;
    this.finalData.company.name = company.name;
    this.finalData.company.cnpj = this.baseRegisterStore.onMaskNumericalField(company?.cnpj || '');
    this.finalData.company.ie = this.baseRegisterStore.onMaskNumericalField(company.ie || '');
    this.finalData.company.im = this.baseRegisterStore.onMaskNumericalField(company.im || '');
    this.finalData.address.idAddress = this.addressStore.addressData().idAddress;
    this.finalData.address.postalCode = this.baseRegisterStore.onMaskNumericalField(
      this.addressStore.addressData().postalCode
    );
    this.finalData.address.address = this.addressStore.addressData().address;
    this.finalData.address.number = this.addressStore.addressData().number;
    this.finalData.address.complement = this.addressStore.addressData().complement;
    this.finalData.address.district = this.addressStore.addressData().district;
    this.finalData.address.city = this.addressStore.addressData().city;
    this.finalData.address.state = this.addressStore.addressData().state;
    this.finalData.employee.isDefault = this.employeeStore.employeeData().isDefault;
    this.finalData.employee.idEmployee = this.employeeStore.employeeData().idEmployee;
    this.finalData.employee.name = this.employeeStore.employeeData().name;
    this.finalData.employee.department = this.employeeStore.employeeData().department;
    this.finalData.employee.position = this.employeeStore.employeeData().position;
    this.finalData.employee.photoUrl = this.employeeStore.employeeData().photoUrl;
    this.finalData.employee.email = this.employeeStore.employeeData().email;
    this.finalData.employee.deskphone = this.baseRegisterStore.onMaskNumericalField(
      this.employeeStore.employeeData().deskphone || ''
    );
    this.finalData.employee.cellphone = this.baseRegisterStore.onMaskNumericalField(
      this.employeeStore.employeeData().cellphone || ''
    );
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      this.onSetFinalData();
      const response = await this.companyApi.saveCompany(this.finalData);
      if (response.status) {
        this.modalStore.onSetModalInfoType('success');
        this.modalStore.onShowInfoModal('Cadastro de empresa', response.message, onActionOk);
      } else {
        this.modalStore.onShowInfoModal('Cadastro de empresa', response.error?.message || '');
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Cadastro de empresa', error.error.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };
}
