import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalBaseComponent } from '@components/modal/modal-base/modal-base.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { ModalStore } from '@store/modal/modal.store';
import { ITableHeader } from '@core/interfaces/table.interface';
import { defaultTableHeaderIcon } from '@store/base/base.register.store';
import { ITaskFilterHelp } from '@core/interfaces/task.interface';
import { TASK_NUMBER_STATUS } from 'app/enum/status.enum';
import { BaseType } from '@core/types/base.type';
import { InputComponent } from '@components/input/input.component';
import { TableComponent } from '@components/table/table.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { MatIconModule } from '@angular/material/icon';
import { ButtonIconComponent } from '@components/button/button-icon/button-icon.component';
import { TooltipComponent } from '@components/tooltip/tooltip.component';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';

@Component({
  selector: 'app-modal-table',
  imports: [
    CommonModule,
    InputComponent,
    TableComponent,
    PaginationComponent,
    BreadcrumbComponent,
    MatIconModule,
    ButtonLabelComponent,
    ButtonIconComponent,
    ButtonCloseComponent,
    TooltipComponent,
    ModalBaseComponent,
  ],
  templateUrl: './modal-table.component.html',
  styleUrl: './modal-table.component.scss',
})
export class ModalTableComponent<T = BaseType> {
  readonly modalStore = inject(ModalStore);
  @Input() isModalActive!: boolean;
  @Input() bodyClass = '';
  @Input() width = 'sm:w-5/6';
  @Input() isDisabled = true;

  inputSearchValue = signal('');
  isTableHeaderBoxActive = signal(false);
  tableHeaders = signal<ITableHeader<T>[]>([
    {
      id: 500,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idTask',
    },
    {
      id: 501,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Funcionário',
      databaseField: 'employee',
    },
    {
      id: 502,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Atividade',
      databaseField: 'name',
    },
    {
      id: 503,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Início',
      databaseField: 'startDate',
    },
    {
      id: 504,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Fim',
      databaseField: 'finishDate',
    },
    {
      id: 505,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Tipo',
      databaseField: 'taskType',
    },
    {
      id: 506,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Status',
      databaseField: 'status',
    },
  ]);
  data = signal<T>();
  dataList = signal<T[]>([]);
  initialData = signal<T[]>([]);
  isDelBtnDisabled = signal(true);
  isFilterBoxActive = signal(false);
  isFilterResultZeroRegister = signal(false);
  filterBox = signal<T>();
  filterHelp = signal<ITaskFilterHelp>();

  isComponentSetToDefault = signal<boolean>(false);

  onSetHeaderDisplay = (idx: number): void => {
    console.log('entrando...');
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
    console.log('headers', newHeaders);
    this.tableHeaders.set([...newHeaders]);
    saveStorage(this.tableHeadersLocalStorageId, this.tableHeaders());
  };

  onKeyPressOnNotFoundFilterRegister = (event: KeyboardEvent): void => {
    if (event.key == 'Escape') {
      this.onClearAllData();
    }
  };

  onClearData = () => {
    this.data.set({
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
  };

  onClearFilterBox = (): void => {
    this.filterBox.set({
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
    this.filterDateInterval.set({
      startDateFrom: '',
      startDateTo: '',
      finishDateFrom: '',
      finishDateTo: '',
    });
  };

  onClearFilterHelp = (): void => {
    this.filterHelp.set({
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
  };

  onClearAllData = (): void => {
    this.onClearFilterBox();
    this.onClearData();
    this.onClearFilterHelp();
    this.dataList.set(this.initialData());
    this.isFilterResultZeroRegister.set(false);
    this.isDelBtnDisabled.set(true);
    this.inputSearchValue.set('');
  };

  // onSetInputSearchFilterItemToDefault = (fieldList?: KeyOfData[]): void => {
  //   this.onClearFilterBox();
  //   this.onClearFilterHelp();
  //   this.inputSearchValue.set('');
  //   const fields = fieldList ?? this.tableHeaders().map(h => h.databaseField as KeyOfData);
  //   this.dataList.set(this.onFilterThroughSearchInput(fields));
  //   if (this.dataList().length == 0) {
  //     this.isFilterResultZeroRegister.set(true);
  //   }
  // };

  onSetFilterBoxValue = <K extends keyof ITaskHomeData>(key: K, value: ITaskHomeData[K]): void => {
    this.filterBox.update(current => ({ ...current, [key]: value }));
  };

  onClickOnFilterBtnThroughSearchInput = (fieldList: KeyOfData[]): void => {
    this.onClearFilterHelp();
    this.onClearFilterBox();
    this.isComponentSetToDefault.set(true);
    const fields = fieldList ?? this.tableHeaders().map(h => h.databaseField as KeyOfData);
    this.dataList.set(this.onFilterThroughSearchInput(fields));
    this.filterHelp.update(current => ({ ...current, inputSearch: this.inputSearchValue() }));
    if (this.dataList().length == 0) {
      this.isFilterResultZeroRegister.set(true);
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
      this.onClearAllData();
    }
  };

  onClickOnFilterBtnThroughFilterBox = (): void => {
    this.isComponentSetToDefault.set(true);
    this.onClearFilterHelp();
    this.dataList.set(this.onFilterThroughFilterBox());
    this.onApplyFilterBoxToFilterHelp();
    if (this.dataList().length == 0) {
      this.isFilterResultZeroRegister.set(true);
    }
    this.inputSearchValue.set('');
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
          const initialDataToBeCompared = (initialData[key as K] ?? '').toString();
          return initialDataToBeCompared
            .toLowerCase()
            .trim()
            .includes(String(filterBoxValue).toLowerCase().trim());
        }
      });
    });
  };

  onFilterThroughDateInterval = <K extends keyof ITaskHomeData>(
    initialData: ITaskHomeData,
    key: K
  ): boolean => {
    const parseTime = (v: string | undefined | null, isFrom: boolean): number | null => {
      if (!v || v == '' || v == '0') return null;
      if (v.length > 0 && v.includes('-')) {
        const [year, month, day] = v.split('-');
        const yearToNumber = Number(year);
        const monthToNumber = Number(month);
        const dayToNumber = Number(day);
        let dateToUtcNumber = 0;
        if (isFrom) {
          dateToUtcNumber = new Date(
            yearToNumber,
            monthToNumber - 1,
            dayToNumber,
            0,
            0,
            0,
            0
          ).getTime();
        } else {
          dateToUtcNumber =
            new Date(yearToNumber, monthToNumber - 1, dayToNumber + 1, 0, 0, 0, 0).getTime() - 1;
        }
        return isNaN(dateToUtcNumber) ? null : dateToUtcNumber;
      }
      return null;
    };

    if (key == 'startDate') {
      const startFrom = parseTime(this.filterDateInterval().startDateFrom, true);
      const startTo = parseTime(this.filterDateInterval().startDateTo, false);
      const startVal =
        initialData.startDate && initialData.startDate.length > 0
          ? new Date(initialData.startDate).getTime()
          : null;

      if (startFrom == null && startTo == null) {
        return true;
      } else if (startVal == null) {
        return false;
      } else if (startFrom != null && startTo != null && startVal != null) {
        return startVal >= startFrom && startVal <= startTo;
      } else if (startFrom != null && startTo == null && startVal != null) {
        return startVal >= startFrom;
      } else if (startFrom == null && startTo != null && startVal != null) {
        return startVal <= startTo;
      }
    } else {
      const finishFrom = parseTime(this.filterDateInterval().finishDateFrom, true);
      const finishTo = parseTime(this.filterDateInterval().finishDateTo, false);
      const finishVal =
        initialData.finishDate && initialData.finishDate.length > 0
          ? new Date(initialData.finishDate).getTime()
          : null;

      if (finishFrom == null && finishTo == null) {
        return true;
      } else if (finishVal == null) {
        return false;
      } else if (finishFrom != null && finishTo != null && finishVal != null) {
        return finishVal >= finishFrom && finishVal <= finishTo;
      } else if (finishFrom != null && finishTo == null && finishVal != null) {
        return finishVal >= finishFrom;
      } else if (finishFrom == null && finishTo != null && finishVal != null) {
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
    if (key == 'startDate') {
      this.filterDateInterval.update(current => ({
        ...current,
        startDateFrom: '',
        startDateTo: '',
      }));
    } else if (key == 'finishDate') {
      this.filterDateInterval.update(current => ({
        ...current,
        finishDateFrom: '',
        finishDateTo: '',
      }));
    }
    this.dataList.set(this.onFilterThroughFilterBox());
    this.onApplyFilterBoxToFilterHelp();
    if (this.dataList().length == 0) {
      this.isFilterResultZeroRegister.set(true);
    }
    this.inputSearchValue.set('');
    this.isFilterBoxActive.set(false);
  };

  onKeyPressOnFilterBox = (event: KeyboardEvent): void => {
    if (event.key == 'Enter') {
      this.onClickOnFilterBtnThroughFilterBox();
    }
  };

  onApplyFilterBoxToFilterHelp = <K extends keyof ITaskHomeData>(): void => {
    const keys = Object.keys(this.filterBox());
    keys.forEach(key => {
      if (key == 'startDate') {
        let startDate = '';
        if (
          this.filterDateInterval().startDateFrom != '' &&
          this.filterDateInterval().startDateTo == ''
        ) {
          startDate = '≥ ' + this.filterDateInterval().startDateFrom;
        } else if (
          this.filterDateInterval().startDateFrom == '' &&
          this.filterDateInterval().startDateTo != ''
        ) {
          startDate = '≤ ' + this.filterDateInterval().startDateTo;
        } else if (
          this.filterDateInterval().startDateFrom != '' &&
          this.filterDateInterval().startDateTo != ''
        ) {
          startDate =
            this.filterDateInterval().startDateFrom + ' ➜ ' + this.filterDateInterval().startDateTo;
        }
        this.filterHelp.update(current => ({
          ...current,
          startDate: startDate,
        }));
        this.filterBox.update(current => ({
          ...current,
          startDate: startDate,
        }));
      } else if (key == 'finishDate') {
        let finishDate = '';
        if (
          this.filterDateInterval().finishDateFrom != '' &&
          this.filterDateInterval().finishDateTo == ''
        ) {
          finishDate = '≥ ' + this.filterDateInterval().finishDateFrom;
        } else if (
          this.filterDateInterval().finishDateFrom == '' &&
          this.filterDateInterval().finishDateTo != ''
        ) {
          finishDate = '≤ ' + this.filterDateInterval().finishDateTo;
        } else if (
          this.filterDateInterval().finishDateFrom != '' &&
          this.filterDateInterval().finishDateTo != ''
        ) {
          finishDate =
            this.filterDateInterval().finishDateFrom +
            ' ➜ ' +
            this.filterDateInterval().finishDateTo;
        }
        this.filterHelp.update(current => ({
          ...current,
          finishDate: finishDate,
        }));
        this.filterBox.update(current => ({
          ...current,
          finishDate: finishDate,
        }));
      } else {
        if (this.filterBox()[key as K] != 0 || this.filterBox()[key as K] != '0') {
          this.filterHelp.update(current => ({
            ...current,
            [key as keyof ITaskFilterHelp]: String(this.filterBox()[key as K]),
          }));
        }
      }
      console.log('filterBox', this.filterBox());
    });
  };

  @Output() closeActionNokEmitter = new EventEmitter<boolean>();

  OnActionNok(): void {
    this.closeActionNokEmitter.emit();
  }

  @Output() closeActionOkEmitter = new EventEmitter();

  OnActionOk(): void {
    this.closeActionOkEmitter.emit();
  }
}
