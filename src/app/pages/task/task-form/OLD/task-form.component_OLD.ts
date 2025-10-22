// import { CommonModule } from '@angular/common';
// import { HttpErrorResponse } from '@angular/common/http';
// import {
//   AfterViewInit,
//   ChangeDetectorRef,
//   Component,
//   ElementRef,
//   inject,
//   OnDestroy,
//   OnInit,
//   QueryList,
//   ViewChildren,
// } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
// import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
// import { ButtonDeleteComponent } from '@components/button/button-delete/button-delete.component';
// import { ButtonIconComponent } from '@components/button/button-icon/button-icon.component';
// import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
// import { HelpComponent } from '@components/help/help.component';
// import { InputComponent } from '@components/input/input.component';
// import { ModalBaseComponent } from '@components/modal/modal-base/modal-base.component';
// import { PaginationComponent } from '@components/pagination/pagination.component';
// import { PhotoBoxListComponent } from '@components/photo-box/photo-box-list/photo-box-list.component';
// import { SelectComponent } from '@components/select/select.component';
// import { TableComponent } from '@components/table/table.component';
// import { TextAreaComponent } from '@components/text-area/text-area.component';
// import { ToogleButtonComponent } from '@components/toogle-button/toogle-button.component';
// import {
//   onConvertTaskStatusToNumber,
//   onStringfyTaskStatus as onConvertTaskStatusFromNumberToFriendlyName,
//   TASK_NUMBER_STATUS,
// } from '@core/enum/status.enum';
// import { ProductApi } from '@core/http/product/product.api';
// import { TaskApi } from '@core/http/task/task.api';
// import { IEmployee, PartialEmployee } from '@core/interfaces/employee.interface';
// import { ActionCallback } from '@core/interfaces/modal.interface';
// import { IPhoto } from '@core/interfaces/photo.interface';
// import { PartialProduct } from '@core/interfaces/product.interface';
// import { IProductionLine, PartialProductionLine } from '@core/interfaces/production-line.interface';
// import { ITableHeader } from '@core/interfaces/table.interface';
// import {
//   ITaskType,
//   PartialTaskType,
//   IUsedSpareParts,
//   ITaskForm,
// } from '@core/interfaces/task.interface';
// import { BaseApiName, KeyOfData } from '@core/types/base.type';
// import { ValidationType } from '@core/types/validation.type';
// import { dateAndHourFormatted, loadStorage } from '@core/utils/misc';
// import { AuthStore } from '@store/auth/auth.store';
// import { BaseRegisterStore, defaultTableHeaderIcon } from '@store/base/base.register.store';
// import { ModalStore } from '@store/modal/modal.store';
// import { Subscription } from 'rxjs';

// interface IDisabled {
//   idTask: boolean;
//   name: boolean;
//   startDate: boolean;
//   finishDate: boolean;
//   status: boolean;
//   usedSpareParts: boolean;
//   comment: boolean;
//   employee: boolean;
//   taskType: boolean;
//   tooling: boolean;
//   productionLine: boolean;
//   saveButton: boolean;
//   photoBoxList: boolean;
// }

// interface IBorderType {
//   name: ValidationType;
//   usedSpareParts: ValidationType[];
//   employee: ValidationType;
//   taskType: ValidationType;
//   tooling: ValidationType;
//   productionLine: ValidationType;
// }

// @Component({
//   selector: 'app-task-form',
//   imports: [
//     BreadcrumbComponent,
//     CommonModule,
//     ButtonLabelComponent,
//     FormsModule,
//     InputComponent,
//     SelectComponent,
//     TextAreaComponent,
//     PhotoBoxListComponent,
//     ToogleButtonComponent,
//     ButtonIconComponent,
//     ButtonDeleteComponent,
//     ModalBaseComponent,
//     TableComponent,
//     ButtonCloseComponent,
//     PaginationComponent,
//     HelpComponent,
//   ],
//   templateUrl: './task-form.component.html',
//   styleUrl: './task-form.component.scss',
// })
// export class TaskFormComponent implements OnInit, OnDestroy, AfterViewInit {
//   @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
//   @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
//   readonly taskApi = inject(TaskApi);
//   readonly baseRegisterStore = inject(BaseRegisterStore);
//   private activatedRoute = inject(ActivatedRoute);
//   readonly router = inject(Router);
//   readonly authStore = inject(AuthStore);
//   readonly modalStore = inject(ModalStore);
//   readonly productApi = inject(ProductApi);

//   private cdr = inject(ChangeDetectorRef);

//   currentView: BaseApiName = 'tasks';
//   currentViewTranslated = 'Atividades';
//   currentViewTranslatedSingular = this.currentViewTranslated.slice(0, -1);
//   subscription: Subscription | undefined = undefined;
//   breadcrumbList: string[] = [];
//   modalBreadcrumbList: string[] = [];
//   paramsDeptName = '';
//   paramsIdTask: number | null = null;
//   taskStatus = '';
//   idCompany = 1;
//   readonly inputSearchPlaceholder = 'Id, PN interno, Nome';
//   readonly inputSearchFilterList: KeyOfData[] = [
//     'idProduct',
//     'internalPartNumber',
//     'customerPartNumber',
//     'name',
//   ];
//   tableHeadersLocalStorageId = `table_headers_modal_${this.currentView}_${this.authStore.user().id}`;
//   readonly initialTableHeaders = [
//     {
//       id: 0,
//       isHeaderActive: true,
//       sortDirection: 0,
//       icon: defaultTableHeaderIcon,
//       headerName: 'Id',
//       databaseField: 'idProduct',
//     },
//     {
//       id: 1,
//       isHeaderActive: true,
//       sortDirection: 0,
//       icon: defaultTableHeaderIcon,
//       headerName: 'PN interno',
//       databaseField: 'internalPartNumber',
//     },
//     {
//       id: 2,
//       isHeaderActive: true,
//       sortDirection: 0,
//       icon: defaultTableHeaderIcon,
//       headerName: 'Nome',
//       databaseField: 'name',
//     },
//   ] as ITableHeader<PartialProduct>[];

//   eligibleTaskTypeOptionsForTooling: string[] = ['Ferramenta'];
//   eligibleTaskTypeOptionsForProductionLine: string[] = ['Ferramenta', 'Corretiva', 'Preventiva'];

//   toolingOptionList: string[] = [];
//   taskTypeOptionList: string[] = [];
//   productionLineOptionList: string[] = [];
//   employeeOptionList: string[] = [];
//   usedSparePartsOptionList: string[] = [];

//   separatorSymbol = '_';
//   sparePartsProductType = 'Despesa';
//   toolingProductType = 'Ativo';

//   isDisabled: IDisabled = {
//     idTask: true,
//     name: false,
//     startDate: true,
//     finishDate: true,
//     status: false,
//     usedSpareParts: false,
//     comment: false,
//     employee: false,
//     taskType: false,
//     tooling: false,
//     productionLine: false,
//     saveButton: false,
//     photoBoxList: false,
//   };

//   borderType: IBorderType = {
//     name: 'success',
//     usedSpareParts: [],
//     employee: 'success',
//     taskType: 'success',
//     tooling: 'success',
//     productionLine: 'success',
//   };

//   modalForm = {
//     isActive: false,
//     modalType: '',
//     isBtnDisabled: true,
//     sparePartsIdx: 0,
//   };

//   modalItemList: boolean[] = [];

//   // Cache para otimização de performance
//   private productListCache = new Map<string, string[]>();

//   showSpareParts = false;
//   startDate = '';
//   finishDate = '';

//   taskFormData: ITaskForm = {
//     idTask: 0,
//     startDate: null,
//     finishDate: null,
//     name: '',
//     usedSpareParts: [
//       {
//         idProduct: 0,
//         internalPartNumber: '',
//         name: '',
//         qty: 1,
//       },
//     ],
//     status: TASK_NUMBER_STATUS.NOT_STARTED,
//     comment: '',
//     imgPreviewList: [],
//     productList: [],
//     product: {
//       idProduct: 0,
//       internalPartNumber: '',
//       name: '',
//       productType: {
//         idProductType: 0,
//         name: '',
//       },
//     },
//     productionLineList: [],
//     productionLine: {
//       idProductionLine: 0,
//       lineCode: '',
//       toolingList: [],
//     },
//     taskTypeList: [],
//     taskType: {
//       idTaskType: 0,
//       name: '',
//     },
//     employeeList: [],
//     employee: {
//       idEmployee: 0,
//       name: '',
//     },
//   };

//   async ngOnInit(): Promise<void> {
//     this.subscription = this.activatedRoute.paramMap.subscribe(params => {
//       this.paramsIdTask = Number(params.get('idTask')) || 0;
//       this.paramsDeptName = params.get('department') || '';
//     });
//     const response = await this.taskApi.onGetDataById(
//       this.paramsDeptName,
//       this.paramsIdTask as number
//     );
//     const taskData = response.data as ITaskForm;
//     this.taskFormData = {
//       ...taskData,
//       startDate: taskData.startDate ? new Date(taskData.startDate) : null,
//       finishDate: taskData.finishDate ? new Date(taskData.finishDate) : null,
//     };
//     if (this.taskFormData.usedSpareParts) {
//       this.showSpareParts = this.taskFormData.usedSpareParts.length > 0;
//     }
//     this.onSetStartAndFinishDate();
//     this.onSetOptionsList();
//     this.taskStatus = onConvertTaskStatusFromNumberToFriendlyName(
//       this.taskFormData.status as number
//     );
//     // this.onDisabledStatusOptions();
//     // if (this.taskFormData.status == TASK_NUMBER_STATUS.FINISHED) {
//     // this.onDisbledForm();
//     // }
//     const tableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
//     const headers = tableHeaders ? tableHeaders : this.initialTableHeaders;
//     this.baseRegisterStore.onSetSlicePropsToNewValue('tableHeaders', headers);
//     this.defineTitle();
//     this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
//     this.cdr.markForCheck();
//   }

//   onDisbledForm = (): void => {
//     (Object.keys(this.isDisabled) as (keyof IDisabled)[]).forEach(key => {
//       this.isDisabled[key] = true;
//     });
//   };

//   onSetStartAndFinishDate = (): void => {
//     if (this.taskFormData.startDate) {
//       this.startDate = dateAndHourFormatted(this.taskFormData.startDate);
//     }
//     if (this.taskFormData.finishDate) {
//       this.finishDate = dateAndHourFormatted(this.taskFormData.finishDate);
//     }
//   };

//   onDisabledStatusOptions = (): void => {
//     this.isDisabled.status = this.taskFormData.status == TASK_NUMBER_STATUS.NOT_STARTED;
//   };

//   onFilterProductList = (value: string): string[] => {
//     // Verifica cache primeiro
//     if (this.productListCache.has(value)) {
//       return this.productListCache.get(value)!;
//     }

//     const productsFilter = this.taskFormData.productList
//       ? (this.taskFormData.productList?.filter(
//           p => p.productType.name == value
//         ) as PartialProduct[])
//       : [];

//     const result = productsFilter.map(
//       product => `${product.internalPartNumber}${this.separatorSymbol}${product.name}`
//     );

//     // Armazena no cache
//     this.productListCache.set(value, result);
//     return result;
//   };

//   onSetOptionsList = (): void => {
//     // Cache para evitar recálculos desnecessários
//     if (this.taskFormData.usedSpareParts?.length) {
//       this.usedSparePartsOptionList = this.taskFormData.usedSpareParts.map(
//         sp => `${sp.internalPartNumber}${this.separatorSymbol}${sp.name}`
//       );
//     }

//     this.toolingOptionList = this.onFilterProductList(this.toolingProductType);
//     this.usedSparePartsOptionList = this.onFilterProductList(this.sparePartsProductType);

//     if (this.taskFormData?.taskTypeList?.length) {
//       this.taskTypeOptionList = this.taskFormData.taskTypeList.map(taskType => taskType.name);
//     }

//     if (this.taskFormData?.productionLineList?.length) {
//       this.productionLineOptionList = this.taskFormData.productionLineList.map(pl => pl.lineCode);
//     }

//     if (this.taskFormData?.employeeList?.length) {
//       this.employeeOptionList = this.taskFormData.employeeList.map(employee => employee.name);
//     }
//   };

//   onClearProductionLineData = (): void => {
//     this.taskFormData.productionLine = {
//       idProductionLine: 0,
//       lineCode: '',
//     } as PartialProductionLine;
//   };

//   onClearTaskTypeData = (): void => {
//     this.taskFormData.taskType = {
//       idTaskType: 0,
//       name: '',
//     } as PartialTaskType;
//   };

//   onClearEmployeeData = (): void => {
//     this.taskFormData.employee = {
//       idEmployee: 0,
//       name: '',
//     } as PartialEmployee;
//   };

//   onClearProductData = (): void => {
//     this.taskFormData.product = {
//       idProduct: 0,
//       name: '',
//       internalPartNumber: '',
//       productType: {
//         idProductType: 0,
//         name: '',
//       },
//     } as PartialProduct;
//   };

//   setTaskTypeValue = (taskTypeName: string): void => {
//     this.onClearProductionLineData();
//     this.onClearProductData();
//     if (this.isDisabled.productionLine) this.isDisabled.productionLine = false;
//     const taskType = this.taskFormData.taskTypeList?.find(
//       taskType => taskType.name == taskTypeName
//     ) as ITaskType;
//     this.taskFormData.taskType = taskType;
//     this.onFormFieldsChange('taskType');
//   };

//   setEmployeeValue = (employeeName: string): void => {
//     const employee = this.taskFormData.employeeList?.find(
//       employee => employee.name == employeeName
//     ) as IEmployee;
//     if (employeeName) {
//       this.taskFormData.employee = employee;
//     } else {
//       this.onClearEmployeeData();
//     }
//     this.onFormFieldsChange('employee');
//   };

//   setProductionLineValue = (productionLineName: string): void => {
//     const productionLine = this.taskFormData.productionLineList?.find(
//       productionLine => productionLine.lineCode == productionLineName
//     ) as IProductionLine;
//     if (productionLineName) {
//       this.taskFormData.productionLine = productionLine;
//     } else {
//       this.onClearProductionLineData();
//     }
//     this.onFormFieldsChange('productionLine');
//   };

//   onSetProductionLineBasedOnToolingChange = (internalPartNumber = ''): void => {
//     const foundProductionLine = this.taskFormData.productionLineList?.find(pl =>
//       pl.toolingList?.some(tool => {
//         return tool.internalPartNumber == internalPartNumber;
//       })
//     );
//     if (foundProductionLine && foundProductionLine.lineCode?.length > 0) {
//       this.taskFormData.productionLine = foundProductionLine as IProductionLine;
//       this.isDisabled.productionLine = true;
//     } else {
//       this.onClearProductionLineData();
//       this.isDisabled.productionLine = false;
//     }
//   };

//   onSetSelectedTooling = (tooling: string): void => {
//     if ((this.taskFormData.product?.internalPartNumber || '')?.length > 0) {
//       this.onClearProductData();
//     }
//     let internalPartNumber = '';
//     if (
//       JSON.stringify(tooling && tooling.split(this.separatorSymbol)) == JSON.stringify([tooling])
//     ) {
//       internalPartNumber = tooling;
//     } else {
//       internalPartNumber = tooling.split(this.separatorSymbol)[0].trim();
//     }
//     this.taskFormData.productList?.forEach(tool => {
//       if (tool.internalPartNumber == internalPartNumber) {
//         this.taskFormData.product = tool;
//       } else {
//         if (this.taskFormData.product) {
//           this.taskFormData.product.internalPartNumber = internalPartNumber;
//         }
//       }
//     });
//     this.onSetProductionLineBasedOnToolingChange(internalPartNumber);
//     this.onFormFieldsChange('tooling');
//   };

//   setStatusValue = (status: string): void => {
//     this.taskFormData.status = onConvertTaskStatusToNumber(status);
//   };

//   onSparePartInputChange = (inputValue: string, index: number): void => {
//     let internalPartNumber = '';
//     if (
//       JSON.stringify(inputValue && inputValue.split(this.separatorSymbol)) ==
//       JSON.stringify([inputValue])
//     ) {
//       internalPartNumber = inputValue;
//     } else {
//       internalPartNumber = inputValue.split(this.separatorSymbol)[0].trim();
//     }
//     if (this.taskFormData.usedSpareParts) {
//       const productsFilter = this.taskFormData.productList
//         ? (this.taskFormData.productList?.filter(
//             p =>
//               p.productType.name.toLocaleLowerCase().trim() ==
//               this.sparePartsProductType.toLowerCase().trim()
//           ) as PartialProduct[])
//         : [];
//       const selectedItem = productsFilter.find(
//         sp => sp.internalPartNumber?.trim() == internalPartNumber.trim()
//       ) as PartialProduct;
//       if (selectedItem) {
//         this.taskFormData.usedSpareParts[index].idProduct = selectedItem.idProduct as number;
//         this.taskFormData.usedSpareParts[index].internalPartNumber =
//           selectedItem.internalPartNumber as string;
//         this.taskFormData.usedSpareParts[index].name = selectedItem.name;
//       } else {
//         this.taskFormData.usedSpareParts[index].internalPartNumber = internalPartNumber;
//       }
//     }
//   };

//   onSparePartQtyChange = (value: string, index: number): void => {
//     if (this.taskFormData.usedSpareParts) {
//       if (Number(value) < 1) {
//         this.taskFormData.usedSpareParts[index].qty = 1;
//       } else {
//         this.taskFormData.usedSpareParts[index].qty = Number(value);
//       }
//     }
//   };

//   onToogleButtonChange = (isButtonActive: boolean): void => {
//     this.showSpareParts = isButtonActive;
//     if (
//       isButtonActive &&
//       (this.taskFormData.usedSpareParts?.length == 0 || this.taskFormData.usedSpareParts == null)
//     ) {
//       this.taskFormData.usedSpareParts = [];
//       this.onAddSparePartsRow();
//     }
//   };

//   onAddSparePartsRow = (): void => {
//     this.taskFormData.usedSpareParts?.push({
//       idProduct: 0,
//       internalPartNumber: '',
//       name: '',
//       qty: 1,
//     });
//   };

//   onRemoveSparePartsRow = (sparePart: IUsedSpareParts): void => {
//     const index = this.taskFormData.usedSpareParts?.indexOf(sparePart) as number;
//     if (index && index < 0) return;
//     this.taskFormData.usedSpareParts?.splice(index, 1);
//     this.showSpareParts = (this.taskFormData.usedSpareParts as IUsedSpareParts[]).length > 0;
//   };

//   defineTitle = (): string => {
//     if (this.paramsIdTask == 0) {
//       return 'Novo Registro';
//     } else {
//       return this.taskFormData.name as string;
//     }
//   };

//   onFileListChange = (fileList: IPhoto[]): void => {
//     this.taskFormData.imgPreviewList = fileList;
//   };

//   ngAfterViewInit(): void {
//     this.onDefineInputId();
//     this.cdr.detectChanges();
//   }

//   onDefineInputId = () => {
//     this.inputs.forEach((input, index) => {
//       input.id = `${this.currentView}-form-${index}`;
//       this.labels.get(index)?.nativeElement.setAttribute('for', input.id);
//     });
//   };

//   onBackToPreviousPage = (): void => {
//     this.baseRegisterStore.onClearData();
//     this.modalStore.onRedirectPage(`/${this.paramsDeptName}/${this.currentView}`);
//   };

//   onCreateBooleanListFromDataList = (): void => {
//     const dataListLength = this.baseRegisterStore.dataList().length;
//     // Só recria se o tamanho mudou
//     if (this.modalItemList.length !== dataListLength) {
//       this.modalItemList = new Array(dataListLength).fill(false);
//     }
//   };

//   onActionOkModalForm = (): void => {
//     if (this.modalForm.modalType == this.toolingProductType) {
//       this.onSetProductionLineBasedOnToolingChange(
//         this.taskFormData.product?.internalPartNumber || ''
//       );
//     }
//     this.modalForm.isActive = false;
//   };

//   onActionNokModalForm = (): void => {
//     if (this.modalForm.modalType == this.toolingProductType) {
//       this.onSetProductionLineBasedOnToolingChange();
//     }
//     this.modalForm.isActive = false;
//   };

//   onSetTableItem = (data: PartialProduct): void => {
//     if (this.modalForm.modalType == this.toolingProductType) {
//       if (data) {
//         this.taskFormData.product = data;
//       } else {
//         this.onClearProductData();
//       }
//     } else {
//       if (data && this.taskFormData.usedSpareParts) {
//         this.taskFormData.usedSpareParts[this.modalForm.sparePartsIdx].idProduct =
//           data.idProduct || 0;
//         this.taskFormData.usedSpareParts[this.modalForm.sparePartsIdx].internalPartNumber =
//           data.internalPartNumber || '';
//         this.taskFormData.usedSpareParts[this.modalForm.sparePartsIdx].name = data.name || '';
//       } else {
//         this.taskFormData.usedSpareParts = [];
//       }
//     }
//   };

//   onModalItemChange = (list: boolean[]): void => {
//     if (list.some(item => item == true)) {
//       this.modalForm.isBtnDisabled = false;
//     } else {
//       this.modalForm.isBtnDisabled = true;
//     }
//   };

//   onShowModalForm = (type: string, sparePartIdx?: number): void => {
//     this.modalForm.modalType = type;
//     if (this.modalForm.modalType == this.sparePartsProductType) {
//       this.modalForm.sparePartsIdx = sparePartIdx as number;
//     }
//     this.modalBreadcrumbList = ['Produtos', 'Selecione um item'];
//     const sparePartsList = this.taskFormData.productList
//       ? (this.taskFormData.productList?.filter(
//           p => p.productType.name == this.modalForm.modalType
//         ) as PartialProduct[])
//       : [];
//     this.baseRegisterStore.onSetSlicePropsToNewValue(
//       'initialData',
//       sparePartsList as PartialProduct[]
//     );
//     this.baseRegisterStore.onSetSlicePropsToNewValue(
//       'dataList',
//       sparePartsList as PartialProduct[]
//     );
//     this.onCreateBooleanListFromDataList();
//     this.baseRegisterStore.onClearData(sparePartsList);
//     this.modalForm.isActive = true;
//   };

//   onFormFieldsChange = <K extends keyof IBorderType>(property: K, index?: number): void => {
//     if (Array.isArray(this.borderType[property])) {
//       if (this.borderType[property][index || 0] == 'failure')
//         this.borderType[property][index || 0] = 'success';
//     } else {
//       if (this.borderType[property] == 'failure')
//         this.borderType[property] = 'success' as IBorderType[K];
//     }
//   };

//   onSetBorderTypeToDefault = (): void => {
//     this.borderType.name = 'success';
//     this.borderType.usedSpareParts = [];
//     this.borderType.employee = 'success';
//     this.borderType.taskType = 'success';
//     this.borderType.tooling = 'success';
//     this.borderType.productionLine = 'success';
//   };

//   formValidation = (): void => {
//     this.onSetBorderTypeToDefault();
//     ('finalData', this.finalTaskFormData);
//     let message = '';
//     if (
//       this.finalTaskFormData.name == null ||
//       (this.finalTaskFormData.name && this.finalTaskFormData.name?.length < 3)
//     ) {
//       message = 'O campo Atividade precisa ter pelo menos 3 caracteres';
//       this.borderType.name = 'failure';
//     } else if (
//       this.finalTaskFormData.employee == null ||
//       (this.finalTaskFormData.employee && this.finalTaskFormData.employee.name?.length < 1)
//     ) {
//       message = 'O campo Funcionário não pode estar vazio';
//       this.borderType.employee = 'failure';
//     } else if (
//       this.finalTaskFormData.taskType == null ||
//       (this.finalTaskFormData.taskType && this.finalTaskFormData.taskType.name?.length < 1)
//     ) {
//       message = 'O campo Tipo de Atividade não pode estar vazio';
//       this.borderType.taskType = 'failure';
//     } else if (
//       this.eligibleTaskTypeOptionsForTooling.includes(this.taskFormData.taskType?.name || '') &&
//       this.taskFormData.product == null
//     ) {
//       message = `O campo Ferramenta não pode estar vazio caso o campo Tipo de Atividade seja ${this.taskFormData.taskType?.name}`;
//       this.borderType.tooling = 'failure';
//     } else if (
//       this.eligibleTaskTypeOptionsForProductionLine.includes(
//         this.taskFormData.taskType?.name || ''
//       ) &&
//       this.taskFormData.productionLine == null
//     ) {
//       message =
//         'O campo Linha de Produção não pode estar vazio caso o campo Ferramenta esteja preenchido';
//       this.borderType.productionLine = 'failure';
//     } else {
//       if (this.taskFormData.usedSpareParts) {
//         const uniques: IUsedSpareParts[] = [];
//         const duplicates: IUsedSpareParts[] = [];
//         this.taskFormData.usedSpareParts.forEach((sp, idx) => {
//           if (uniques.includes(sp)) {
//             duplicates.push(sp);
//             this.borderType.usedSpareParts[idx] = 'failure';
//           } else {
//             uniques.push(sp);
//           }
//         });
//         if (duplicates.length > 0) {
//           message = 'Existem peças trocadas duplicadas.';
//         }
//       }
//     }
//     if (message.length > 0) {
//       this.modalStore.onShowInfoModal(`Cadastro de ${this.currentViewTranslatedSingular}`, message);
//       throw Error(message);
//     }
//   };

//   finalTaskFormData: ITaskForm = {
//     idTask: 0,
//     usedSpareParts: [],
//     startDate: null,
//     finishDate: null,
//     name: '',
//     status: 0,
//     comment: '',
//     product: null,
//     productionLine: null,
//     taskType: null,
//     employee: null,
//   };

//   setFinalTaskFormData = (): void => {
//     this.finalTaskFormData = {
//       idTask: this.taskFormData.idTask,
//       usedSpareParts: !this.showSpareParts ? [] : this.taskFormData.usedSpareParts,
//       startDate: this.taskFormData.startDate,
//       finishDate: this.taskFormData.finishDate,
//       name: this.taskFormData.name,
//       status: this.taskFormData.status,
//       comment: this.taskFormData.comment,
//       product: this.taskFormData.product?.idProduct == 0 ? null : this.taskFormData.product,
//       productionLine:
//         this.taskFormData.productionLine?.idProductionLine == 0
//           ? null
//           : this.taskFormData.productionLine,
//       taskType: this.taskFormData.taskType?.idTaskType == 0 ? null : this.taskFormData.taskType,
//       employee: this.taskFormData.employee?.idEmployee == 0 ? null : this.taskFormData.employee,
//     };
//     console.log('finalData', this.finalTaskFormData);
//   };

//   setFinalData = (): FormData => {
//     const formData = new FormData();
//     this.setFinalTaskFormData();
//     if (this.taskFormData.imgPreviewList) {
//       this.taskFormData.imgPreviewList.forEach(photo => {
//         const file = photo.file;
//         if (file) {
//           formData.append('files', file, 'new');
//         } else {
//           formData.append('files', `${photo.idPhoto}`);
//         }
//       });
//     }
//     formData.append('data', JSON.stringify(this.finalTaskFormData));
//     return formData;
//   };

//   onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
//     // const formData = this.setFinalData();
//     try {
//       this.modalStore.onLoading(true);
//       const formData = this.setFinalData();
//       this.formValidation();
//       const response = await this.taskApi.onSave(this.paramsDeptName, formData);
//       if (response.status) {
//         this.modalStore.onSetModalInfoType('success');
//         this.modalStore.onShowInfoModal(
//           `Cadastro de ${this.currentViewTranslatedSingular}`,
//           response.message,
//           onActionOk
//         );
//       } else {
//         this.modalStore.onShowInfoModal(
//           `Cadastro de ${this.currentViewTranslatedSingular}`,
//           response.error?.message || ''
//         );
//       }
//     } catch (e: unknown) {
//       console.log('error', e);
//       if (e instanceof HttpErrorResponse) {
//         const error = e as HttpErrorResponse;
//         this.modalStore.onShowInfoModal(
//           `Cadastro de ${this.currentViewTranslated}`,
//           error.error?.message || 'Erro desconhecido'
//         );
//       } else {
//         this.modalStore.onShowInfoModal(
//           `Cadastro de ${this.currentViewTranslated}`,
//           (e as Error).message
//         );
//       }
//     } finally {
//       this.modalStore.onLoading(false);
//     }
//   };

//   ngOnDestroy() {
//     this.subscription?.unsubscribe();
//     // Limpa cache para evitar memory leaks
//     this.productListCache.clear();
//   }

//   // TrackBy functions para otimizar performance
//   trackByIndex = (index: number): number => index;
//   trackBySparePartId = (index: number, sparePart: any): string => {
//     // Cria uma chave única combinando idProduct e index para evitar duplicatas
//     return `${sparePart.idProduct || 'no-id'}-${index}`;
//   };
// }
