import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { ModalBaseComponent } from '@components/modal/modal-base/modal-base.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { ModalStore } from '@store/modal/modal.store';
import { ITableHeader } from '@core/interfaces/table.interface';
import { BaseType, KeyOfData } from '@core/types/base.type';
import { InputComponent } from '@components/input/input.component';
import { TableComponent } from '@components/table/table.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { MatIconModule } from '@angular/material/icon';
import { TooltipComponent } from '@components/tooltip/tooltip.component';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { FilterHelp } from '@core/interfaces/base.register.interface';

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
    ButtonCloseComponent,
    TooltipComponent,
    ModalBaseComponent,
  ],
  templateUrl: './modal-table.component.html',
  styleUrl: './modal-table.component.scss',
})
export class ModalTableComponent<T, R> implements OnChanges {
  readonly modalStore = inject(ModalStore);
  @Input() isModalActive!: boolean;
  @Input() initialTableHeaders: ITableHeader<T>[] = [];
  @Input() initialDataList: T[] = [];
  @Input() breadcrumbList: string[] = [];
  @Input() onShowDataList?: (...args: any[]) => Promise<R>;
  @Input() inputSearchFilterList: KeyOfData[] | undefined = undefined;
  @Input() currentView = '';
  @Input() inputSearchPlaceholder = '';
  @Input() width = 'sm:w-5/6';
  @Input() inputSearchValue = signal('');

  data = signal({} as T);
  dataList = signal<T[]>([]);
  tableHeaders = signal<ITableHeader<T>[]>([]);
  isFilterResultZeroRegister = signal(false);
  filterHelp = signal({} as FilterHelp<T>);
  isActionOkBtnDisabled = true;
  isComponentSetToDefault = signal<boolean>(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialDataList']) {
      this.dataList.set([...this.initialDataList]);
    }
    if (changes['initialTableHeaders']) {
      this.tableHeaders.set([...this.initialTableHeaders]);
    }
    if (this.isModalActive) {
      this.isComponentSetToDefault.set(true);
    }
  }

  onKeyPressOnNotFoundFilterRegister = (event: KeyboardEvent): void => {
    if (event.key == 'Escape') {
      this.onClearAllData();
    }
  };

  isAtLeastOneFilterHelpNotEmpty = computed(() => {
    return Object.values(this.filterHelp()).some(v => v != null && v != '' && v != '0');
  });

  onClearObject = (obj: Record<string, any>): void => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value == 'string') {
        this.data.update(current => ({ ...current, [key]: '' }));
      } else if (typeof value == 'number') {
        this.data.update(current => ({ ...current, [key]: 0 }));
      } else if (typeof value == 'boolean') {
        this.data.update(current => ({ ...current, [key]: false }));
      } else {
        this.data.update(current => ({ ...current, [key]: null }));
      }
    });
  };

  onClearAllData = (): void => {
    this.onClearObject(this.data() as BaseType);
    this.onClearObject(this.filterHelp());
    this.dataList.set(this.initialDataList);
    this.isFilterResultZeroRegister.set(false);
    this.inputSearchValue.set('');
  };

  onClickOnFilterBtnThroughSearchInput = (): void => {
    this.onClearObject(this.filterHelp());
    this.isComponentSetToDefault.set(true);
    this.dataList.set(this.onFilterThroughSearchInput());
    this.filterHelp.update(current => ({ ...current, inputSearch: this.inputSearchValue() }));
    if (this.dataList().length == 0) {
      this.isFilterResultZeroRegister.set(true);
    }
  };

  onFilterThroughSearchInput = <K extends keyof T>(): T[] => {
    const fields =
      this.inputSearchFilterList ?? this.tableHeaders().map(h => h.databaseField as KeyOfData);
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

  onKeyPressOnSearchInput = (event: KeyboardEvent): void => {
    if (event.key == 'Enter') {
      this.onClickOnFilterBtnThroughSearchInput();
    } else if (event.key == 'Escape') {
      this.onClearAllData();
    }
  };

  onTableRowClick = (data: T): void => {
    if (data) {
      this.data.set(data);
      this.isActionOkBtnDisabled = false;
    } else {
      this.isActionOkBtnDisabled = true;
    }
  };

  @Output() OnActionNokEmitter = new EventEmitter();

  OnActionNok = (): void => {
    this.OnActionNokEmitter.emit(false);
  };

  @Output() OnActionOkEmitter = new EventEmitter<T>();

  OnActionOk = (): void => {
    this.OnActionOkEmitter.emit(this.data());
  };
}
