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

  companyDetailedData = {
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

  companyName = this.companyDetailedData.company.name;

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
      const companyDetail = await this.companyApi.getCompanyCompleteInfo(this.idCompany);
      console.log('companyDetail', companyDetail);
      this.companyDetailedData = companyDetail.data;
      console.log('this.companyDetailedData', this.companyDetailedData);
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
      this.companyDetailedData.address.postalCode
    );
    if (response) {
      this.companyDetailedData.address.address = response.logradouro;
      this.companyDetailedData.address.complement = response.complemento;
      this.companyDetailedData.address.district = response.bairro;
      this.companyDetailedData.address.city = response.localidade;
      this.companyDetailedData.address.state = response.uf;
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
    this.finalData.company.idCompany = this.companyDetailedData.company.idCompany;
    this.finalData.company.nickname = this.companyDetailedData.company.nickname.trim();
    this.finalData.company.name = this.companyDetailedData.company.name.trim();
    this.finalData.company.cnpj = this.baseRegisterStore.onMaskNumericalField(
      (this.companyDetailedData.company?.cnpj || '').trim()
    );
    this.finalData.company.ie = this.baseRegisterStore.onMaskNumericalField(
      (this.companyDetailedData.company.ie || '').trim()
    );
    this.finalData.company.im = this.baseRegisterStore.onMaskNumericalField(
      (this.companyDetailedData.company.im || '').trim()
    );
    this.finalData.address.idAddress = this.companyDetailedData.address.idAddress;
    this.finalData.address.postalCode = this.baseRegisterStore.onMaskNumericalField(
      this.companyDetailedData.address.postalCode.trim()
    );
    this.finalData.address.address = this.companyDetailedData.address.address.trim();
    this.finalData.address.number = this.companyDetailedData.address.number?.trim();
    this.finalData.address.complement = this.companyDetailedData.address.complement?.trim();
    this.finalData.address.district = this.companyDetailedData.address.district?.trim();
    this.finalData.address.city = this.companyDetailedData.address.city?.trim();
    this.finalData.address.state = this.companyDetailedData.address.state?.trim();
    this.finalData.employee.isDefault = this.companyDetailedData.employee.isDefault;
    this.finalData.employee.idEmployee = this.companyDetailedData.employee.idEmployee;
    this.finalData.employee.name = this.companyDetailedData.employee.name?.trim();
    this.finalData.employee.department = this.companyDetailedData.employee.department?.trim();
    this.finalData.employee.position = this.companyDetailedData.employee.position?.trim();
    this.finalData.employee.photoUrl = this.companyDetailedData.employee.photoUrl?.trim();
    this.finalData.employee.email = this.companyDetailedData.employee.email?.trim();
    this.finalData.employee.deskphone = this.baseRegisterStore.onMaskNumericalField(
      (this.companyDetailedData.employee.deskphone || '')?.trim()
    );
    this.finalData.employee.cellphone = this.baseRegisterStore.onMaskNumericalField(
      (this.companyDetailedData.employee.cellphone || '')?.trim()
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
