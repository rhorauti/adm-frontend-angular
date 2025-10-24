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
import { ICompanyForm } from '@core/interfaces/company.interface';
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

  companyForm = {
    company: {
      idCompany: null,
      nickname: '',
      name: '',
      cnpj: '',
      ie: '',
      im: '',
    },
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
    employee: {
      idEmployee: 0,
      isDefault: false,
      name: '',
      email: '',
      deskphone: '',
      cellphone: '',
      departmentList: [],
      department: {
        idDepartment: 0,
        name: '',
      },
      employeePositionList: [],
      employeePosition: {
        idEmployeePosition: 0,
        name: '',
      },
    },
  } as ICompanyForm;

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
    if (this.router.url.includes('edit') && (this.idCompany || 0) > 0) {
      const company = await this.companyApi.onGetDataDetailedInfo(this.idCompany || 0);
      this.companyForm = company.data as ICompanyForm;
    } else if (this.router.url.includes('new') && (this.idCompany || 0) > 0) {
      const company = await this.companyApi.onGetDataDetailedInfo(this.idCompany || 0);
      this.companyForm = company.data as ICompanyForm;
      this.companyForm.company.idCompany = null;
      this.companyForm.address.idAddress = null;
      this.companyForm.employee.idEmployee = null;
    }
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  defineTitle = (): string => {
    if (this.idCompany == 0) {
      return 'Novo Registro';
    } else {
      return this.companyForm.company.name;
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

  setDepartmentValue = (deptName: string): void => {
    const dept = (this.companyForm.employee.departmentList || []).find(
      dept => dept.name == deptName
    ) as IDepartment;
    if (dept) {
      this.companyForm.employee.department = dept;
    } else {
      this.companyForm.employee.department = {
        idDepartment: null,
        name: '',
      };
    }
  };

  setEmployeePositionValue = (positionName: string): void => {
    const position = (this.companyForm.employee.employeePositionList || []).find(
      position => position.name == positionName
    ) as IEmployeePosition;
    if (position) {
      this.companyForm.employee.employeePosition = position;
    } else {
      this.companyForm.employee.employeePosition = {
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
    company: {
      idCompany: null,
      nickname: '',
      name: '',
      cnpj: '',
      ie: '',
      im: '',
    },
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
    employee: {
      idEmployee: 0,
      isDefault: false,
      name: '',
      email: '',
      deskphone: '',
      cellphone: '',
      departmentList: [],
      department: {
        idDepartment: 0,
        name: '',
      },
      employeePositionList: [],
      employeePosition: {
        idEmployeePosition: 0,
        name: '',
      },
    },
  };

  onSetFinalData = (): void => {
    this.finalData.company.idCompany = this.companyForm.company.idCompany;
    this.finalData.company.nickname = (this.companyForm.company.nickname ?? '').trim();
    this.finalData.company.name = (this.companyForm.company.name ?? '').trim();
    this.finalData.company.cnpj = onRemoveMask((this.companyForm.company?.cnpj ?? '').trim());
    this.finalData.company.ie = onRemoveMask((this.companyForm.company.ie ?? '').trim());
    this.finalData.company.im = onRemoveMask((this.companyForm.company.im ?? '').trim());
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
    this.finalData.employee.idEmployee = this.companyForm.employee.idEmployee;
    this.finalData.employee.isDefault = this.companyForm.employee.isDefault;
    this.finalData.employee.name = (this.companyForm.employee.name ?? '').trim();
    this.finalData.employee.department = this.companyForm.employee.department;
    this.finalData.employee.employeePosition = this.companyForm.employee.employeePosition;
    this.finalData.employee.email = (this.companyForm.employee.email ?? '').trim();
    this.finalData.employee.deskphone = onRemoveMask(
      (this.companyForm.employee.deskphone ?? '')?.trim()
    );
    this.finalData.employee.cellphone = onRemoveMask(
      (this.companyForm.employee.cellphone ?? '')?.trim()
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
