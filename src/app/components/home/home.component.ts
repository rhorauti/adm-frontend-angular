import {
  Component,
  inject,
  OnDestroy,
  computed,
  signal,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
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
import { AuthStore } from '@store/auth/auth.store';
import { saveStorage } from '@core/utils/misc';
import { BaseType, KeyOfData } from '@core/types/base.type';
import { ITaskForm } from '@core/interfaces/task.interface';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskApi } from '@core/http/task/task.api';
import { TableComponent } from '@components/table/table.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { ITableHeader } from '@core/interfaces/table.interface';
import { DEPT_NAMES_ENGLISH, translateDeptNameToLocalLanguage } from 'app/enum/department.enum';
import { FilterHelp } from '@core/interfaces/base.register.interface';

@Component({
  selector: 'app-home',
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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent<T = BaseType> implements OnDestroy, OnChanges {
  readonly taskApi = inject(TaskApi);
  readonly router = inject(Router);
  readonly authStore = inject(AuthStore);

  subscription: Subscription | undefined = undefined;

  @Input() currentView = '';
  @Input() breadcrumbList = ['Cadastro', 'Atividades'];
  @Input() inputSearchFilterList: KeyOfData[] = [];
  @Input() inputSearchPlaceholder = '';
  @Input() tableHeaders: ITableHeader<T>[] = [];
  @Input() initialDataList: T[] = [];
  @Input() isComponentSetToDefault = signal(false);
  @Input() deptName = '' as DEPT_NAMES_ENGLISH;
  @Input() newRegisterUrl = '';
  @Input() tableHeadersLocalStorageId = '';

  deptNameTranslated = translateDeptNameToLocalLanguage(this.deptName);
  inputSearchValue = signal('');
  isTableHeaderBoxActive = signal(false);
  data = signal<T>({} as T);
  dataList = signal<T[]>([]);
  isDelBtnDisabled = signal(true);
  isFilterBoxActive = signal(false);
  isFilterResultZeroRegister = signal(false);
  filterBox = signal<Record<string, any>>({} as Record<string, any>);
  filterHelp = signal<Record<string, any>>({} as Record<string, any>);
  inputSearchHelp = signal('');

  filterDateInterval = signal({
    startDateFrom: '',
    startDateTo: '',
    finishDateTo: '',
    finishDateFrom: '',
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialDataList']) {
      this.dataList.set([...this.initialDataList]);
    }
    if (changes['isComponentSetToDefault']) {
      this.onClearAllData();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // tableDataFormated = computed(() => {
  //   return this.dataList().map(data => {
  //     return {
  //       ...data,
  //       status: onTranslateStatusToString(data.status as number),
  //     };
  //   });
  // });

  isAtLeastOneFilterBoxNotEmpty = computed(() => {
    const isfilterBoxOk = Object.values(this.filterBox()).some(v => v != 0 && v != null && v != '');
    const isDateFilterOk = Object.values(this.filterDateInterval()).some(v => v != null && v != '');
    return isfilterBoxOk || isDateFilterOk;
  });

  isAtLeastOneFilterHelpNotEmpty = computed(() => {
    return (
      Object.values(this.filterHelp()).some(v => v != null && v != '' && v != 0) ||
      this.inputSearchHelp() != ''
    );
  });

  onSetHeaderDisplay = (idx: number): void => {
    const newHeaders = this.tableHeaders.map((header, index) => {
      if (index == idx) {
        return {
          ...header,
          isHeaderActive: !header.isHeaderActive,
        };
      } else {
        return header;
      }
    });
    this.tableHeaders = [...newHeaders];
    saveStorage(this.tableHeadersLocalStorageId, this.tableHeaders);
  };

  onKeyPressOnNotFoundFilterRegister = (event: KeyboardEvent): void => {
    if (event.key == 'Escape') {
      this.onClearAllData();
    }
  };

  onClearData = () => {
    this.data.set({} as T);
  };

  onClearFilterBox = (): void => {
    this.filterBox.set({});
    this.filterDateInterval.set({
      startDateFrom: '',
      startDateTo: '',
      finishDateFrom: '',
      finishDateTo: '',
    });
  };

  onClearFilterHelp = (): void => {
    this.inputSearchHelp.set('');
    this.filterHelp.set({} as FilterHelp<T>);
  };

  onClearAllData = (): void => {
    this.onClearFilterBox();
    this.onClearData();
    this.onClearFilterHelp();
    this.dataList.set(this.initialDataList);
    this.isFilterResultZeroRegister.set(false);
    this.isDelBtnDisabled.set(true);
    this.inputSearchValue.set('');
  };

  onSetFilterBoxValue = <K extends keyof T>(key: K, value: string): void => {
    this.filterBox.update(current => ({ ...current, [key]: value }));
  };

  onClickOnFilterBtnThroughSearchInput = (fieldList: KeyOfData[]): void => {
    this.onClearFilterHelp();
    this.onClearFilterBox();
    const fields = fieldList ?? this.tableHeaders.map(h => h.databaseField as KeyOfData);
    this.dataList.set(this.onFilterThroughSearchInput(fields));
    this.inputSearchHelp.set(this.inputSearchValue());
    if (this.dataList().length == 0) {
      this.isFilterResultZeroRegister.set(true);
    }
  };

  onFilterThroughSearchInput = <K extends keyof T>(fieldList?: KeyOfData[]): T[] => {
    const fields = fieldList ?? this.tableHeaders.map(h => h.databaseField as KeyOfData);
    return this.initialDataList.filter(data => {
      return fields.some(key => {
        const propertyValue = data[key as K];
        return String(propertyValue)
          .toLowerCase()
          .trim()
          .includes(this.inputSearchValue().toLowerCase().trim());
      });
    });
  };

  onKeyPressOnSearchInput = (event: KeyboardEvent, fieldList: KeyOfData[]): void => {
    const fields = fieldList ?? this.tableHeaders.map(h => h.databaseField as KeyOfData);
    if (event.key == 'Enter') {
      this.onClickOnFilterBtnThroughSearchInput(fields);
    } else if (event.key == 'Escape') {
      this.onClearAllData();
    }
  };

  onClickOnFilterBtnThroughFilterBox = (): void => {
    this.onClearFilterHelp();
    this.dataList.set(this.onFilterThroughFilterBox());
    this.onApplyFilterBoxToFilterHelp();
    if (this.dataList().length == 0) {
      this.isFilterResultZeroRegister.set(true);
    }
    this.inputSearchValue.set('');
    this.isFilterBoxActive.set(false);
  };

  onFilterThroughFilterBox = <K extends keyof T>(): T[] => {
    return this.initialDataList.filter(data => {
      return Object.keys(this.filterBox()).every(key => {
        const filterBoxValue = this.filterBox()[key as string];
        if (key == 'startDate' || key == 'finishDate') {
          return this.onFilterThroughDateInterval(data, key);
        } else if (
          filterBoxValue == null ||
          filterBoxValue == '' ||
          filterBoxValue == 0 ||
          filterBoxValue == '0'
        ) {
          return true;
        } else {
          const initialDataToBeCompared = (data[key as K] ?? '').toString();
          return initialDataToBeCompared
            .toLowerCase()
            .trim()
            .includes(String(filterBoxValue).toLowerCase().trim());
        }
      });
    });
  };

  isTaskData = (obj: unknown): obj is ITaskForm => {
    return typeof obj === 'object' && obj !== null && typeof (obj as ITaskForm).status === 'string';
  };

  onFilterThroughDateInterval = (initialData: T, key: string): boolean => {
    if (this.isTaskData(initialData)) {
      const startDate = 'startDate';
      const finishDate = 'finishDate';
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
          initialData[startDate] && initialData[startDate].length > 0
            ? new Date(initialData[startDate]).getTime()
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
          initialData[finishDate] && initialData[finishDate].length > 0
            ? new Date(initialData[finishDate]).getTime()
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
    }
    return true;
  };

  onSetFilterBoxStartDateValue = (tableHeader: ITableHeader<T>, date: string): void => {
    if (tableHeader.databaseField == 'startDate') {
      this.filterDateInterval.update(current => ({ ...current, startDateFrom: date }));
    } else {
      this.filterDateInterval.update(current => ({ ...current, finishDateFrom: date }));
    }
  };

  onSetFilterBoxFinishDateValue = (tableHeader: ITableHeader<T>, date: string): void => {
    if (tableHeader.databaseField == 'startDate') {
      this.filterDateInterval.update(current => ({ ...current, startDateTo: date }));
    } else {
      this.filterDateInterval.update(current => ({ ...current, finishDateTo: date }));
    }
  };

  onSetFilterBoxItemToDefault = (key: string): void => {
    this.inputSearchHelp.set('');
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

  onApplyFilterBoxToFilterHelp = (): void => {
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
        if (this.filterBox()[key] != 0 || this.filterBox()[key as string] != '0') {
          this.inputSearchHelp.set('');
          this.filterHelp.update(current => ({
            ...current,
            [key as keyof T]: String(this.filterBox()[key]),
          }));
        }
      }
    });
  };

  @Output() redirectPageEmitter = new EventEmitter();

  onRedirectPage = (route: string): void => {
    this.router.navigate([route]);
  };

  onRedirectToEditPage = (data: T): void => {
    this.redirectPageEmitter.emit(data);
  };

  @Output() cloneRegisterEmitter = new EventEmitter();

  onCloneRegister = (data: T): void => {
    this.data.set(data);
    this.cloneRegisterEmitter.emit(this.data());
  };

  @Output() showModalToDeleteEmitter = new EventEmitter();

  onShowModalToDeleteThroughTopBtn = (): void => {
    this.showModalToDeleteEmitter.emit(this.data());
  };

  onDeleteThroughTableBtn = (data: T): void => {
    this.data.set(data);
    this.showModalToDeleteEmitter.emit(this.data());
  };

  @Output() refreshBtnClickEmitter = new EventEmitter();

  onRefreshBtnClick = (): void => {
    this.refreshBtnClickEmitter.emit();
  };

  @Output() setToDefaultEmitter = new EventEmitter();

  onSetComponentToDefault = (): void => {
    this.setToDefaultEmitter.emit();
  };
}
