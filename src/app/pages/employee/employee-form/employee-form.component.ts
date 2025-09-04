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
import { DepartmentApi } from '@core/http/department/department.api';
import { EmployeePositionApi } from '@core/http/employee/employee-position.api';
import { EmployeeApi } from '@core/http/employee/employee.api';
import { IDepartment } from '@core/interfaces/department.interface';
import {
  IEmployee,
  IEmployeePayload,
  IEmployeePosition,
} from '@core/interfaces/employee.interface';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { BaseApiName } from '@core/types/base.type';
import { BaseRegisterStore } from '@store/base/base.register.store';
import { ModalStore } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';
import { ProfilePhotoComponent } from '@components/profile-photo/profile-photo.component';

@Component({
  selector: 'app-employee-form',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    ButtonLabelComponent,
    FormsModule,
    InputComponent,
    SelectComponent,
    ProfilePhotoComponent,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
  readonly employeeApi = inject(EmployeeApi);
  readonly departmentApi = inject(DepartmentApi);
  readonly employeePositionApi = inject(EmployeePositionApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);

  private cdr = inject(ChangeDetectorRef);

  currentView: BaseApiName = 'employees';
  currentViewTranslated = 'Funcionários'.slice(0, -1);
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

  imgPreviewUrl: File | null = null;

  employeeData = {
    idEmployee: 0,
    isDefault: false,
    name: '',
    email: '',
    photoUrl: '',
    cellphone: '',
    deskphone: '',
    cpf: '',
    idCompany: 0,
  } as IEmployee;

  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.id = Number(params.get('id')) || 0;
    });
    this.onGetDepartmentList();
    this.onGetEmployeePositionList();
    if (this.baseRegisterStore.isEditData()) {
      this.employeeData = this.baseRegisterStore.data() as IEmployee;
      this.baseRegisterStore.onSetSlicePropsToNewValue('isEditData', false);
    } else if (this.baseRegisterStore.isCopiedData()) {
      this.employeeData = this.baseRegisterStore.data() as IEmployee;
      this.id = 0;
      this.employeeData.idEmployee = 0;
      this.baseRegisterStore.onSetSlicePropsToNewValue('isCopiedData', false);
    }
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  onGetDepartmentList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.departmentApi.onGetDataList();
      if (response.data) {
        const data = response.data as IDepartment[];
        this.departmentList = data;
        this.departmentOptionList = data.map(dept => dept.name);
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Listar departamentos: ', error.error?.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  onGetEmployeePositionList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.employeePositionApi.onGetDataList();
      if (response.data) {
        const data = response.data as IEmployeePosition[];
        this.employeePositionList = data;
        this.employeePositionOptionList = data.map(position => position.name);
        this.employeePositionOptionList.unshift('Sem registro');
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Listar cargos: ', error.error?.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  defineTitle = (): string => {
    if (this.id == 0) {
      return 'Novo Registro';
    } else {
      return this.employeeData.name;
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

  fieldValidation = (): void => {
    let message = '';
    if (this.employeeData && this.employeeData.name.length == 0) {
      message = 'O campo Nome do Cargo não pode estar vazio.';
    }
    throw Error(message);
  };

  finalData = {
    idEmployee: 0,
    isDefault: false,
    name: '',
    email: '',
    imgPreviewUrl: null,
    cellphone: '',
    deskphone: '',
    cpf: '',
    idCompany: 0,
    idDepartment: 0,
    employeePosition: {},
  } as IEmployeePayload;

  setFinalData = (): void => {
    this.finalData.idEmployee = this.employeeData.idEmployee;
    this.finalData.isDefault = this.employeeData.isDefault;
    this.finalData.name = this.employeeData.name;
    this.finalData.email = this.employeeData.email;
    this.finalData.imgPreviewUrl = this.imgPreviewUrl;
    this.finalData.cellphone = this.employeeData.cellphone;
    this.finalData.deskphone = this.employeeData.deskphone;
    this.finalData.cpf = this.employeeData.cpf;
    this.finalData.idCompany = this.employeeData.idCompany;
    this.finalData.idDepartment = this.departmentData.idDepartment;
    this.finalData.employeePosition = this.employeePositionData;
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.setFinalData();
      this.modalStore.onLoading(true);
      this.fieldValidation();
      const response = await this.employeeApi.onSave(this.finalData);
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
      if (e instanceof HttpErrorResponse) {
        const error = e as HttpErrorResponse;
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslated}`,
          error.error.message
        );
      } else {
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslated}`,
          (e as Error).message
        );
      }
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
