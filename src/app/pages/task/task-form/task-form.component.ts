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
import { ButtonDeleteComponent } from '@components/button/button-delete/button-delete.component';
import { ButtonIconComponent } from '@components/button/button-icon/button-icon.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { HelpComponent } from '@components/help/help.component';
import { InputComponent } from '@components/input/input.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { PhotoBoxListComponent } from '@components/photo-box/photo-box-list/photo-box-list.component';
import { SelectComponent } from '@components/select/select.component';
import { TextAreaComponent } from '@components/text-area/text-area.component';
import { ToogleButtonComponent } from '@components/toogle-button/toogle-button.component';
import {
  onTranslateStatusToNumber,
  onTranslateStatusToString as onConvertTaskStatusFromNumberToFriendlyName,
  TASK_NUMBER_STATUS,
} from 'app/enum/status.enum';
import { TaskApi } from '@core/http/task/task.api';
import { IEmployeeHome } from '@core/interfaces/employee.interface';
import {
  ActionCallback,
  IModalAsk,
  IModalInfo,
  IModalTable,
} from '@core/interfaces/modal.interface';
import { IPhoto } from '@core/interfaces/photo.interface';
import { PartialProduct } from '@core/interfaces/product.interface';
import { IProductionLine } from '@core/interfaces/production-line.interface';
import { ITableHeader } from '@core/interfaces/table.interface';
import {
  IUsedSpareParts,
  ITaskForm,
  IResponseTaskForm,
  ITaskType,
} from '@core/interfaces/task.interface';
import { BaseApiName } from '@core/types/base.type';
import { ValidationType } from '@core/types/validation.type';
import { AuthStore } from '@store/auth/auth.store';
import { BaseRegisterStore, defaultTableHeaderIcon } from '@store/base/base.register.store';
import { ModalType } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';
import { onFormatDateFromUtcToLocal } from '@core/utils/misc';
import { ModalTableComponent } from '@components/modal/modal-table/modal-table.component';

interface IDisabled {
  idTask: boolean;
  name: boolean;
  startDate: boolean;
  finishDate: boolean;
  status: boolean;
  usedSpareParts: boolean;
  comment: boolean;
  employee: boolean;
  taskType: boolean;
  tooling: boolean;
  productionLine: boolean;
  saveButton: boolean;
  photoBoxList: boolean;
}

interface IBorderType {
  name: ValidationType;
  usedSpareParts: ValidationType[];
  employee: ValidationType;
  taskType: ValidationType;
  tooling: ValidationType;
  productionLine: ValidationType;
}

type ProductCache = 'toolingCache' | 'sparePartsCache';

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
    HelpComponent,
    ModalInfoComponent,
    ModalAskComponent,
    LoadingComponent,
    ModalTableComponent,
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
  readonly authStore = inject(AuthStore);

  private cdr = inject(ChangeDetectorRef);

  currentView: BaseApiName = 'tasks';
  currentViewTranslated = 'Atividades';
  currentViewTranslatedSingular = this.currentViewTranslated.slice(0, -1);
  subscription: Subscription | undefined = undefined;
  breadcrumbList: string[] = [];
  modalBreadcrumbList: string[] = [];
  paramsDeptName = '';
  paramsIdTask: number | null = null;
  taskStatus = signal('');
  idCompany = 1;

  eligibleTaskTypeOptionsForTooling: string[] = ['Ferramenta'];
  eligibleTaskTypeOptionsForProductionLine: string[] = ['Ferramenta', 'Corretiva', 'Preventiva'];

  toolingOptionList: string[] = [];
  taskTypeOptionList: string[] = [];
  productionLineOptionList: string[] = [];
  employeeOptionList: string[] = [];
  usedSparePartsOptionList: string[] = [];

  separatorSymbol = '_';
  sparePartsProductType = 'Despesa';
  toolingProductType = 'Ativo';

  isDisabled = signal<IDisabled>({
    idTask: true,
    name: false,
    startDate: true,
    finishDate: true,
    status: false,
    usedSpareParts: false,
    comment: false,
    employee: false,
    taskType: false,
    tooling: false,
    productionLine: false,
    saveButton: false,
    photoBoxList: false,
  });

  borderType = signal<IBorderType>({
    name: 'success',
    usedSpareParts: [],
    employee: 'success',
    taskType: 'success',
    tooling: 'success',
    productionLine: 'success',
  });

  readonly inputSearchPlaceholder = 'Id, PN interno, Nome';
  readonly initialTableHeaders = [
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idProduct',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'PN interno',
      databaseField: 'internalPartNumber',
    },
    {
      id: 2,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Nome',
      databaseField: 'name',
    },
  ] as ITableHeader<PartialProduct>[];

  modalSpareParts = signal<IModalTable<PartialProduct, IResponseTaskForm>>({
    isModalActive: false,
    tableHeaders: this.initialTableHeaders,
    initialDataList: [],
    breadcrumbList: ['Spare Parts', 'Selecione um item'],
    onShowDataList: this.taskApi.onGetDataById,
    inputSearchFilterList: [],
    currentView: this.currentView,
    inputSearchPlaceholder: this.inputSearchPlaceholder,
  });

  modalTooling = signal<IModalTable<PartialProduct, IResponseTaskForm>>({
    isModalActive: false,
    tableHeaders: this.initialTableHeaders,
    initialDataList: [],
    breadcrumbList: ['Ferramentas', 'Selecione um item'],
    onShowDataList: this.taskApi.onGetDataById,
    inputSearchFilterList: [],
    currentView: this.currentView,
    inputSearchPlaceholder: this.inputSearchPlaceholder,
  });

  showSpareParts = signal(false);
  startDate = signal('');
  finishDate = signal('');

  taskForm = signal<ITaskForm>({
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
    imgPreviewList: null,
    productList: [],
    product: {
      idProduct: 0,
      internalPartNumber: '',
      name: '',
      productType: {
        idProductType: 0,
        name: '',
      },
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
  });

  modalInfo = signal<IModalInfo>({
    isActive: false,
    title: '',
    description: '',
    type: 'failure',
    onActionOk: null,
  });

  modalAsk = signal<IModalAsk>({
    isActive: false,
    title: '',
    description: '',
    onActionOk: null as ActionCallback,
    onActionNok: null as ActionCallback,
  });

  isLoading = signal(false);
  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.paramsIdTask = Number(params.get('idTask')) || 0;
      this.paramsDeptName = params.get('department') || '';
    });
    const response = await this.taskApi.onGetDataById(
      this.paramsDeptName,
      this.paramsIdTask as number
    );
    const taskData = response.data as ITaskForm;
    this.taskForm.set(taskData);
    this.borderType.update(form => ({
      ...form,
      usedSpareParts: Array.from(
        { length: (this.taskForm().usedSpareParts || [])?.length },
        () => 'success'
      ),
    }));
    // const modalSparePartsInitialData = this.modalSpareParts().initialDataList || [];
    // if (modalSparePartsInitialData) {
    this.modalSpareParts.update(current => ({
      ...current,
      initialDataList:
        this.taskForm()?.productList?.filter(p => {
          return p.productType.name == this.sparePartsProductType;
        }) ?? [],
    }));
    // }
    this.modalTooling.update(current => ({
      ...current,
      initialDataList:
        this.taskForm()?.productList?.filter(p => p.productType.name == this.toolingProductType) ??
        [],
    }));
    if (this.taskForm().usedSpareParts && this.taskForm().usedSpareParts != null) {
      this.showSpareParts.set((this.taskForm().usedSpareParts || []).length > 0);
    }
    this.onSetStartAndFinishDate();
    this.onSetOptionsList();
    this.taskStatus.set(
      onConvertTaskStatusFromNumberToFriendlyName(this.taskForm().status as number)
    );

    // this.onDisabledStatusOptions();
    // if (this.taskFormData.status == TASK_NUMBER_STATUS.FINISHED) {
    // this.onDisbledForm();
    // }
    // const tableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
    // const headers = tableHeaders ? tableHeaders : this.initialTableHeaders;
    // this.initialTableHeaders = headers
    // this.baseRegisterStore.onSetSlicePropsToNewValue('tableHeaders', headers);
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
    this.cdr.markForCheck();
  }

  onDisbledForm = (): void => {
    (Object.keys(this.isDisabled) as (keyof IDisabled)[]).forEach(key => {
      this.isDisabled()[key] = true;
    });
  };

  onSetStartAndFinishDate = (): void => {
    if (this.taskForm().startDate && this.taskForm().startDate != null) {
      this.startDate.set(onFormatDateFromUtcToLocal(this.taskForm().startDate || ''));
    }
    if (this.taskForm().finishDate && this.taskForm().finishDate != null) {
      this.finishDate.set(onFormatDateFromUtcToLocal(this.taskForm().finishDate || ''));
    }
  };

  onSetModalTableSparePartsData = (data: PartialProduct): void => {
    const used = this.taskForm().usedSpareParts;
    if (!data || !used || used.length === 0) {
      this.onShowSparePartsModalTable(false);
      return;
    }
    if (this.sparePartsIdx >= 0) {
      used[this.sparePartsIdx].idProduct = data.idProduct as number;
      used[this.sparePartsIdx].internalPartNumber =
        data.internalPartNumber ?? used[this.sparePartsIdx].internalPartNumber;
      used[this.sparePartsIdx].name = data.name ?? used[this.sparePartsIdx].name;
    }
    this.onShowSparePartsModalTable(false);
  };

  onShowToolingModalTable = (isActive: boolean): void => {
    this.modalTooling.update(current => ({ ...current, isModalActive: isActive }));
  };

  onSetModalTableToolingData = (data: PartialProduct): void => {
    if (data) {
      this.taskForm.update(current => ({ ...current, product: data }));
    }
    this.onSetProductionLineBasedOnToolingChange(data.internalPartNumber);
    this.onShowToolingModalTable(false);
  };

  onDisabledStatusOptions = (): void => {
    this.isDisabled.update(current => ({
      ...current,
      status: this.taskForm().status == TASK_NUMBER_STATUS.NOT_STARTED,
    }));
  };

  toolingCache = new Map<string, string[]>();
  sparePartsCache = new Map<string, string[]>();

  onFilterProductList = (productCache: string, value: string): string[] => {
    if (this[productCache as ProductCache].has(value)) {
      return this[productCache as ProductCache].get(value)!;
    }

    const productsFilter = this.taskForm().productList
      ? (this.taskForm().productList?.filter(p => p.productType.name == value) as PartialProduct[])
      : [];

    const result = productsFilter.map(
      product => `${product.internalPartNumber}${this.separatorSymbol}${product.name}`
    );

    this[productCache as ProductCache].set(value, result);
    return result;
  };

  onSetOptionsList = (): void => {
    if (this.taskForm().usedSpareParts?.length) {
      this.usedSparePartsOptionList = [
        ...(this.taskForm().usedSpareParts || []).map(
          sp => `${sp.internalPartNumber}${this.separatorSymbol}${sp.name}`
        ),
      ];
    }

    this.toolingOptionList = this.onFilterProductList('toolingCache', this.toolingProductType);
    this.usedSparePartsOptionList = [
      ...this.onFilterProductList('sparePartsCache', this.sparePartsProductType),
    ];

    if (this.taskForm().taskTypeList?.length) {
      this.taskTypeOptionList = [
        ...(this.taskForm().taskTypeList || []).map(taskType => taskType.name),
      ];
    }

    if (this.taskForm().productionLineList?.length) {
      this.productionLineOptionList = [
        ...(this.taskForm().productionLineList || []).map(pl => pl.lineCode),
      ];
    }

    if (this.taskForm().employeeList?.length) {
      this.employeeOptionList = [
        ...(this.taskForm().employeeList || []).map(employee => employee.name),
      ];
    }
  };

  onClearProductionLineData = (): void => {
    const productionLine = { idProductionLine: 0, lineCode: '' };
    this.taskForm.update(current => ({ ...current, productionLine: productionLine }));
  };

  onClearTaskTypeData = (): void => {
    const taskType = { idTaskType: 0, name: '' };
    this.taskForm.update(current => ({ ...current, taskType: taskType }));
  };

  onClearEmployeeData = (): void => {
    const employee = { idEmployee: 0, name: '' };
    this.taskForm.update(current => ({ ...current, employee: employee }));
  };

  onClearProductData = (): void => {
    const product = {
      idProduct: 0,
      name: '',
      internalPartNumber: '',
      productType: {
        idProductType: 0,
        name: '',
      },
    };
    this.taskForm.update(current => ({ ...current, product: product }));
  };

  setTaskTypeValue = (taskTypeName: string): void => {
    this.onClearProductionLineData();
    this.onClearProductData();
    if (this.isDisabled().productionLine)
      this.isDisabled.update(current => ({ ...current, productionLine: false }));
    const taskType = this.taskForm().taskTypeList?.find(
      taskType => taskType.name == taskTypeName
    ) as ITaskType;
    this.taskForm.update(current => ({ ...current, taskType: taskType }));
    this.onFormFieldsChange('taskType');
  };

  setEmployeeValue = (employeeName: string): void => {
    const employee = this.taskForm().employeeList?.find(
      employee => employee.name == employeeName
    ) as IEmployeeHome;
    if (employeeName) {
      this.taskForm.update(current => ({ ...current, employee: employee }));
    } else {
      this.onClearEmployeeData();
    }
    this.onFormFieldsChange('employee');
  };

  setProductionLineValue = (productionLineName: string): void => {
    const productionLine = this.taskForm().productionLineList?.find(
      productionLine => productionLine.lineCode == productionLineName
    ) as IProductionLine;
    if (productionLineName) {
      this.taskForm.update(current => ({ ...current, productionLine: productionLine }));
    } else {
      this.onClearProductionLineData();
    }
    this.onFormFieldsChange('productionLine');
  };

  onSetProductionLineBasedOnToolingChange = (internalPartNumber = ''): void => {
    const foundProductionLine = this.taskForm().productionLineList?.find(pl =>
      pl.toolingList?.some(tool => {
        return tool.internalPartNumber == internalPartNumber;
      })
    );
    if (foundProductionLine && foundProductionLine.lineCode?.length > 0) {
      this.taskForm.update(current => ({ ...current, productionLine: foundProductionLine }));
      this.isDisabled.update(current => ({ ...current, productionLine: true }));
    } else {
      this.onClearProductionLineData();
      this.isDisabled.update(current => ({ ...current, productionLine: false }));
    }
  };

  onSetSelectedTooling = (tooling: string): void => {
    if ((this.taskForm().product?.internalPartNumber || '')?.length > 0) {
      this.onClearProductData();
    }
    let internalPartNumber = '';
    if (
      JSON.stringify(tooling && tooling.split(this.separatorSymbol)) == JSON.stringify([tooling])
    ) {
      internalPartNumber = tooling;
    } else {
      internalPartNumber = tooling.split(this.separatorSymbol)[0].trim();
    }
    this.taskForm().productList?.forEach(tool => {
      if (tool.internalPartNumber == internalPartNumber) {
        this.taskForm.update(current => ({ ...current, product: tool }));
      } else {
        if (this.taskForm().product) {
          const product = {
            ...this.taskForm().product,
            internalPartNumber: internalPartNumber,
          } as PartialProduct;
          this.taskForm.update(current => ({ ...current, product: product }));
        }
      }
    });
    this.onSetProductionLineBasedOnToolingChange(internalPartNumber);
    this.onFormFieldsChange('tooling');
  };

  setStatusValue = (status: string): void => {
    this.taskForm.update(current => ({ ...current, status: onTranslateStatusToNumber(status) }));
  };

  // onInputSparePartsChange = (inputValue: string, index: number): void => {
  //   this.onFormFieldsChange('usedSpareParts');
  //   this.onSetSparePartInputValue(inputValue, index);
  // };

  onFormFieldsChange = <K extends keyof IBorderType>(property: K, index?: number): void => {
    if (Array.isArray(this.borderType()[property])) {
      const currentArr = [...(this.borderType()[property] as ValidationType[])];
      const idx = typeof index === 'number' && index >= 0 ? index : 0;
      if (currentArr[idx] === 'failure') {
        currentArr[idx] = 'success';
        this.borderType.update(current => ({ ...current, [property]: currentArr }));
      }
    } else {
      if (this.borderType()[property] === 'failure') {
        this.borderType.update(current => ({
          ...current,
          [property]: 'success' as IBorderType[K],
        }));
      }
    }
  };

  onSetSparePartInputValue = (inputValue: string, index: number): void => {
    if (
      !inputValue.includes(this.separatorSymbol) ||
      (inputValue.includes(this.separatorSymbol) &&
        inputValue.split(this.separatorSymbol)[0].trim() == '') ||
      (inputValue.includes(this.separatorSymbol) &&
        inputValue.split(this.separatorSymbol)[1].trim() == '')
    ) {
      this.taskForm.update(form => ({
        ...form,
        usedSpareParts: form.usedSpareParts?.map((part, idx) =>
          idx === index ? { ...part, idProduct: 0, name: '', internalPartNumber: inputValue } : part
        ),
      }));
    } else {
      if (this.taskForm().usedSpareParts && this.taskForm().usedSpareParts != null) {
        let internalPartNumber = '';
        internalPartNumber = inputValue.split(this.separatorSymbol)[0].trim();
        const productsFilter = this.taskForm()?.productList || [];
        const selectedItem = productsFilter.find(
          sp => sp.internalPartNumber?.trim() == internalPartNumber.trim()
        ) as PartialProduct;
        if (selectedItem) {
          this.taskForm.update(form => ({
            ...form,
            usedSpareParts: form.usedSpareParts?.map((part, idx) =>
              idx === index
                ? {
                    ...part,
                    idProduct: selectedItem.idProduct ?? 0,
                    internalPartNumber: selectedItem.internalPartNumber ?? '',
                    name: selectedItem.name ?? '',
                  }
                : part
            ),
          }));
        } else {
          this.taskForm.update(form => ({
            ...form,
            usedSpareParts: form.usedSpareParts?.map((part, idx) =>
              idx === index ? { ...part, internalPartNumber: internalPartNumber } : part
            ),
          }));
        }
      }
    }
  };

  onInputValueChange = (inputValue: string, index: number): void => {
    this.taskForm.update(current => ({
      ...current,
      usedSpareParts: (current.usedSpareParts || []).map((part, i) =>
        i === index ? { ...part, internalPartNumber: inputValue } : part
      ),
    }));
  };

  onSparePartQtyChange = (value: string, index: number): void => {
    if (this.taskForm().usedSpareParts) {
      if (Number(value) < 1) {
        this.taskForm.update(form => ({
          ...form,
          usedSpareParts: form.usedSpareParts?.map((part, idx) =>
            idx === index ? { ...part, qty: 1 } : part
          ),
        }));
      } else {
        this.taskForm.update(form => ({
          ...form,
          usedSpareParts: form.usedSpareParts?.map((part, idx) =>
            idx === index ? { ...part, qty: Number(value) } : part
          ),
        }));
      }
    }
  };

  sparePartsIdx = -1;

  onShowSparePartsModalTable = (isActive: boolean, index?: number): void => {
    if (isActive) {
      this.sparePartsIdx = typeof index === 'number' && index >= 0 ? index : -1;
      this.modalSpareParts.update(current => ({ ...current, isModalActive: true }));
    } else {
      this.sparePartsIdx = -1;
      this.modalSpareParts.update(current => ({ ...current, isModalActive: false }));
    }
  };

  onToogleButtonChange = (isButtonActive: boolean): void => {
    this.showSpareParts.set(isButtonActive);
    if (
      isButtonActive &&
      (this.taskForm().usedSpareParts?.length == 0 || this.taskForm().usedSpareParts == null)
    ) {
      this.taskForm.update(current => ({ ...current, usedSpareParts: [] }));
      this.onAddSparePartsRow();
    }
  };

  onAddSparePartsRow = (): void => {
    const newRow: IUsedSpareParts = {
      idProduct: 0,
      internalPartNumber: '',
      name: '',
      qty: 1,
    };
    this.taskForm.update(current => ({
      ...current,
      usedSpareParts: [...(current.usedSpareParts || []), newRow],
    }));
    this.borderType.update(current => ({
      ...current,
      usedSpareParts: [...current.usedSpareParts, 'success'],
    }));
  };

  // onAddSparePartsRow = (): void => {
  //   this.taskForm().usedSpareParts?.push({
  //     idProduct: 0,
  //     internalPartNumber: '',
  //     name: '',
  //     qty: 1,
  //   });
  // };

  onRemoveSparePartsRow = (sparePart: IUsedSpareParts): void => {
    const index = this.taskForm().usedSpareParts?.indexOf(sparePart) as number;
    if (index && index < 0) return;
    const usedSpareParts = this.taskForm().usedSpareParts?.filter((sp, idx) => idx !== index) || [];
    this.taskForm.update(current => ({ ...current, usedSpareParts: usedSpareParts }));
    this.showSpareParts.set((this.taskForm().usedSpareParts as IUsedSpareParts[]).length > 0);
  };

  defineTitle = (): string => {
    if (this.paramsIdTask == 0) {
      return 'Novo Registro';
    } else {
      return this.taskForm().name as string;
    }
  };

  onFileListChange = (fileList: IPhoto[]): void => {
    this.taskForm.update(current => ({ ...current, imgPreviewList: fileList }));
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
    this.onRedirectPage(`/${this.paramsDeptName}/${this.currentView}`);
  };

  // onFormFieldsChange = <K extends keyof IBorderType>(property: K, index?: number): void => {
  //   if (Array.isArray(this.borderType()[property])) {
  //     if (this.borderType()[property][index || 0] == 'failure')
  //       this.borderType.update(current => ({ ...current, [property][index || 0]: 'success' }));
  //       // this.borderType()[property][index || 0] = 'success';
  //   } else {
  //     if (this.borderType()[property] == 'failure')
  //       this.borderType()[property] = 'success' as IBorderType[K];
  //   }
  // };

  onSetBorderTypeToDefault = (): void => {
    this.borderType.update(form => ({
      ...form,
      usedSpareParts: form.usedSpareParts.map(() => 'success'),
    }));
    this.borderType.update(current => ({
      ...current,
      name: 'success',
      employee: 'success',
      taskType: 'success',
      tooling: 'success',
      productionLine: 'success',
    }));
  };

  sparePartsMessage = '';

  formValidation = (): void => {
    this.onSetBorderTypeToDefault();
    let message = '';
    this.sparePartsMessage = '';
    if (this.finalTaskFormData.name == null || this.finalTaskFormData.name?.length < 3) {
      message = 'O campo Atividade precisa ter pelo menos 3 caracteres';
      this.borderType.update(current => ({ ...current, name: 'failure' }));
    } else if (
      this.finalTaskFormData.employee == null ||
      (this.finalTaskFormData.employee && this.finalTaskFormData.employee.name?.length < 1)
    ) {
      message = 'O campo Funcionário não pode estar vazio';
      this.borderType.update(current => ({ ...current, employee: 'failure' }));
    } else if (
      this.finalTaskFormData.taskType == null ||
      (this.finalTaskFormData.taskType && this.finalTaskFormData.taskType.name?.length < 1)
    ) {
      message = 'O campo Tipo de Atividade não pode estar vazio';
      this.borderType.update(current => ({ ...current, taskType: 'failure' }));
    } else if (
      this.eligibleTaskTypeOptionsForTooling.includes(this.taskForm().taskType?.name || '') &&
      (this.taskForm().product == null || this.taskForm().product?.idProduct == 0)
    ) {
      message = `O campo Ferramenta não pode estar vazio caso o campo Tipo de Atividade seja ${this.taskForm().taskType?.name}`;
      this.borderType().tooling = 'failure';
    } else if (
      this.eligibleTaskTypeOptionsForProductionLine.includes(
        this.taskForm().taskType?.name || ''
      ) &&
      (this.taskForm().productionLine == null ||
        this.taskForm().productionLine?.idProductionLine == 0)
    ) {
      message =
        'O campo Linha de Produção não pode estar vazio caso o campo Ferramenta esteja preenchido';
      this.borderType().productionLine = 'failure';
    } else {
      if (this.taskForm().usedSpareParts && (this.taskForm().usedSpareParts ?? [])?.length > 0) {
        (this.taskForm().usedSpareParts ?? []).forEach((sp, idx) => {
          if ((sp.internalPartNumber || '').length == 0) {
            message = 'Existem campos vazios em Peças trocadas';
            this.sparePartsMessage = 'Este campo não pode estar vazio';
            this.borderType().usedSpareParts[idx] = 'failure';
            this.onShowInfoModal(`Cadastro de ${this.currentViewTranslatedSingular}`, message);
            throw Error(message);
          }
        });
      }

      const uniques: string[] = [];
      const duplicates: string[] = [];
      (this.taskForm().usedSpareParts || []).forEach(sp => {
        if (uniques.includes(sp.internalPartNumber)) {
          duplicates.push(sp.internalPartNumber);
        } else {
          uniques.push(sp.internalPartNumber);
        }
        if (duplicates.length > 0) {
          const idxList: number[] = [];
          duplicates.forEach(d => {
            this.taskForm().usedSpareParts?.forEach((sp, idx) => {
              if (d == sp.internalPartNumber) {
                idxList.push(idx);
              }
            });
          });
          idxList.forEach(idx => {
            this.borderType().usedSpareParts[idx] = 'failure';
          });
          message = 'Existem campos duplicadas.';
          this.sparePartsMessage = 'Este campo está duplicado';
          this.onShowInfoModal(`Cadastro de ${this.currentViewTranslatedSingular}`, message);
          throw Error(message);
        }
      });

      // let hasInternalPartNumberMatch = true;
      // let hasNameMatch = true;
      // this.modalSpareParts().initialDataList.forEach(data => {
      //   hasInternalPartNumberMatch = (this.taskForm().usedSpareParts ?? [])?.every(sp =>
      //     (data.internalPartNumber ?? '')?.includes(sp.internalPartNumber)
      //   );
      // });
      // this.modalSpareParts().initialDataList.forEach(data => {
      //   hasNameMatch = (this.taskForm().usedSpareParts ?? [])?.every(sp =>
      //     (data.name ?? '')?.includes(sp.name)
      //   );
      // });
      // if (!hasInternalPartNumberMatch || !hasNameMatch) {
      //   message =
      //     'O item digitado no campo Troca de peças não bate com nenhum item da lista de opções';
      //   this.onShowInfoModal(`Cadastro de ${this.currentViewTranslatedSingular}`, message);
      //   throw Error(message);
      // }
    }
    if (message.length > 0) {
      this.onShowInfoModal(`Cadastro de ${this.currentViewTranslatedSingular}`, message);
      throw Error(message);
    }
  };

  onSetModalInfoType = (type: ModalType): void => {
    this.modalInfo.update(current => ({ ...current, type: type }));
  };

  onShowInfoModal = (title: string, description: string, onActionOk?: ActionCallback): void => {
    this.modalInfo.update(current => ({
      ...current,
      isActive: true,
      title: title,
      description: description,
      onActionOk: onActionOk,
    }));
  };

  onCloseInfoModal = async (): Promise<void> => {
    const callback = this.modalInfo().onActionOk;
    if (callback) await Promise.resolve(callback());
    this.modalInfo.update(current => ({
      ...current,
      isActive: false,
      onActionOk: null,
      type: 'failure',
    }));
  };

  onShowAskModal = (
    title: string,
    description: string,
    onActionOk?: ActionCallback,
    onActionNok?: ActionCallback
  ): void => {
    this.modalAsk.update(current => ({
      ...current,
      isActive: true,
      title: title,
      description: description,
      onActionOk: onActionOk,
      onActionNok: onActionNok,
    }));
  };

  onCloseAskModalAction = async (isConfirmed: boolean): Promise<void> => {
    const callback = isConfirmed ? this.modalAsk().onActionOk : this.modalAsk().onActionNok;
    if (callback) {
      await Promise.resolve(callback());
      this.modalInfo.update(current => ({
        ...current,
        type: 'success',
      }));
    }
    this.modalAsk.update(current => ({
      ...current,
      isActive: false,
      onActionOk: null,
      onActionNok: null,
    }));
  };

  onRedirectPage = (path: string): void => {
    this.router.navigate([path]);
  };

  finalTaskFormData: ITaskForm = {
    idTask: 0,
    usedSpareParts: [],
    startDate: null,
    finishDate: null,
    name: '',
    status: 0,
    comment: '',
    product: null,
    productionLine: null,
    taskType: null,
    employee: null,
  };

  setFinalTaskFormData = (): void => {
    this.finalTaskFormData = {
      idTask: this.taskForm().idTask,
      usedSpareParts: !this.showSpareParts ? [] : this.taskForm().usedSpareParts,
      startDate: this.taskForm().startDate,
      finishDate: this.taskForm().finishDate,
      name: this.taskForm().name,
      status: this.taskForm().status,
      comment: this.taskForm().comment,
      product: this.taskForm().product?.idProduct == 0 ? null : this.taskForm().product,
      productionLine:
        this.taskForm().productionLine?.idProductionLine == 0
          ? null
          : this.taskForm().productionLine,
      taskType: this.taskForm().taskType?.idTaskType == 0 ? null : this.taskForm().taskType,
      employee: this.taskForm().employee?.idEmployee == 0 ? null : this.taskForm().employee,
    };
    console.log('finalData', this.finalTaskFormData);
  };

  setFinalData = (): FormData => {
    const formData = new FormData();
    this.setFinalTaskFormData();
    if (this.taskForm().imgPreviewList) {
      if (this.taskForm().imgPreviewList && this.taskForm().imgPreviewList != null) {
        this.taskForm().imgPreviewList?.forEach(photo => {
          const file = photo.file;
          if (file) {
            formData.append('files', file, photo.file?.name);
          } else {
            formData.append('files', `${photo.idPhoto}`);
          }
        });
      }
    }
    formData.append('data', JSON.stringify(this.finalTaskFormData));
    return formData;
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    // const formData = this.setFinalData();
    try {
      this.isLoading.set(true);
      const formData = this.setFinalData();
      this.formValidation();
      const response = await this.taskApi.onSave(this.paramsDeptName, formData);
      if (response.status) {
        this.onSetModalInfoType('success');
        this.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslatedSingular}`,
          response.message,
          onActionOk
        );
      } else {
        this.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslatedSingular}`,
          response.error?.message || ''
        );
      }
      this.cdr.markForCheck();
    } catch (e: unknown) {
      if (e instanceof HttpErrorResponse) {
        const error = e as HttpErrorResponse;
        this.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslated}`,
          error.error?.message || 'Erro desconhecido'
        );
      } else {
        this.onShowInfoModal(`Cadastro de ${this.currentViewTranslated}`, (e as Error).message);
      }
    } finally {
      this.isLoading.set(false);
    }
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.toolingCache.clear();
    this.sparePartsCache.clear();
  }
}
