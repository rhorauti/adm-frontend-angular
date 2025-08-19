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
import { ThirdPartApi } from '@core/http/third-part/third-part.api';
import { IAddress } from '@core/interfaces/address.interface';
import { ICompany, ICompanyRequest as ICompanyDetails } from '@core/interfaces/company.interface';
import { IEmployee } from '@core/interfaces/employee.interface';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { BaseRegisterStore } from '@store/base/base.register.store';
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
  readonly baseRegisterStore = inject(BaseRegisterStore);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);
  readonly thirdPartApi = inject(ThirdPartApi);

  subscription: Subscription | undefined = undefined;
  idCompany = 0;

  companyDataRequest = {
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
  } as ICompanyDetails;

  companyName = this.companyDataRequest.company.name;

  ngOnInit(): void {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.idCompany = Number(params.get('id')) || 0;
    });
    if (this.idCompany != 0) {
      this.onGetCompanyDetails();
    }
  }

  onGetCompanyDetails = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      await this.companyApi.getCompanyCompleteInfo(this.idCompany);
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Cadastro de empresa', error.error.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  formTitle = computed(() => {
    if (this.idCompany == 0) {
      return 'Nova Empresa';
    } else {
      return this.companyName;
    }
  });

  onBackToCompaniesPage = (): void => {
    this.modalStore.onRedirectPage('/companies');
  };

  onSetAddressViaCEPValues = async (): Promise<void> => {
    const response = await this.thirdPartApi.getAddressFromCep(
      this.companyDataRequest.address.postalCode
    );
    if (response) {
      this.companyDataRequest.address.address = response.logradouro;
      this.companyDataRequest.address.complement = response.complemento;
      this.companyDataRequest.address.district = response.bairro;
      this.companyDataRequest.address.city = response.localidade;
      this.companyDataRequest.address.state = response.uf;
    } else {
      return;
    }
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
    this.finalData.company.idCompany = this.companyDataRequest.company.idCompany;
    this.finalData.company.nickname = this.companyDataRequest.company.nickname;
    this.finalData.company.name = this.companyDataRequest.company.name;
    this.finalData.company.cnpj = this.baseRegisterStore.onMaskNumericalField(
      this.companyDataRequest.company?.cnpj || ''
    );
    this.finalData.company.ie = this.baseRegisterStore.onMaskNumericalField(
      this.companyDataRequest.company.ie || ''
    );
    this.finalData.company.im = this.baseRegisterStore.onMaskNumericalField(
      this.companyDataRequest.company.im || ''
    );
    this.finalData.address.idAddress = this.companyDataRequest.address.idAddress;
    this.finalData.address.postalCode = this.baseRegisterStore.onMaskNumericalField(
      this.companyDataRequest.address.postalCode
    );
    this.finalData.address.address = this.companyDataRequest.address.address;
    this.finalData.address.number = this.companyDataRequest.address.number;
    this.finalData.address.complement = this.companyDataRequest.address.complement;
    this.finalData.address.district = this.companyDataRequest.address.district;
    this.finalData.address.city = this.companyDataRequest.address.city;
    this.finalData.address.state = this.companyDataRequest.address.state;
    this.finalData.employee.isDefault = this.companyDataRequest.employee.isDefault;
    this.finalData.employee.idEmployee = this.companyDataRequest.employee.idEmployee;
    this.finalData.employee.name = this.companyDataRequest.employee.name;
    this.finalData.employee.department = this.companyDataRequest.employee.department;
    this.finalData.employee.position = this.companyDataRequest.employee.position;
    this.finalData.employee.photoUrl = this.companyDataRequest.employee.photoUrl;
    this.finalData.employee.email = this.companyDataRequest.employee.email;
    this.finalData.employee.deskphone = this.baseRegisterStore.onMaskNumericalField(
      this.companyDataRequest.employee.deskphone || ''
    );
    this.finalData.employee.cellphone = this.baseRegisterStore.onMaskNumericalField(
      this.companyDataRequest.employee.cellphone || ''
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

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
