import { CommonModule } from '@angular/common';
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
import { onConvertTaskStatusToNumber, onStringfyTaskStatus } from '@core/enum/status.enum';
import { TaskApi } from '@core/http/task/task.api';
import { IEmployee } from '@core/interfaces/employee.interface';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { IProduct } from '@core/interfaces/product.interface';
import { IProductionLine } from '@core/interfaces/production-line.interface';
import {
  ITask,
  ITaskType,
  PartialEmployee,
  PartialProductionLine,
  PartialTaskType,
} from '@core/interfaces/task.interface';
import { BaseApiName } from '@core/types/base.type';
import { BaseRegisterStore } from '@store/base/base.register.store';
import { ModalStore } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';

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
  paramsDeptName = '';
  paramsIdTask: number | null = null;
  taskStatus = '';
  idCompany = 1;

  toolingOptionList: string[] = [];
  taskTypeOptionList: string[] = [];
  productionLineOptionList: string[] = [];
  employeeOptionList: string[] = [];

  isProductionLineSelectDisabled = false;
  fileList: File[] | null = [];
  taskFormData: ITask = {
    idTask: 0,
    startDate: null,
    finishDate: null,
    name: '',
    status: 0,
    comment: '',
    imgPreviewList: [],
    productList: [],
    product: {
      idProduct: 0,
      internalPartNumber: '',
      name: '',
    },
    productionLineList: [],
    productionLine: {
      idProductionLine: 0,
      lineCode: '',
      toolingList: [],
    },
    taskTypeList: [],
    taskType: {
      idTaskType: 0,
      name: '',
    },
    employeeList: [],
    employee: {
      idEmployee: 0,
      name: '',
    },
  };

  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.paramsIdTask = Number(params.get('idTask')) || 0;
      this.paramsDeptName = params.get('department') || '';
    });
    const response = await this.taskApi.onGetDataById(
      this.paramsDeptName,
      this.paramsIdTask as number
    );
    this.taskFormData = response.data as ITask;
    this.onSetOptionsList();
    this.taskStatus = onStringfyTaskStatus(this.taskFormData.status as number);
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  onSetOptionsList = (): void => {
    this.toolingOptionList = this.taskFormData?.productList?.map(
      tooling => tooling.internalPartNumber + ' - ' + tooling.name
    ) as string[];
    this.taskTypeOptionList = this.taskFormData?.taskTypeList?.map(
      taskType => taskType.name
    ) as string[];
    this.productionLineOptionList = this.taskFormData?.productionLineList?.map(
      pl => pl.lineCode
    ) as string[];
    this.employeeOptionList = this.taskFormData?.employeeList?.map(
      employee => employee.name
    ) as string[];
  };

  onClearProductionLineData = (): void => {
    this.taskFormData.productionLine = {
      idProductionLine: 0,
      lineCode: '',
    } as PartialProductionLine;
  };

  onClearTaskTypeData = (): void => {
    this.taskFormData.taskType = {
      idTaskType: 0,
      name: '',
    } as PartialTaskType;
  };

  onClearEmployeeData = (): void => {
    this.taskFormData.employee = {
      idEmployee: 0,
      name: '',
    } as PartialEmployee;
  };

  setTaskTypeValue = (taskTypeName: string): void => {
    this.onClearProductionLineData();
    if (this.isProductionLineSelectDisabled) this.isProductionLineSelectDisabled = false;
    const taskType = this.taskFormData.taskTypeList?.find(
      taskType => taskType.name == taskTypeName
    ) as ITaskType;
    if (taskTypeName) {
      this.taskFormData.taskType = taskType;
    } else {
      this.onClearTaskTypeData();
    }
  };

  setEmployeeValue = (employeeName: string): void => {
    const employee = this.taskFormData.employeeList?.find(
      employee => employee.name == employeeName
    ) as IEmployee;
    if (employeeName) {
      this.taskFormData.employee = employee;
    } else {
      this.onClearEmployeeData();
    }
  };

  setProductionLineValue = (productionLineName: string): void => {
    const productionLine = this.taskFormData.productionLineList?.find(
      productionLine => productionLine.lineCode == productionLineName
    ) as IProductionLine;
    if (productionLineName) {
      this.taskFormData.productionLine = productionLine;
    } else {
      this.onClearProductionLineData();
    }
  };

  onSetSelectedTooling = (tooling: string): void => {
    const internalPartNumber = tooling.split('-')[0].trim();
    if (!internalPartNumber) {
      return;
    }
    const foundProductionLine = this.taskFormData.productionLineList?.find(pl =>
      pl.toolingList?.some(tool => {
        if (tool.internalPartNumber == internalPartNumber) {
          (this.taskFormData.productionLine as PartialProductionLine).toolingList =
            tool as Partial<IProduct>[];
        }
        return tool.internalPartNumber == internalPartNumber;
      })
    );
    if (foundProductionLine) {
      this.taskFormData.productionLine = foundProductionLine as IProductionLine;
      this.isProductionLineSelectDisabled = true;
    } else {
      this.onClearProductionLineData();
    }
  };

  setStatusValue = (status: string): void => {
    const statusNumber = onConvertTaskStatusToNumber(status);
    this.taskFormData.status = statusNumber;
  };

  defineTitle = (): string => {
    if (this.paramsIdTask == 0) {
      return 'Novo Registro';
    } else {
      return this.taskFormData.name as string;
    }
  };

  isRemovedPhoto = false;

  onFileListChange = (fileList: File[]): void => {
    this.fileList = fileList;
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
    this.modalStore.onRedirectPage(`/${this.paramsDeptName}/${this.currentView}`);
  };

  fieldValidation = (): void => {
    const message = 'O campo Nome do Cargo não pode estar vazio.';
    if (this.taskFormData.name?.length == 0) {
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
    formData.append('data', JSON.stringify(this.taskFormData));
    return formData;
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    const finalData = this.setFinalData();
    console.log('data', finalData.getAll('data'));
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
