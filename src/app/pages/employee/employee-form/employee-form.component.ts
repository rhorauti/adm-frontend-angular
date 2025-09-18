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
import { IEmployee, IEmployeePosition } from '@core/interfaces/employee.interface';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { BaseApiName } from '@core/types/base.type';
import { BaseRegisterStore } from '@store/base/base.register.store';
import { ModalStore } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';
import { PhotoBoxSingleComponent } from '@components/photo-box/photo-box-single/photo-box-single.component';

@Component({
  selector: 'app-employee-form',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    ButtonLabelComponent,
    FormsModule,
    InputComponent,
    SelectComponent,
    PhotoBoxSingleComponent,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss',
})
export class EmployeeFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren(SelectComponent) select!: QueryList<SelectComponent>;
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
  idEmployee = 0;
  idCompany = 0;
  departmentList: IDepartment[] = [];
  departmentOptionList: string[] = [];
  employeePositionList: IEmployeePosition[] = [];
  employeePositionOptionList: string[] = [];

  departmentData = {
    idDepartment: null,
    name: '',
    comment: '',
  } as IDepartment;

  employeePositionData = {
    idEmployeePosition: null,
    name: '',
    comment: '',
  } as IEmployeePosition;

  imgPreview: File | null = null;
  isRemovedPhoto = false;

  employeeData = {
    idEmployee: null,
    isDefault: false,
    name: '',
    email: '',
    photoUrl: '',
    cellphone: '',
    deskphone: '',
    cpf: '',
  } as IEmployee;

  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.idEmployee = Number(params.get('idEmployee')) || 0;
      this.idCompany = Number(params.get('idCompany')) || 0;
    });
    await this.onGetDepartmentList();
    await this.onGetEmployeePositionList();
    if (this.baseRegisterStore.isEditData()) {
      this.employeeData = this.baseRegisterStore.data() as IEmployee;
      this.baseRegisterStore.onSetSlicePropsToNewValue('isEditData', false);
    } else if (this.baseRegisterStore.isCopiedData()) {
      this.employeeData = this.baseRegisterStore.data() as IEmployee;
      this.idEmployee = 0;
      this.employeeData.idEmployee = 0;
      this.employeeData.photoUrl = '';
      this.baseRegisterStore.onSetSlicePropsToNewValue('isCopiedData', false);
    }
    const dept = this.departmentList.find(
      d => d.name === (this.employeeData as IEmployee).department
    );
    this.departmentData = dept ?? { idDepartment: null, name: '', comment: '' };
    const posName = (this.employeeData as IEmployee).position;
    const pos = this.employeePositionList.find(p => p.name === posName);
    this.employeePositionData = pos ?? { idEmployeePosition: null, name: '', comment: '' };
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
    if (this.idEmployee == 0) {
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
      input.id = `${this.currentView}-form-input-${index}`;
      this.labels.get(index)?.nativeElement.setAttribute('for', input.id);
    });
  };

  onDefineSelectId = () => {
    this.select.forEach((select, index) => {
      select.id = `${this.currentView}-form-select-${index}`;
      this.labels.get(index)?.nativeElement.setAttribute('for', select.id);
    });
  };

  setDepartmentValue = (deptName: string): void => {
    const dept = this.departmentList.find(dept => dept.name == deptName) as IDepartment;
    if (dept) {
      this.departmentData = dept;
    } else {
      this.departmentData = {
        idDepartment: 0,
        name: '',
        comment: '',
      };
    }
  };

  setEmployeePositionValue = (positionName: string): void => {
    const position = this.employeePositionList.find(
      position => position.name == positionName
    ) as IEmployeePosition;
    if (position) {
      this.employeePositionData = position;
    } else {
      this.employeePositionData = {
        idEmployeePosition: 0,
        name: '',
        comment: '',
      };
    }
  };

  onPhotoRemoved = (file: File | null): void => {
    if (file == null) {
      this.isRemovedPhoto = true;
      this.imgPreview = null;
    } else {
      this.imgPreview = file;
      this.isRemovedPhoto = false;
    }
  };

  onBackToPreviousPage = (): void => {
    this.modalStore.onRedirectPage(`/${this.idCompany}/${this.currentView}`);
  };

  fieldValidation = (): void => {
    let message = '';
    if (this.employeeData && this.employeeData.name.length == 0) {
      message = 'O campo Nome não pode estar vazio.';
    }
    if (this.employeeData && this.departmentData.name?.length == 0) {
      message = 'O campo Departamento não pode estar vazio.';
    }
    if (message.length > 0) {
      throw Error(message);
    }
  };

  setFinalData = (): FormData => {
    const formData = new FormData();
    if (this.imgPreview) {
      formData.append('file', this.imgPreview, this.imgPreview.name);
    }
    formData.append(
      'data',
      JSON.stringify({
        idEmployee: this.employeeData.idEmployee,
        isDefault: this.employeeData.isDefault,
        name: this.employeeData.name,
        email: this.employeeData.email ?? '',
        cellphone: this.employeeData.cellphone ?? '',
        deskphone: this.employeeData.deskphone ?? '',
        cpf: this.employeeData.cpf ?? '',
        isRemovedPhoto: this.isRemovedPhoto,
        department: this.departmentData ?? { idDepartment: null, name: '', comment: '' },
        employeePosition: this.employeePositionData ?? {
          idEmployeePosition: null,
          name: '',
          comment: '',
        },
      })
    );
    return formData;
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      const finalData = this.setFinalData();
      this.fieldValidation();
      this.modalStore.onLoading(true);
      const response = await this.employeeApi.onSave(this.idCompany, finalData);
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
