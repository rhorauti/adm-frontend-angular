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
  signal,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { SelectComponent } from '@components/select/select.component';
import { CompanyApi } from '@core/http/company/company.api';
import { DepartmentApi } from '@core/http/department/department.api';
import { EmployeePositionApi } from '@core/http/employee/employee-position.api';
import { ThirdPartApi } from '@core/http/third-part/third-part.api';
import { ICompanyForm, IResponseCompanyForm } from '@core/interfaces/company.interface';
import { IDepartment } from '@core/interfaces/department.interface';
import { IEmployeePosition } from '@core/interfaces/employee.interface';
import { ActionCallback, IModalInfo } from '@core/interfaces/modal.interface';
import { onRemoveMask } from '@core/utils/misc';
import { ModalType } from '@store/modal/modal.store';
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
    LoadingComponent,
  ],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss',
})
export class CompanyFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
  readonly companyApi = inject(CompanyApi);
  readonly departmentApi = inject(DepartmentApi);
  readonly employeePositionApi = inject(EmployeePositionApi);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly thirdPartApi = inject(ThirdPartApi);

  private cdr = inject(ChangeDetectorRef);

  currentView = 'companies';
  currentViewTranslated = 'Empresas'.slice(0, -1);
  subscription: Subscription | undefined = undefined;
  breadcrumbList: string[] = [];
  idCompany: number | null = null;

  departmentOptionList: string[] = [];
  employeePositionOptionList: string[] = [];

  companyForm: ICompanyForm = {
    idCompany: null,
    nickname: '',
    name: '',
    cnpj: '',
    ie: '',
    im: '',
    address: {
      idAddress: null,
      postalCode: '',
      address: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
    },
    employee: [
      {
        idEmployee: 0,
        isDefault: false,
        name: '',
        email: '',
        deskphone: '',
        cellphone: '',
        department: {
          idDepartment: 0,
          name: '',
        },
        employeePosition: {
          idEmployeePosition: 0,
          name: '',
        },
      },
    ],
    departmentList: [],
    employeePositionList: [],
  };

  modalInfo = signal<IModalInfo>({
    isActive: false,
    title: '',
    description: '',
    type: '',
    onActionOk: null,
  });

  isLoading = signal(false);

  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.idCompany = Number(params.get('id')) || 0;
    });
    let company: IResponseCompanyForm;
    if (this.router.url.includes('edit') && (this.idCompany || 0) > 0) {
      company = await this.companyApi.onGetData(this.idCompany || 0);
      this.companyForm = company.data as ICompanyForm;
    } else if (this.router.url.includes('new') && (this.idCompany || 0) > 0) {
      company = await this.companyApi.onGetData(this.idCompany || 0);
      this.companyForm = company.data as ICompanyForm;
      this.companyForm.idCompany = null;
      this.companyForm.address.idAddress = null;
      this.companyForm.employee[0].idEmployee = null;
    } else {
      company = await this.companyApi.onGetData(0);
      this.companyForm = company.data as ICompanyForm;
    }
    this.onSetSelectionOptionList();
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  defineTitle = (): string => {
    if (this.idCompany == 0) {
      return 'Novo Registro';
    } else {
      return this.companyForm.name;
    }
  };

  ngAfterViewInit(): void {
    this.onDefineInputId();
    this.cdr.detectChanges();
  }

  onSetSelectionOptionList = (): void => {
    if (this.companyForm.departmentList) {
      this.departmentOptionList = this.companyForm.departmentList?.map(dept => dept.name);
    }
    if (this.companyForm.employeePositionList) {
      this.employeePositionOptionList = this.companyForm.employeePositionList.map(ep => ep.name);
    }
  };

  onDefineInputId = () => {
    this.inputs.forEach((input, index) => {
      input.id = `${this.currentView}-form-${index}`;
      this.labels.get(index)?.nativeElement.setAttribute('for', input.id);
    });
  };

  setDepartmentValue = (deptName: string): void => {
    const dept = (this.companyForm.departmentList || []).find(
      dept => dept.name == deptName
    ) as IDepartment;
    if (dept) {
      this.companyForm.employee[0].department = dept;
    } else {
      this.companyForm.employee[0].department = {
        idDepartment: null,
        name: '',
      };
    }
  };

  setEmployeePositionValue = (positionName: string): void => {
    const position = (this.companyForm.employeePositionList || []).find(
      position => position.name == positionName
    ) as IEmployeePosition;
    if (position) {
      this.companyForm.employee[0].employeePosition = position;
    } else {
      this.companyForm.employee[0].employeePosition = {
        idEmployeePosition: null,
        name: '',
      };
    }
  };

  onBackToPreviousPage = (): void => {
    this.router.navigate([`/${this.currentView}`]);
  };

  onSetAddressViaCEPValues = async (): Promise<void> => {
    const response = await this.thirdPartApi.getAddressFromCep(this.companyForm.address.postalCode);
    if (response) {
      this.companyForm.address.address = response.logradouro;
      this.companyForm.address.complement = response.complemento;
      this.companyForm.address.district = response.bairro;
      this.companyForm.address.city = response.localidade;
      this.companyForm.address.state = response.uf;
    } else {
      return;
    }
  };

  finalData: ICompanyForm = {
    idCompany: null,
    nickname: '',
    name: '',
    cnpj: '',
    ie: '',
    im: '',
    address: {
      idAddress: null,
      postalCode: '',
      address: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
    },
    employee: [
      {
        idEmployee: 0,
        isDefault: false,
        name: '',
        email: '',
        deskphone: '',
        cellphone: '',
        department: {
          idDepartment: 0,
          name: '',
        },
        employeePosition: {
          idEmployeePosition: 0,
          name: '',
        },
      },
    ],
  };

  onSetFinalData = (): void => {
    this.finalData.idCompany = this.companyForm.idCompany;
    this.finalData.nickname = (this.companyForm.nickname ?? '').trim();
    this.finalData.name = (this.companyForm.name ?? '').trim();
    this.finalData.cnpj = onRemoveMask((this.companyForm.cnpj ?? '').trim());
    this.finalData.ie = onRemoveMask((this.companyForm.ie ?? '').trim());
    this.finalData.im = onRemoveMask((this.companyForm.im ?? '').trim());
    this.finalData.address.idAddress = this.companyForm.address.idAddress;
    this.finalData.address.postalCode = onRemoveMask(
      (this.companyForm.address.postalCode ?? '').trim()
    );
    this.finalData.address.address = (this.companyForm.address.address ?? '').trim();
    this.finalData.address.number = (this.companyForm.address.number ?? '').trim();
    this.finalData.address.complement = (this.companyForm.address.complement ?? '').trim();
    this.finalData.address.district = (this.companyForm.address.district ?? '').trim();
    this.finalData.address.city = (this.companyForm.address.city ?? '').trim();
    this.finalData.address.state = (this.companyForm.address.state ?? '').trim();
    this.finalData.employee[0].idEmployee = this.companyForm.employee[0].idEmployee;
    this.finalData.employee[0].isDefault = this.companyForm.employee[0].isDefault;
    this.finalData.employee[0].name = (this.companyForm.employee[0].name ?? '').trim();
    this.finalData.employee[0].department = this.companyForm.employee[0].department;
    this.finalData.employee[0].employeePosition = this.companyForm.employee[0].employeePosition;
    this.finalData.employee[0].email = (this.companyForm.employee[0].email ?? '').trim();
    this.finalData.employee[0].deskphone = onRemoveMask(
      (this.companyForm.employee[0].deskphone ?? '')?.trim()
    );
    this.finalData.employee[0].cellphone = onRemoveMask(
      (this.companyForm.employee[0].cellphone ?? '')?.trim()
    );
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.isLoading.set(true);
      this.onSetFinalData();
      const response = await this.companyApi.onSave(this.finalData);
      if (response.status) {
        this.onShowInfoModal(
          'success',
          `Cadastro de ${this.currentViewTranslated}`,
          response.message,
          onActionOk
        );
      } else {
        this.onShowInfoModal(
          'failure',
          `Cadastro de ${this.currentViewTranslated}`,
          response.error?.message || ''
        );
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.onShowInfoModal(
        'failure',
        `Cadastro de ${this.currentViewTranslated}`,
        error.error?.message || 'Erro desconhecido'
      );
    } finally {
      this.isLoading.set(false);
    }
  };

  onShowInfoModal = (
    type: ModalType,
    title: string,
    description: string,
    onActionOk?: ActionCallback
  ): void => {
    this.modalInfo.set({
      ...this.modalInfo,
      isActive: true,
      type: type,
      title: title,
      description: description,
      onActionOk: onActionOk,
    });
  };

  onCloseInfoModal = async (): Promise<void> => {
    const callback = this.modalInfo().onActionOk;
    if (callback) await Promise.resolve(callback());
    this.modalInfo.set({
      isActive: false,
      type: '',
      title: '',
      description: '',
      onActionOk: null,
    });
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
