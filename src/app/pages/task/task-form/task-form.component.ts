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
import { PhotoBoxListComponent } from '@components/photo-box/photo-box-list/photo-box-list.component';
import { SelectComponent } from '@components/select/select.component';
import { TextAreaComponent } from '@components/text-area/text-area.component';
import { DepartmentApi } from '@core/http/department/department.api';
import { EmployeeApi } from '@core/http/employee/employee.api';
import { ProductApi } from '@core/http/product/product.api';
import { ProductionLineApi } from '@core/http/production-line/production-line.api';
import { TaskTypeApi as TaskApi, TaskTypeApi } from '@core/http/task-type/task-type.api';
import { IDepartment } from '@core/interfaces/department.interface';
import { IEmployee } from '@core/interfaces/employee.interface';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { IProduct } from '@core/interfaces/product.interface';
import { IProductionLine } from '@core/interfaces/production-line.interface';
import { ITask, ITaskType } from '@core/interfaces/task.interface';
import { BaseApiName } from '@core/types/base.type';
import { translateDeptName } from '@core/utils/misc';
import { BaseRegisterStore } from '@store/base/base.register.store';
import { ModalStore } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';

type DataList =
  | 'toolingDataList'
  | 'productionLineDataList'
  | 'taskTypeDataList'
  | 'employeeDataList';

type OptionDataList =
  | 'toolingOptionList'
  | 'productionLineOptionList'
  | 'taskTypeOptionList'
  | 'employeeOptionList';

@Component({
  selector: 'app-task-form',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    ButtonLabelComponent,
    FormsModule,
    InputComponent,
    SelectComponent,
    TextAreaComponent,
    PhotoBoxListComponent,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
  readonly taskApi = inject(TaskApi);
  readonly departmentApi = inject(DepartmentApi);
  readonly taskTypetApi = inject(TaskTypeApi);
  readonly employeeApi = inject(EmployeeApi);
  readonly productionLineApi = inject(ProductionLineApi);
  readonly productApi = inject(ProductApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);

  private cdr = inject(ChangeDetectorRef);

  currentView: BaseApiName = 'tasks';
  currentViewTranslated = 'Atividades';
  currentViewTranslatedSingular = this.currentViewTranslated.slice(0, -1);
  subscription: Subscription | undefined = undefined;
  breadcrumbList: string[] = [];
  deptName = '';
  deptNameTranslated = '';
  idTask: number | null = null;
  idCompany = 1;

  toolingDataList: IProduct[] = [];
  toolingOptionList: string[] = [];
  toolingData = {
    idProduct: null,
    internalPartNumber: '',
    name: '',
  } as Partial<IProduct>;

  isProductionLineSelectDisabled = false;
  productionLineDataList: IProductionLine[] = [];
  productionLineOptionList: string[] = [];
  productionLineData = {
    idProductionLine: null,
    lineCode: '',
    lineName: '',
    comment: '',
  } as IProductionLine;

  taskTypeDataList: ITaskType[] = [];
  taskTypeOptionList: string[] = [];
  taskTypeData = {
    idTaskType: null,
    name: '',
    comment: '',
  } as ITaskType;

  employeeDataList: IEmployee[] = [];
  employeeOptionList: string[] = [];
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

  imgPreviewList: string[] = [];
  fileList: File[] | null = [];

  taskData = {
    idTask: null,
    startDate: new Date(),
    finishDate: new Date(),
    name: '',
    status: null,
    photoUrls: [],
    comment: '',
  } as ITask;

  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.idTask = Number(params.get('idTask')) || 0;
      this.deptName = params.get('department') || '';
    });
    if (this.deptName) this.deptNameTranslated = translateDeptName(this.deptName);
    this.onGetTaskTypeList();
    this.onGetEmployeeList();
    this.onGetProductionLineList();
    await this.onGetToolingList();
    this.toolingOptionList = this.toolingDataList.map(
      data => data.internalPartNumber + ' - ' + data.name
    );
    if (this.baseRegisterStore.isEditData()) {
      this.taskData = this.baseRegisterStore.data() as ITask;
      this.baseRegisterStore.onSetSlicePropsToNewValue('isEditData', false);
    } else if (this.baseRegisterStore.isCopiedData()) {
      this.taskData = this.baseRegisterStore.data() as ITask;
      this.idTask = 0;
      this.taskData.idTask = 0;
      this.baseRegisterStore.onSetSlicePropsToNewValue('isCopiedData', false);
    }
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  onGetTaskTypeList = async (): Promise<void> => {
    return this.onGetDataList<ITaskType>({
      apiCall: () => this.taskTypetApi.onGetDataList(this.deptName),
      dataListKey: 'taskTypeDataList',
      optionListKey: 'taskTypeOptionList',
      optionPropertyKey: 'name',
      errorTitle: 'Listar tipos de atividades: ',
    });
  };

  onGetEmployeeList = async (): Promise<void> => {
    return this.onGetDataList<IEmployee>({
      apiCall: () => this.employeeApi.onGetDataList(this.idCompany),
      dataListKey: 'employeeDataList',
      optionListKey: 'employeeOptionList',
      optionPropertyKey: 'name',
      errorTitle: 'Listar funcionários: ',
    });
  };

  onGetProductionLineList = async (): Promise<void> => {
    return this.onGetDataList<IProductionLine>({
      apiCall: () => this.productionLineApi.onGetDataList(),
      dataListKey: 'productionLineDataList',
      optionListKey: 'productionLineOptionList',
      optionPropertyKey: 'lineCode',
      errorTitle: 'Listar linhas de produção: ',
    });
  };

  onGetToolingList = async (): Promise<void> => {
    return this.onGetDataList<IProduct>({
      apiCall: () => this.productApi.onGetDataListByProductType('name', 'Ativo'),
      dataListKey: 'toolingDataList',
      optionListKey: 'toolingOptionList',
      optionPropertyKey: 'name',
      errorTitle: 'Listar ferramentas: ',
    });
  };

  private async onGetDataList<T>(config: {
    apiCall: () => Promise<{ data?: T | T[] }>;
    dataListKey: DataList;
    optionListKey: OptionDataList;
    optionPropertyKey: keyof T;
    errorTitle: string;
  }): Promise<void> {
    try {
      this.modalStore.onLoading(true);
      const response = await config.apiCall();

      if (response.data) {
        const data = response.data;
        (this as any)[config.dataListKey] = data;
        (this as any)[config.optionListKey] = (data as T[]).map(
          item => item[config.optionPropertyKey]
        );
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal(config.errorTitle, error.error?.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  }

  onClearProductionLineData = (): void => {
    this.productionLineData = {
      idProductionLine: 0,
      lineCode: '',
      lineName: '',
      comment: '',
    } as IProductionLine;
  };

  onClearTaskTypeData = (): void => {
    this.taskTypeData = {
      idTaskType: 0,
      name: '',
      comment: '',
    } as ITaskType;
  };

  onClearEmployeeData = (): void => {
    this.employeeData = {
      idEmployee: 0,
      name: '',
      isDefault: false,
      cellphone: '',
      cpf: '',
      deskphone: '',
      email: '',
      position: '',
      photoUrl: '',
      department: '',
      comment: '',
    } as IEmployee;
  };

  setTaskTypeValue = (taskTypeName: string): void => {
    this.onClearProductionLineData();
    if (this.isProductionLineSelectDisabled) this.isProductionLineSelectDisabled = false;
    const taskType = this.taskTypeDataList.find(
      taskType => taskType.name == taskTypeName
    ) as ITaskType;
    if (taskTypeName) {
      this.taskTypeData = taskType;
    } else {
      this.onClearTaskTypeData();
    }
  };

  setEmployeeValue = (employeeName: string): void => {
    const employee = this.employeeDataList.find(
      employee => employee.name == employeeName
    ) as IEmployee;
    if (employeeName) {
      this.employeeData = employee;
    } else {
      this.onClearEmployeeData();
    }
  };

  setProductionLineValue = (productionLineName: string): void => {
    const taskType = this.productionLineDataList.find(
      productionLine => productionLine.lineCode == productionLineName
    ) as IProductionLine;
    if (productionLineName) {
      this.productionLineData = taskType;
    } else {
      this.onClearProductionLineData();
    }
  };

  onSetSelectedTooling = (tooling: string): void => {
    const internalPartNumber = tooling.split('-')[0].trim();
    if (!internalPartNumber) {
      return;
    }
    const foundProductionLine = this.productionLineDataList.find(pl =>
      pl.toolingList?.some(tool => tool.internalPartNumber == internalPartNumber)
    );
    if (foundProductionLine) {
      this.productionLineData = foundProductionLine as IProductionLine;
      this.isProductionLineSelectDisabled = true;
    } else {
      this.onClearProductionLineData();
    }
  };

  setStartDate = (date: string): void => {
    this.taskData.startDate = new Date(date);
  };

  setFinishDate = (date: string): void => {
    this.taskData.finishDate = new Date(date);
  };

  setTaskValue = (status: string): void => {
    this.taskData.status = status;
  };

  defineTitle = (): string => {
    if (this.idTask == 0) {
      return 'Novo Registro';
    } else {
      return this.taskData.name;
    }
  };

  isRemovedPhoto = false;

  onFileListChange = (fileList: File[] | null): void => {
    this.fileList = fileList;
    console.log('listfiles', this.fileList);
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

  onBackToPreviousPage = (): void => {
    this.modalStore.onRedirectPage(`/${this.deptName}/${this.currentView}`);
  };

  fieldValidation = (): void => {
    const message = 'O campo Nome do Cargo não pode estar vazio.';
    if (this.taskData.name.length == 0) {
      this.modalStore.onShowInfoModal(`Cadastro de ${this.currentViewTranslatedSingular}`, message);
      throw Error(message);
    }
  };

  setFinalData = (): FormData => {
    const formData = new FormData();
    if (this.fileList) {
      for (const file of this.fileList) {
        formData.append('files', file);
      }
    }
    formData.append(
      'data',
      JSON.stringify({
        idTask: this.taskData.idTask,
        startDate: this.taskData.startDate,
        finishDate: this.taskData.finishDate,
        name: this.taskData.name,
        status: this.taskData.status,
        comment: this.taskData.comment,
        employee: this.employeeData,
        product: this.toolingData,
        productionLine: this.productionLineData,
        taskType: this.taskTypeData,
      })
    );
    return formData;
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    const finalData = this.setFinalData();
    console.log('task', this.taskData);
    console.log('employee', this.employeeData);
    console.log('product', this.toolingData);
    console.log('productionLine', this.productionLineData);
    console.log('taskTypeData', this.taskTypeData);
    console.log('files', finalData.getAll('files'));

    // try {
    // this.modalStore.onLoading(true);
    // this.fieldValidation();
    // const deptNameTranslated = translateDeptName(this.deptName);
    // const dept = await this.departmentApi.onGetDataByField('name', deptNameTranslated);
    // const deptData = dept.data as IDepartment;
    // this.data.department = deptData;
    // const response = await this.taskApi.onSave(this.deptName, this.data);
    // if (response.status) {
    //   this.modalStore.onSetModalInfoType('success');
    //   this.modalStore.onShowInfoModal(
    //     `Cadastro de ${this.currentViewTranslatedSingular}`,
    //     response.message,
    //     onActionOk
    //   );
    // } else {
    //   this.modalStore.onShowInfoModal(
    //     `Cadastro de ${this.currentViewTranslatedSingular}`,
    //     response.error?.message || ''
    //   );
    // }
    // } catch (e: unknown) {
    //   if (e instanceof HttpErrorResponse) {
    //     const error = e as HttpErrorResponse;
    //     this.modalStore.onShowInfoModal(
    //       `Cadastro de ${this.currentViewTranslated}`,
    //       error.error.message
    //     );
    //   } else {
    //     this.modalStore.onShowInfoModal(
    //       `Cadastro de ${this.currentViewTranslated}`,
    //       (e as Error).message
    //     );
    //   }
    // } finally {
    //   this.modalStore.onLoading(false);
    // }
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
