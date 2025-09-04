import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { SelectComponent } from '@components/select/select.component';
import { CompanyApi } from '@core/http/company/company.api';
import { ThirdPartApi } from '@core/http/third-part/third-part.api';
import { IAddress } from '@core/interfaces/address.interface';
import { ICompany, ICompanyDetail as ICompanyDetails } from '@core/interfaces/company.interface';
import { IDepartment } from '@core/interfaces/department.interface';
import {
  IEmployee,
  IEmployeePayload,
  IEmployeePosition,
} from '@core/interfaces/employee.interface';
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
export class CompanyFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
  readonly companyApi = inject(CompanyApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);
  readonly thirdPartApi = inject(ThirdPartApi);

  private cdr = inject(ChangeDetectorRef);

  currentView = 'companies';
  currentViewTranslated = 'Empresas'.slice(0, -1);
  subscription: Subscription | undefined = undefined;
  breadcrumbList: string[] = [];
  id = 0;

  departmentList: IDepartment[] = [];
  departmentOptionList: string[] = [];
  employeePositionList: IEmployeePosition[] = [];
  employeePositionOptionList: string[] = [];

  departmentData = {
    idDepartment: 0,
    name: '',
    comment: '',
  } as IDepartment;

  employeePositionData = {
    idEmployeePosition: 0,
    name: '',
    comment: '',
  } as IEmployeePosition;

  detailedData = {
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
      isDefault: false,
      name: '',
      cpf: '',
      idDepartment: 0,
      email: '',
      deskphone: '',
      cellphone: '',
      photoUrl: '',
      idCompany: 0,
    } as IEmployee,
  } as ICompanyDetails;

  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.id = Number(params.get('id')) || 0;
    });
    if (this.id != 0) {
      await this.onGetDataDetails();
    } else {
      if (this.baseRegisterStore.isCopiedData()) {
        this.id = (this.baseRegisterStore.data() as ICompany).idCompany;
        await this.onGetDataDetails();
        this.id = 0;
        this.detailedData.company.idCompany = 0;
        this.baseRegisterStore.onSetSlicePropsToNewValue('isCopiedData', false);
      }
    }
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  defineTitle = (): string => {
    if (this.id == 0) {
      return 'Novo Registro';
    } else {
      return this.detailedData.company.name;
    }
  };

  ngAfterViewInit(): void {
    this.onDefineInputId();
    this.cdr.detectChanges();
  }

  onDefineInputId = () => {
    this.inputs.forEach((input, index) => {
      input.id = `${this.currentView}-form-${index}`;
      this.labels.get(index)?.nativeElement.setAttribute('for', input.id);
    });
  };

  onGetDataDetails = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const detaildDataResponse = await this.companyApi.onGetDataDetailedInfo(this.id);
      if (detaildDataResponse.data) {
        this.detailedData = detaildDataResponse.data;
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal(
        `Cadastro de ${this.currentViewTranslated}`,
        error.error.message
      );
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  setDepartmentValue = (deptName: string): void => {
    const dept = this.departmentList.find(dept => (dept.name = deptName)) as IDepartment;
    this.departmentData = dept;
  };

  setEmployeePositionValue = (positionName: string): void => {
    const position = this.employeePositionList.find(
      position => (position.name = positionName)
    ) as IEmployeePosition;
    this.employeePositionData = position;
  };

  onBackToPreviousPage = (): void => {
    this.modalStore.onRedirectPage(`/${this.currentView}`);
  };

  onSetAddressViaCEPValues = async (): Promise<void> => {
    const response = await this.thirdPartApi.getAddressFromCep(
      this.detailedData.address.postalCode
    );
    if (response) {
      this.detailedData.address.address = response.logradouro;
      this.detailedData.address.complement = response.complemento;
      this.detailedData.address.district = response.bairro;
      this.detailedData.address.city = response.localidade;
      this.detailedData.address.state = response.uf;
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
      isDefault: false,
      name: '',
      cpf: '',
      idDepartment: 0,
      email: '',
      deskphone: '',
      cellphone: '',
      imgPreviewUrl: null,
      employeePosition: {
        idEmployeePosition: 0,
        name: '',
        comment: '',
      } as IEmployeePosition,
    } as IEmployeePayload,
  } as ICompanyDetails;

  onSetFinalData = (): void => {
    this.finalData.company.idCompany = this.detailedData.company.idCompany;
    this.finalData.company.nickname = (this.detailedData.company.nickname ?? '').trim();
    this.finalData.company.name = (this.detailedData.company.name ?? '').trim();
    this.finalData.company.cnpj = this.baseRegisterStore.onMaskNumericalField(
      (this.detailedData.company?.cnpj ?? '').trim()
    );
    this.finalData.company.ie = this.baseRegisterStore.onMaskNumericalField(
      (this.detailedData.company.ie ?? '').trim()
    );
    this.finalData.company.im = this.baseRegisterStore.onMaskNumericalField(
      (this.detailedData.company.im ?? '').trim()
    );
    this.finalData.address.idAddress = this.detailedData.address.idAddress;
    this.finalData.address.postalCode = this.baseRegisterStore.onMaskNumericalField(
      (this.detailedData.address.postalCode ?? '').trim()
    );
    this.finalData.address.address = (this.detailedData.address.address ?? '').trim();
    this.finalData.address.number = (this.detailedData.address.number ?? '').trim();
    this.finalData.address.complement = (this.detailedData.address.complement ?? '').trim();
    this.finalData.address.district = (this.detailedData.address.district ?? '').trim();
    this.finalData.address.city = (this.detailedData.address.city ?? '').trim();
    this.finalData.address.state = (this.detailedData.address.state ?? '').trim();
    this.finalData.employee.isDefault = this.detailedData.employee.isDefault;
    this.finalData.employee.idEmployee = (this.detailedData.employee ?? '').idEmployee;
    this.finalData.employee.name = (this.detailedData.employee.name ?? '').trim();
    this.finalData.employee.idDepartment = this.detailedData.employee.idDepartment ?? 0;
    this.finalData.employee.idCompany = this.detailedData.employee.idCompany ?? 0;
    this.finalData.employee.employeePosition = this.employeePositionData;
    // this.finalData.employee.imgPreviewUrl = this.imgPreviewUrl;
    this.finalData.employee.email = (this.detailedData.employee.email ?? '').trim();
    this.finalData.employee.deskphone = this.baseRegisterStore.onMaskNumericalField(
      (this.detailedData.employee.deskphone ?? '')?.trim()
    );
    this.finalData.employee.cellphone = this.baseRegisterStore.onMaskNumericalField(
      (this.detailedData.employee.cellphone ?? '')?.trim()
    );
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      this.onSetFinalData();
      const response = await this.companyApi.onSave(this.finalData);
      if (response.status) {
        this.modalStore.onSetModalInfoType('success');
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslated}`,
          response.message,
          onActionOk
        );
      } else {
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslated}`,
          response.error?.message || ''
        );
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal(
        `Cadastro de ${this.currentViewTranslated}`,
        error.error.message
      );
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
