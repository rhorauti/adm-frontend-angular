import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  computed,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { SideBarComponent } from '@components/side-bar/side-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { ButtonDeleteComponent } from '@components/button/button-delete/button-delete.component';
import { ButtonIconComponent } from '@components/button/button-icon/button-icon.component';
import { TooltipComponent } from '@components/tooltip/tooltip.component';
import { ToogleButtonComponent } from '@components/toogle-button/toogle-button.component';
import { InputComponent } from '@components/input/input.component';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { ModalType } from '@store/modal/modal.store';
import { AuthStore } from '@store/auth/auth.store';
import { dateAndHourFormatted, loadStorage, saveStorage } from '@core/utils/misc';
import { defaultTableHeaderIcon } from '@store/base/base.register.store';
import { ActionCallback, IModalAsk, IModalInfo } from '@core/interfaces/modal.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { KeyOfData } from '@core/types/base.type';
import { ITaskFilterHelp, ITaskHomeData } from '@core/interfaces/task.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskApi } from '@core/http/task/task.api';
import { onTranslateStatusToString, TASK_NUMBER_STATUS } from 'app/enum/status.enum';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { TableComponent } from '@components/table/table.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { ITableHeader } from '@core/interfaces/table.interface';
import { DEPT_NAMES_ENGLISH, translateDeptNameToLocalLanguage } from 'app/enum/department.enum';
import { start } from 'repl';

type Property = 'data' | 'filterBox' | 'filterHelp';

@Component({
  selector: 'app-task-home',
  imports: [
    CommonModule,
    SideBarComponent,
    InputComponent,
    TableComponent,
    PaginationComponent,
    BreadcrumbComponent,
    MatIconModule,
    ButtonLabelComponent,
    ButtonDeleteComponent,
    ButtonIconComponent,
    TooltipComponent,
    ToogleButtonComponent,
    ButtonCloseComponent,
    ModalAskComponent,
    ModalInfoComponent,
    LoadingComponent,
  ],
  templateUrl: './task-home.component.html',
  styleUrl: './task-home.component.scss',
})
export class TaskHomeComponent implements OnInit, OnDestroy {
  readonly taskApi = inject(TaskApi);
  readonly router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  readonly authStore = inject(AuthStore);

  subscription: Subscription | undefined = undefined;

  readonly currentView = 'tasks';
  readonly breadcrumbList = ['Cadastro', 'Atividades'];
  readonly inputSearchFilterList: KeyOfData[] = [
    'idTask',
    'name',
    'employee',
    'startDate',
    'finishDate',
    'taskType',
    'product',
    'productionLine',
    'status',
  ];
  readonly inputSearchPlaceholder = 'Id, Atividade, etc';
  tableHeadersLocalStorageId = `table_headers_${this.currentView}_${this.authStore.user().id}`;
  deptName = '' as DEPT_NAMES_ENGLISH;
  deptNameTranslated = translateDeptNameToLocalLanguage(this.deptName);

  isCopiedData = signal(false);
  isEditData = signal(false);
  inputSearchValue = signal('');
  isTableHeaderBoxActive = signal(false);
  tableHeaders = signal<ITableHeader<ITaskHomeData>[]>([
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idTask',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Funcionário',
      databaseField: 'employee',
    },
    {
      id: 2,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Atividade',
      databaseField: 'name',
    },
    {
      id: 3,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Início',
      databaseField: 'startDate',
    },
    {
      id: 4,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Fim',
      databaseField: 'finishDate',
    },
    {
      id: 5,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Tipo',
      databaseField: 'taskType',
    },
    {
      id: 6,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Status',
      databaseField: 'status',
    },
  ]);
  data = signal<ITaskHomeData>({
    idTask: 0,
    employee: '',
    startDate: '',
    finishDate: '',
    name: '',
    status: TASK_NUMBER_STATUS.NOT_STARTED,
    taskType: '',
    product: '',
    productionLine: '',
  });
  dataList = signal<ITaskHomeData[]>([]);
  initialData = signal<ITaskHomeData[]>([]);
  isDelBtnDisabled = signal(true);
  isFilterBoxActive = signal(false);
  isFilterResultZeroRegister = signal(false);
  filterBox = signal<ITaskHomeData>({
    idTask: 0,
    employee: '',
    name: '',
    startDate: '',
    finishDate: '',
    status: TASK_NUMBER_STATUS.NOT_STARTED,
    taskType: '',
    product: '',
    productionLine: '',
  });
  filterHelp = signal<ITaskFilterHelp>({
    inputSearch: '',
    idTask: 0,
    employee: '',
    startDate: '',
    finishDate: '',
    name: '',
    status: TASK_NUMBER_STATUS.NOT_STARTED,
    taskType: '',
    product: '',
    productionLine: '',
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

  filterDateInterval = signal({
    startDateFrom: '',
    startDateTo: '',
    finishDateTo: '',
    finishDateFrom: '',
  });

  isLoading = signal(false);

  trackByHeaderId = (_: number, header: any): number => header.id;
  trackByIndex = (index: number): number => index;

  async ngOnInit() {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.deptName =
        (params.get('department') as DEPT_NAMES_ENGLISH) || DEPT_NAMES_ENGLISH.MAINTENANCE;
    });
    this.onShowDataList();
    const selectedTableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
    const headers = selectedTableHeaders ? selectedTableHeaders : this.tableHeaders();
    this.tableHeaders.set(headers);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  isAtLeastOneFilterBoxNotEmpty = computed(() => {
    const isfilterBoxOk = Object.values(this.filterBox()).some(v => v != 0 && v != null && v != '');
    const isDateFilterOk = Object.values(this.filterDateInterval()).some(v => v != null && v != '');
    return isfilterBoxOk || isDateFilterOk;
  });

  isAtLeastOneFilterHelpNotEmpty = computed(() => {
    return Object.values(this.filterHelp()).some(v => v != null && v != '' && v != 0);
  });

  onSetHeaderDisplay = (idx: number): void => {
    console.log('idx', idx);
    const newHeaders = this.tableHeaders().map((header, index) => {
      if (index == idx) {
        return {
          ...header,
          isHeaderActive: !header.isHeaderActive,
        };
      } else {
        return header;
      }
    });
    this.tableHeaders.set([...newHeaders]);
    saveStorage(this.tableHeadersLocalStorageId, this.tableHeaders());
  };

  onKeyPressOnNotFoundFilterRegister = (event: KeyboardEvent): void => {
    if (event.key == 'Escape') {
      this.onClearData();
    }
  };

  onClearDataOrFilterBoxOrFilterHelp = (property: Property): void => {
    let defaultValue: ITaskFilterHelp | ITaskHomeData;
    if (property == 'data' || property == 'filterBox') {
      defaultValue = {
        idTask: 0,
        employee: '',
        startDate: '',
        finishDate: '',
        name: '',
        status: TASK_NUMBER_STATUS.NOT_STARTED,
        taskType: '',
        product: '',
        productionLine: '',
      } as ITaskHomeData;
    } else {
      defaultValue = {
        inputSearch: '',
        idTask: 0,
        employee: '',
        startDate: '',
        finishDate: '',
        name: '',
        status: TASK_NUMBER_STATUS.NOT_STARTED,
        taskType: '',
        product: '',
        productionLine: '',
      } as ITaskFilterHelp;
    }
    (this[property] as WritableSignal<ITaskFilterHelp | ITaskHomeData>).set(defaultValue);
  };

  onClearFilterHelp = (): void => {
    this.filterHelp.update(current => ({ ...current, inputSearch: '' }));
    this.onClearDataOrFilterBoxOrFilterHelp('filterHelp');
  };

  onClearData = (): void => {
    this.onClearDataOrFilterBoxOrFilterHelp('filterBox');
    this.onClearDataOrFilterBoxOrFilterHelp('data');
    this.onClearFilterHelp();
    this.dataList.set(this.initialData());
    this.isFilterResultZeroRegister.set(false);
    this.isDelBtnDisabled.set(true);
    this.inputSearchValue.set('');
  };

  onSetInputSearchFilterItemToDefault = (fieldList?: KeyOfData[]): void => {
    this.onClearDataOrFilterBoxOrFilterHelp('filterBox');
    this.onClearDataOrFilterBoxOrFilterHelp('filterHelp');
    this.inputSearchValue.set('');
    const fields = fieldList ?? this.tableHeaders().map(h => h.databaseField as KeyOfData);
    this.dataList.set(this.onFilterThroughSearchInput(fields));
    if (this.dataList().length == 0) {
      this.isFilterResultZeroRegister.set(true);
    }
  };

  onSetFilterBoxValue = <K extends keyof ITaskHomeData>(key: K, value: ITaskHomeData[K]): void => {
    this.filterBox.update(current => ({ ...current, [key]: value }));
  };

  onClickOnFilterBtnThroughSearchInput = (fieldList: KeyOfData[]): void => {
    this.onClearFilterHelp();
    this.onClearDataOrFilterBoxOrFilterHelp('filterBox');
    const fields = fieldList ?? this.tableHeaders().map(h => h.databaseField as KeyOfData);
    this.dataList.set(this.onFilterThroughSearchInput(fields));
    if (this.dataList().length == 0) {
      this.isFilterResultZeroRegister.set(true);
    } else {
      this.filterHelp.update(current => ({ ...current, inputSearch: this.inputSearchValue() }));
    }
  };

  onFilterThroughSearchInput = <K extends keyof ITaskHomeData>(
    fieldList?: KeyOfData[]
  ): ITaskHomeData[] => {
    const fields = fieldList ?? this.tableHeaders().map(h => h.databaseField as KeyOfData);
    return this.initialData().filter(task => {
      return fields.some(key => {
        const propertyValue = task[key as K];
        return String(propertyValue)
          .toLowerCase()
          .trim()
          .includes(this.inputSearchValue().toLowerCase().trim());
      });
    });
  };

  onKeyPressOnSearchInput = (event: KeyboardEvent, fieldList: KeyOfData[]): void => {
    const fields = fieldList ?? this.tableHeaders().map(h => h.databaseField as KeyOfData);
    if (event.key == 'Enter') {
      this.onClickOnFilterBtnThroughSearchInput(fields);
    } else if (event.key == 'Escape') {
      this.onClearData();
    }
  };

  onClickOnFilterBtnThroughFilterBox = (): void => {
    this.dataList.set(this.onFilterThroughFilterBox());
    if (this.dataList().length == 0) {
      this.isFilterResultZeroRegister.set(true);
    } else {
      this.onApplyFilterHelpThroughFilterBox();
      this.inputSearchValue.set('');
    }
    this.isFilterBoxActive.set(false);
  };

  onFilterThroughFilterBox = <K extends keyof ITaskHomeData>(): ITaskHomeData[] => {
    return this.initialData().filter(initialData => {
      return Object.keys(this.filterBox()).every(key => {
        const filterBoxValue = this.filterBox()[key as K];
        if (key == 'startDate' || key == 'finishDate') {
          return this.onFilterThroughDateInterval(initialData, key);
        } else if (
          filterBoxValue == null ||
          filterBoxValue == '' ||
          filterBoxValue == 0 ||
          filterBoxValue == '0'
        ) {
          return true;
        } else {
          const initialDataToBeCompared = initialData[key as K].toString();
          return initialDataToBeCompared.includes(String(filterBoxValue));
        }
      });
    });
  };

  onFilterThroughDateInterval = <K extends keyof ITaskHomeData>(
    initialData: ITaskHomeData,
    key: K
  ): boolean => {
    const parseTime = (v: string | undefined | null): number | null => {
      if (!v) return null;
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d.getTime();
    };

    const startFrom = parseTime(this.filterDateInterval().startDateFrom);
    const startTo = parseTime(this.filterDateInterval().startDateTo);
    const finishFrom = parseTime(this.filterDateInterval().finishDateFrom);
    const finishTo = parseTime(this.filterDateInterval().finishDateTo);

    const startVal = parseTime(initialData.startDate);
    const finishVal = parseTime(initialData.finishDate);

    if (key == 'startDate') {
      if (startFrom == null && startTo == null) {
        return true;
      } else if (startVal == null) {
        return false;
      } else if (startFrom != null && startTo != null) {
        return startVal >= startFrom && startVal <= startTo;
      } else if (startFrom != null && startTo == null) {
        return startVal >= startFrom;
      } else if (startFrom == null && startTo != null) {
        return startVal <= startTo;
      }
    } else {
      if (finishFrom == null && finishTo == null) {
        return true;
      } else if (finishVal == null) {
        return false;
      } else if (finishFrom != null && finishTo != null) {
        return finishVal >= finishFrom && finishVal <= finishTo;
      } else if (finishFrom != null && finishTo == null) {
        return finishVal >= finishFrom;
      } else if (finishFrom == null && finishTo != null) {
        return finishVal <= finishTo;
      }
    }
    return true;
  };

  onSetFilterBoxStartDateValue = (tableHeader: ITableHeader<ITaskHomeData>, date: string): void => {
    if (tableHeader.databaseField == 'startDate') {
      this.filterDateInterval.update(current => ({ ...current, startDateFrom: date }));
    } else {
      this.filterDateInterval.update(current => ({ ...current, finishDateFrom: date }));
    }
  };

  onSetFilterBoxFinishDateValue = (
    tableHeader: ITableHeader<ITaskHomeData>,
    date: string
  ): void => {
    if (tableHeader.databaseField == 'startDate') {
      this.filterDateInterval.update(current => ({ ...current, startDateTo: date }));
    } else {
      this.filterDateInterval.update(current => ({ ...current, finishDateTo: date }));
    }
  };

  onSetFilterBoxItemToDefault = (key: string): void => {
    this.filterHelp.update(current => ({ ...current, inputSearch: '' }));
    this.filterBox.update(current => ({ ...current, [key]: '' }));
    this.dataList.set(this.onFilterThroughFilterBox());
    if (this.dataList().length == 0) {
      this.isFilterResultZeroRegister.set(true);
    } else {
      this.onApplyFilterHelpThroughFilterBox();
    }
    this.inputSearchValue.set('');
    this.isFilterBoxActive.set(false);
  };

  onKeyPressOnFilterBox = (event: KeyboardEvent): void => {
    if (event.key == 'Enter') {
      this.onClickOnFilterBtnThroughFilterBox();
    }
  };

  onApplyFilterHelpThroughFilterBox = <K extends keyof ITaskHomeData>(): void => {
    const keys = Object.keys(this.filterBox());
    keys.forEach(key => {
      if (key == 'startDate') {
        let startDate = '';
        if (
          this.filterDateInterval().startDateFrom != '' &&
          this.filterDateInterval().startDateTo == ''
        ) {
          startDate = '>' + this.filterDateInterval().startDateFrom;
        } else if (
          this.filterDateInterval().startDateFrom == '' &&
          this.filterDateInterval().startDateTo != ''
        ) {
          startDate = '< ' + this.filterDateInterval().startDateTo;
        } else if (
          this.filterDateInterval().startDateFrom != '' &&
          this.filterDateInterval().startDateTo != ''
        ) {
          startDate =
            this.filterDateInterval().startDateFrom +
            ' -> ' +
            this.filterDateInterval().startDateTo;
        }
        this.filterHelp.update(current => ({
          ...current,
          startDate: startDate,
        }));
      } else if (key == 'finishDate') {
        let finishDate = '';
        if (
          this.filterDateInterval().finishDateFrom != '' &&
          this.filterDateInterval().finishDateTo == ''
        ) {
          finishDate = '>' + this.filterDateInterval().finishDateFrom;
        } else if (
          this.filterDateInterval().finishDateFrom == '' &&
          this.filterDateInterval().finishDateTo != ''
        ) {
          finishDate = '< ' + this.filterDateInterval().finishDateTo;
        } else if (
          this.filterDateInterval().finishDateFrom != '' &&
          this.filterDateInterval().finishDateTo != ''
        ) {
          finishDate =
            this.filterDateInterval().finishDateFrom +
            ' -> ' +
            this.filterDateInterval().finishDateTo;
        }
        this.filterHelp.update(current => ({
          ...current,
          finishDate: finishDate,
        }));
      } else if (key !== 'inputSearch') {
        if (this.filterBox()[key as K] != 0 || this.filterBox()[key as K] != '0') {
          this.filterHelp.update(current => ({
            ...current,
            [key as keyof ITaskFilterHelp]: String(this.filterBox()[key as K]),
          }));
        }
      }
    });
  };

  onSetModalInfoType = (type: ModalType): void => {
    this.modalInfo.update(current => ({ ...current, type: type }));
  };

  onShowInfoModal = (
    type: ModalType,
    title: string,
    description: string,
    onActionOk?: ActionCallback
  ): void => {
    this.modalInfo.update(current => ({
      ...current,
      isActive: true,
      type: type,
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
      type: '',
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
      this.modalInfo.update(current => ({ ...current, type: 'success' }));
    }
    this.modalAsk.update(current => ({
      ...current,
      isActive: false,
      onActionOk: null,
      onActionNok: null,
    }));
  };

  onRedirectToEditPage = (data: ITaskHomeData): void => {
    this.data.set(data);
    this.isEditData.set(true);
    this.onRedirectPage(
      `/${this.deptName}/${this.currentView}/edit/${(this.data() as ITaskHomeData).idTask}`
    );
  };

  onRedirectPage = (route: string): void => {
    this.router.navigate([route]);
  };

  onCloneRegister = async (data: ITaskHomeData): Promise<void> => {
    this.isCopiedData.set(true);
    this.data.set(data);
    this.onRedirectPage(`/${this.deptName}/${this.currentView}/new`);
  };

  onShowDataList = async (): Promise<void> => {
    try {
      this.isLoading.set(true);
      const response = await this.taskApi.onGetDataList(this.deptName);
      if (response.data) {
        const dataList = response.data as ITaskHomeData[];
        const translatedStatusData = dataList.map(data => {
          if (typeof data.status == 'number') {
            return {
              ...data,
              startDate: dateAndHourFormatted(data.startDate),
              finishDate: dateAndHourFormatted(data.finishDate),
              status: onTranslateStatusToString(data.status),
            };
          }
          return data;
        });
        this.initialData.set([...translatedStatusData]);
        this.dataList.set([...translatedStatusData]);
        this.onClearData();
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.onShowInfoModal('failure', 'Listar registros', error.error?.message);
    } finally {
      this.isLoading.set(false);
    }
  };

  onDeleteRegister = async (id: number, onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.isLoading.set(true);
      const response = await this.taskApi.onDelete(this.deptName, id);
      if (response.status) {
        this.onShowDataList();
        this.onShowInfoModal('success', 'Excluir registro', response.message, onActionOk);
      } else {
        this.onShowInfoModal('failure', 'Excluir registro', response.error?.message || '');
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.onShowInfoModal(
        'failure',
        'Excluir registro',
        error.error?.message || 'Erro desconhecido'
      );
    } finally {
      this.isLoading.set(false);
    }
  };

  async onDelete(selectedData: ITaskHomeData): Promise<void> {
    await this.onDeleteRegister(selectedData.idTask as number);
  }

  onShowModalToDeleteThroughTopBtn(): void {
    this.onShowAskModal(
      'Cadastro de atividades',
      `Deseja excluir o registro <b>${this.data().name}</b>?`,
      () => this.onDelete(this.data())
    );
  }

  onShowModalToDeleteThroughTableBtn(data?: ITaskHomeData): void {
    const selectedData = data ? data : this.data();
    this.onShowAskModal(
      'Cadastro de atividades',
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }
}
