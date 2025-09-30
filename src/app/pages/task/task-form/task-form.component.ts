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
import { ButtonDeleteComponent } from '@components/button/button-delete/button-delete.component';
import { ButtonIconComponent } from '@components/button/button-icon/button-icon.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { PhotoBoxListComponent } from '@components/photo-box/photo-box-list/photo-box-list.component';
import { SelectComponent } from '@components/select/select.component';
import { TextAreaComponent } from '@components/text-area/text-area.component';
import { ToogleButtonComponent } from '@components/toogle-button/toogle-button.component';
import {
  onConvertTaskStatusToNumber,
  onStringfyTaskStatus as onConvertTaskStatusFromNumberToFriendlyName,
  TASK_NUMBER_STATUS,
} from '@core/enum/status.enum';
import { TaskApi } from '@core/http/task/task.api';
import { IEmployee } from '@core/interfaces/employee.interface';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { IProductionLine } from '@core/interfaces/production-line.interface';
import {
  ITask,
  ITaskType,
  PartialEmployee,
  PartialProductionLine,
  PartialTaskType,
  UsedSpareParts,
} from '@core/interfaces/task.interface';
import { BaseApiName } from '@core/types/base.type';
import { dateAndHourFormatted } from '@core/utils/misc';
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
    ToogleButtonComponent,
    ButtonIconComponent,
    ButtonDeleteComponent,
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

  eligibleOptionsForTooling: string[] = ['Ferramenta'];
  eligibleOptionsForProductionLine: string[] = ['Ferramenta', 'Corretiva', 'Preventiva'];
  toolingOptionList: string[] = [];
  taskTypeOptionList: string[] = [];
  productionLineOptionList: string[] = [];
  employeeOptionList: string[] = [];
  usedSparePartsOptionList: string[] = [];
  separatorSymbol = '_';

  usedSparePartsMock = [
    {
      idProduct: 11,
      internalPartNumber: '111-111',
      name: 'Nome 1',
      qty: 1,
    },
    {
      idProduct: 22,
      internalPartNumber: '222-222',
      name: 'Nome 2',
      qty: 2,
    },
    {
      idProduct: 33,
      internalPartNumber: '333-333',
      name: 'Nome 3',
      qty: 3,
    },
  ];

  showSpareParts = false;
  initialUsedSparePartsList: UsedSpareParts[] = [
    {
      idProduct: 0,
      internalPartNumber: '',
      name: '',
      qty: 1,
    },
  ];

  isProductionLineSelectDisabled = false;
  startDate = '';
  finishDate = '';

  fileList: File[] | null = [];
  taskFormData: ITask = {
    idTask: 0,
    startDate: null,
    finishDate: null,
    name: '',
    usedSpareParts: [
      {
        idProduct: 0,
        internalPartNumber: '',
        name: '',
        qty: 1,
      },
    ],
    status: TASK_NUMBER_STATUS.NOT_STARTED,
    comment: '',
    imgPreviewList: [],
    toolingList: [],
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
    const taskData = response.data as ITask;
    this.taskFormData = {
      ...taskData,
      startDate: taskData.startDate ? new Date(taskData.startDate) : null,
      finishDate: taskData.finishDate ? new Date(taskData.finishDate) : null,
    };
    if (this.taskFormData.usedSpareParts) {
      this.showSpareParts = this.taskFormData.usedSpareParts.length > 0;
    }
    this.onSetStartAndFinishDate();
    this.onSetOptionsList();
    this.taskStatus = onConvertTaskStatusFromNumberToFriendlyName(
      this.taskFormData.status as number
    );
    this.onDisabledStatusOptions();
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  onSetStartAndFinishDate = (): void => {
    if (this.taskFormData.startDate) {
      this.startDate = dateAndHourFormatted(this.taskFormData.startDate);
    }
    if (this.taskFormData.finishDate) {
      this.finishDate = dateAndHourFormatted(this.taskFormData.finishDate);
    }
  };

  isStatusDisabled = false;

  onDisabledStatusOptions = (): void => {
    this.isStatusDisabled =
      this.taskFormData.status == TASK_NUMBER_STATUS.NOT_STARTED ||
      this.taskFormData.status == TASK_NUMBER_STATUS.FINISHED;
  };

  onSetOptionsList = (): void => {
    if (this.taskFormData.usedSpareParts) {
      this.initialUsedSparePartsList = [...this.taskFormData.usedSpareParts];
      this.usedSparePartsOptionList = this.taskFormData.usedSpareParts?.map(
        sp => sp.internalPartNumber + this.separatorSymbol + sp.name
      );
    }
    this.toolingOptionList = this.taskFormData?.toolingList?.map(
      tooling => tooling.internalPartNumber + this.separatorSymbol + tooling.name
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
    const internalPartNumber = tooling.split(this.separatorSymbol)[0].trim();
    if (!internalPartNumber) {
      return;
    }
    const foundProductionLine = this.taskFormData.productionLineList?.find(pl =>
      pl.toolingList?.some(tool => {
        return tool.internalPartNumber == internalPartNumber;
      })
    );
    this.taskFormData.toolingList?.forEach(tooling => {
      if (tooling.internalPartNumber == internalPartNumber) {
        this.taskFormData.product = tooling;
      }
    });
    if (foundProductionLine && foundProductionLine?.lineCode.length > 0) {
      this.taskFormData.productionLine = foundProductionLine as IProductionLine;
      this.isProductionLineSelectDisabled = true;
    } else {
      this.onClearProductionLineData();
      this.isProductionLineSelectDisabled = false;
    }
  };

  setStatusValue = (status: string): void => {
    this.taskFormData.status = onConvertTaskStatusToNumber(status);
  };

  onSparePartNameChange = (name: string, index: number): void => {
    console.log('name', name);
    const internalPartNumber = name?.split(this.separatorSymbol)[0];
    if (this.taskFormData.usedSpareParts) {
      const selectedItem = this.initialUsedSparePartsList.find(
        sp => sp.internalPartNumber.trim() == internalPartNumber.trim()
      ) as UsedSpareParts;
      if (selectedItem) {
        this.taskFormData.usedSpareParts[index] = { ...selectedItem };
      }
    }
  };

  onSparePartQtyChange = (value: string, index: number): void => {
    if (this.taskFormData.usedSpareParts) {
      this.taskFormData.usedSpareParts[index].qty = Number(value);
    }
  };

  onAddSparePartsRow = (): void => {
    this.taskFormData.usedSpareParts?.push({
      idProduct: 0,
      internalPartNumber: '',
      name: '',
      qty: 1,
    });
  };

  onRemoveSparePartsRow = (sparePart: UsedSpareParts): void => {
    if (this.taskFormData.usedSpareParts?.length == 1) {
      this.taskFormData.usedSpareParts[0] = {
        idProduct: 0,
        internalPartNumber: '',
        name: '',
        qty: 1,
      };
      this.showSpareParts = false;
      return;
    }
    const index = this.taskFormData.usedSpareParts?.indexOf(sparePart) as number;
    if (index && index < 0) return;
    this.taskFormData.usedSpareParts?.splice(index, 1);
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
    const message = '';
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
    const finalData: ITask = {
      idTask: this.taskFormData.idTask,
      usedSpareParts: this.taskFormData.usedSpareParts,
      startDate: this.taskFormData.startDate,
      finishDate: this.taskFormData.finishDate,
      name: this.taskFormData.name,
      status: this.taskFormData.status,
      comment: this.taskFormData.comment,
      product: this.taskFormData.product,
      productionLine: this.taskFormData.productionLine,
      taskType: this.taskFormData.taskType,
      employee: this.taskFormData.employee,
    };
    formData.append('data', JSON.stringify(finalData));
    return formData;
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const formData = this.setFinalData();
      this.fieldValidation();
      const response = await this.taskApi.onSave(this.paramsDeptName, formData);
      if (response.status) {
        this.modalStore.onSetModalInfoType('success');
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslatedSingular}`,
          response.message,
          onActionOk
        );
      } else {
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslatedSingular}`,
          response.error?.message || ''
        );
      }
    } catch (e: unknown) {
      console.log('error', e);
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
