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
import { SelectComponent } from '@components/select/select.component';
import { DepartmentApi } from '@core/http/department/department.api';
import { EmployeePositionApi } from '@core/http/employee/employee-position.api';
import { EmployeeApi } from '@core/http/employee/employee.api';
import { PartialDept } from '@core/interfaces/department.interface';
import { IEmployeeForm, PartialEmployeePosition } from '@core/interfaces/employee.interface';
import { ActionCallback, IModalInfo } from '@core/interfaces/modal.interface';
import { BaseApiName } from '@core/types/base.type';
import { ModalType } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';
import { PhotoBoxSingleComponent } from '@components/photo-box/photo-box-single/photo-box-single.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';

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
    ModalInfoComponent,
    LoadingComponent,
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
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);

  private cdr = inject(ChangeDetectorRef);

  currentView: BaseApiName = 'employees';
  currentViewTranslated = 'Funcionários'.slice(0, -1);
  subscription: Subscription | undefined = undefined;
  breadcrumbList: string[] = [];
  idEmployee = 0;
  idCompany = 0;
  departmentOptionList: string[] = [];
  employeePositionOptionList: string[] = [];

  imgPreview: File | null = null;
  isRemovedPhoto = false;

  employeeFormData: IEmployeeForm = {
    idEmployee: 0,
    isDefault: false,
    name: '',
    cpf: '',
    email: '',
    deskphone: '',
    cellphone: '',
    photoUrl: '',
    company: {
      idCompany: 0,
      name: '',
    },
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
      this.idEmployee = Number(params.get('idEmployee')) || 0;
      this.idCompany = Number(params.get('idCompany')) || 1;
    });
    if (this.router.url.includes('edit') && (this.idEmployee || 0) > 0) {
      const employee = await this.employeeApi.onGetData(this.idCompany || 0, this.idEmployee || 0);
      this.employeeFormData = employee.data as IEmployeeForm;
    } else if (this.router.url.includes('new') && (this.idEmployee || 0) > 0) {
      const employee = await this.employeeApi.onGetData(this.idCompany || 0, this.idEmployee || 0);
      this.employeeFormData = employee.data as IEmployeeForm;
      this.employeeFormData.idEmployee = null;
      this.employeeFormData.photoUrl = '';
    }
    this.departmentOptionList = this.employeeFormData.departmentList?.map(dept => dept.name) || [];
    this.employeePositionOptionList =
      this.employeeFormData.employeePositionList?.map(pos => pos.name) || [];
    this.employeePositionOptionList.unshift('Sem registro');
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  defineTitle = (): string => {
    if (this.idEmployee == 0) {
      return 'Novo Registro';
    } else {
      return this.employeeFormData.name;
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
    const dept = (this.employeeFormData.departmentList || []).find(
      dept => dept.name == deptName
    ) as PartialDept;
    if (dept) {
      this.employeeFormData.department = dept;
    } else {
      this.employeeFormData.department = {
        idDepartment: 0,
        name: '',
      };
    }
  };

  setEmployeePositionValue = (positionName: string): void => {
    const position = (this.employeeFormData.employeePositionList || []).find(
      position => position.name == positionName
    ) as PartialEmployeePosition;
    if (position) {
      this.employeeFormData.employeePosition = position;
    } else {
      this.employeeFormData.employeePosition = {
        idEmployeePosition: 0,
        name: '',
      };
    }
  };

  onFileChange = (file: File | null): void => {
    if (file == null) {
      this.isRemovedPhoto = true;
      this.imgPreview = null;
    } else {
      this.imgPreview = file;
      this.isRemovedPhoto = false;
    }
  };

  onBackToPreviousPage = (): void => {
    this.router.navigate([`/${this.idCompany}/${this.currentView}`]);
  };

  fieldValidation = (): void => {
    let message = '';
    if (this.employeeFormData && this.employeeFormData.name.length == 0) {
      message = 'O campo Nome não pode estar vazio.';
    }
    if (
      this.employeeFormData.department != null &&
      (this.employeeFormData.department.name || '')?.length == 0
    ) {
      message = 'O campo Departamento não pode estar vazio.';
    }
    if (
      this.employeeFormData.employeePosition != null &&
      (this.employeeFormData.employeePosition.name || '')?.length == 0
    ) {
      message = 'O campo Cargo não pode estar vazio.';
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
        idEmployee: this.employeeFormData.idEmployee,
        isDefault: this.employeeFormData.isDefault,
        name: this.employeeFormData.name,
        email: this.employeeFormData.email ?? '',
        cellphone: this.employeeFormData.cellphone ?? '',
        deskphone: this.employeeFormData.deskphone ?? '',
        cpf: this.employeeFormData.cpf ?? '',
        isRemovedPhoto: this.isRemovedPhoto,
        department: this.employeeFormData.department ?? { idDepartment: null, name: '' },
        employeePosition: this.employeeFormData.employeePosition ?? {
          idEmployeePosition: null,
          name: '',
        },
      })
    );
    return formData;
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      const finalData = this.setFinalData();
      this.fieldValidation();
      this.isLoading.set(true);
      const response = await this.employeeApi.onSave(this.idCompany, finalData);
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
      if (e instanceof HttpErrorResponse) {
        const error = e as HttpErrorResponse;
        this.onShowInfoModal(
          'failure',
          `Cadastro de ${this.currentViewTranslated}`,
          error.error?.message || 'Erro desconhecido'
        );
      } else {
        this.onShowInfoModal(
          'failure',
          `Cadastro de ${this.currentViewTranslated}`,
          (e as Error).message
        );
      }
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
