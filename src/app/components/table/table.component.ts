import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  HostListener,
  signal,
} from '@angular/core';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { RouterModule } from '@angular/router';
import { BaseType, Page } from '@core/types/base.type';
import { IProduct } from '@core/interfaces/product.interface';
import { ITableBody, ITableHeader } from '@core/interfaces/table.interface';
import { defaultTableHeaderIcon } from '@store/base/base.register.store';
import { DataService } from '@core/services/data.service';
import { Subscription } from 'rxjs';
import { onSetIconStatus, onSetIconStatusBackgroundColor, Status } from 'app/enum/status.enum';
import { onFormatDateFromUtcToLocal } from '@core/utils/misc';
import { ITaskForm } from '@core/interfaces/task.interface';

@Component({
  selector: 'app-table',
  imports: [CommonModule, FormsModule, MatIconModule, ButtonCloseComponent, RouterModule],
  providers: [provideNgxMask(), NgxMaskPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T = BaseType> implements OnInit, OnDestroy, OnChanges {
  readonly elRef = inject(ElementRef);
  readonly mask = inject(NgxMaskPipe);
  readonly dataService = inject(DataService);
  private subscribe!: Subscription;

  @Input() initialDataList: T[] = [];
  @Input() tableHeaders: ITableHeader<T>[] = [];
  @Input() pageName: Page = 'tasks';
  @Input() isModal = false;
  @Input() currentPage = signal<number>(1);
  @Input() isComponentSetToDefault = signal(false);

  data = signal<T>({} as T);
  tableBodyList: ITableBody<T>[] = [];
  gridTemplateColumns = '';
  qtyPerPage = 10;
  isTableHeaderCheckBoxChecked = false;

  ngOnInit(): void {
    this.subscribe = this.dataService.emitEvent.subscribe(currentPage => {
      this.currentPage.set(currentPage);
    });
    this.onGridTemplateColumnsChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialDataList']) {
      this.onCreateTableBodyList();
      this.onSetSortFilterToDefault();
    }
    if (changes['tableHeaders']) {
      this.onGridTemplateColumnsChange();
    }
    if (changes['isComponentSetToDefault']) {
      this.onSetSortFilterToDefault();
      this.onSetCheckboxBodyToDefault();
      this.onSetModalCheckIconCheckedToDefault();
      this.isTableHeaderCheckBoxChecked = false;
      this.onComponentSetToDefault();
    }
  }

  isTaskData = (obj: unknown): obj is ITaskForm => {
    return typeof obj === 'object' && obj !== null && typeof (obj as ITaskForm).status === 'string';
  };

  onCreateTableBodyList = (): void => {
    this.tableBodyList = this.initialDataList.map(data => {
      const base: ITableBody<T> = {
        data,
        isBodyCheckboxChecked: false,
        isModalCheckIconChecked: false,
        isRowPopUpActive: false,
      };

      if (!this.isTaskData(data)) {
        return base;
      }
      const status = data.status as Status;
      return {
        ...base,
        statusIcon: {
          backgroundColor: onSetIconStatusBackgroundColor(status),
          iconName: onSetIconStatus(status),
          status: status,
        },
      };
    });
  };

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.tableBodyList = this.tableBodyList.map(body => {
        return {
          ...body,
          isRowPopUpActive: false,
        };
      });
    }
  }

  onGridTemplateColumnsChange = (): void => {
    this.gridTemplateColumns = '';
    const columnsWidth: string[] = this.isModal ? [] : ['2fr'];
    this.tableHeaders.forEach(header => {
      if (header.isHeaderActive && !this.isModal) {
        if (header.id != 0 && header.id != 2) {
          columnsWidth.push('2fr');
        } else if (header.id == 2) {
          columnsWidth.push('3fr');
        } else {
          columnsWidth.push('1fr');
        }
      } else if (this.isModal) {
        if (header.id == 0) {
          columnsWidth.push('1fr');
        } else if (header.id == 1) {
          columnsWidth.push('1fr');
        } else {
          columnsWidth.push('2fr');
        }
      }
    });
    this.gridTemplateColumns = columnsWidth.join(' ');
  };

  computedFirstRegister = computed(() => {
    return (this.currentPage() - 1) * this.qtyPerPage;
  });

  computedLastRegister = computed(() => {
    return this.currentPage() * this.qtyPerPage;
  });

  getCnpj(row: T): string {
    return (row as any)?.cnpj ?? (row as any)?.company?.cnpj ?? '';
  }

  setCnpjMask(cnpj: string): string {
    return (cnpj?.length ?? 0) > 11 ? '00.000.000/0000-00' : '000.000.000-00';
  }

  formatCell(row: T, key: any): string {
    const value = (row as any)?.[key];

    switch (key) {
      case 'cnpj': {
        const raw = this.getCnpj(row);
        const expr = this.setCnpjMask(raw);
        return this.mask.transform(raw, expr) ?? '';
      }
      case 'startDate': {
        return onFormatDateFromUtcToLocal(value);
      }
      case 'finishDate': {
        return onFormatDateFromUtcToLocal(value);
      }
      default:
        return value ?? '';
    }
  }

  originList = ['Produto nacional', 'Fabricado interno', 'Produto importado'];

  onSetOrigin(data: T): string {
    const productData = data as IProduct;
    switch (productData.origin) {
      case 1: {
        return this.originList[0];
      }
      case 2: {
        return this.originList[1];
      }
      case 3: {
        return this.originList[2];
      }
    }
    return '';
  }

  /**
   * Sort the companiesData according to sort status defined on onSetTableHeaderSortMethod
   * There are 3 sort states : 0 - Not sorted, 1 - Ascending, 2 - Descending.
   * @param idx The index of the clicked table column.
   */
  onFilterThroughSort = <K extends keyof T>(idx: number): ITableBody<T>[] => {
    if (!this.tableBodyList || this.tableBodyList.length === 0) return [];

    const list = this.tableBodyList.slice(); // NÃO mutamos o original
    const firstDataItem = list[0].data as Record<string, unknown>;
    const keyId = Object.keys(firstDataItem).find(k => k.toLowerCase().startsWith('id')) as K;
    const header = this.tableHeaders[idx];
    const key = header.databaseField as K;
    const sortDirection = header.sortDirection;

    const isEmpty = (v: unknown) =>
      v === null || v === undefined || (typeof v === 'string' && v.trim().length === 0);

    // comparator que preserva: não vazios primeiro, vazios por último
    const idComparator = (a: ITableBody<T>, b: ITableBody<T>) => {
      const valueA = a.data[keyId];
      const valueB = b.data[keyId];

      const aEmpty = isEmpty(valueA);
      const bEmpty = isEmpty(valueB);

      if (aEmpty && !bEmpty) return 1;
      if (!aEmpty && bEmpty) return -1;
      if (aEmpty && bEmpty) return 0;

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueB as number) - (valueA as number);
      }
      return 0;
    };

    const keyComparator = (a: ITableBody<T>, b: ITableBody<T>) => {
      const valueA = a.data[key];
      const valueB = b.data[key];

      const aEmpty = isEmpty(valueA);
      const bEmpty = isEmpty(valueB);

      if (aEmpty && !bEmpty) return 1;
      if (!aEmpty && bEmpty) return -1;
      if (aEmpty && bEmpty) return 0;

      let comparison = 0;
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = (valueA as number) - (valueB as number);
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = (valueA as string).localeCompare(valueB as string);
      } else {
        comparison = String(valueA).localeCompare(String(valueB));
      }

      return sortDirection === 2 ? -comparison : comparison;
    };

    if (sortDirection === 0) {
      return list.sort(idComparator);
    } else {
      return list.sort(keyComparator);
    }
  };
  // onFilterThroughSort = <K extends keyof T>(idx: number): ITableBody<T>[] => {
  //   if (!this.tableBodyList || this.tableBodyList.length == 0) return [];
  //   const firstDataItem = this.tableBodyList[0].data as Record<string, unknown>;
  //   const keyId = Object.keys(firstDataItem).find(k => k.toLowerCase().startsWith('id')) as K;
  //   const header = this.tableHeaders[idx];
  //   const key = header.databaseField as K;
  //   const sortDirection = header.sortDirection;
  //   if (this.tableHeaders[idx].sortDirection == 0) {
  //     return [
  //       ...this.tableBodyList.sort((a, b) => {
  //         const valueA = a.data[keyId];
  //         const valueB = b.data[keyId];
  //         if (typeof valueA === 'number' && typeof valueB === 'number') {
  //           return valueB - valueA;
  //         }
  //         return 0;
  //       }),
  //     ];
  //   } else {
  //     return [
  //       ...this.tableBodyList.sort((a, b) => {
  //         const valueA = a.data[key];
  //         const valueB = b.data[key];
  //         let comparison = 0;
  //         if (typeof valueA === 'number' && typeof valueB === 'number') {
  //           comparison = ((valueA as number) - valueB) as number;
  //         } else if (typeof valueA === 'string' && typeof valueB === 'string') {
  //           comparison = (valueA as string).localeCompare(valueB as string);
  //         }
  //         return sortDirection == 2 ? comparison * -1 : comparison;
  //       }),
  //     ];
  //   }
  // };

  /**
   * Change the sort icon according to sort status calculated on onSetTableHeaderSortMethod.
   * There are 3 sort states : 0 - Not sorted, 1 - Ascending, 2 - Descending.
   */
  onSetTableHeaderIcon = (): void => {
    this.tableHeaders = this.tableHeaders.map(header => {
      if (header.sortDirection == 0) {
        return { ...header, icon: defaultTableHeaderIcon };
      } else if (header.sortDirection == 1) {
        return { ...header, icon: 'expand_more' };
      } else {
        return { ...header, icon: 'expand_less' };
      }
    });
  };

  /**
   * Calculate the sorted order that will be used to sort companiesData and also change sort icon.
   * There are 3 sort states : 0 - Not sorted, 1 - Ascending, 2 - Descending.
   * @param idx The index of the clicked table column.
   */
  onSetTableHeaderSortMethod = (idx: number): void => {
    this.tableHeaders = this.tableHeaders.map((header, index) => {
      if (idx == index) {
        return { ...header, sortDirection: (header.sortDirection + 1) % 3 };
      }
      return { ...header, sortDirection: 0 };
    });
  };

  onClickOnFilterBtnThroughSort = (idx: number): void => {
    this.onSetTableHeaderSortMethod(idx || 0);
    this.onSetTableHeaderIcon();
    this.tableBodyList = this.onFilterThroughSort(idx || 0);
  };

  onSetSortFilterToDefault = (): void => {
    this.onSetSortStateToDefault();
    this.tableBodyList = this.onFilterThroughSort(0);
  };

  onSetSortStateToDefault = (): void => {
    this.tableHeaders = this.tableHeaders.map(header => {
      return { ...header, sortDirection: 0, icon: defaultTableHeaderIcon };
    });
  };

  onHeaderCheckboxChecked = (event: Event): void => {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.isTableHeaderCheckBoxChecked = isChecked;
    this.tableBodyList = this.tableBodyList.map(body => {
      return {
        ...body,
        isBodyCheckboxChecked: isChecked,
      };
    });
    this.onCheckTableCheckboxBodyStatus();
  };

  @Output() setToDefaultEmitter = new EventEmitter();

  onComponentSetToDefault = (): void => {
    this.setToDefaultEmitter.emit(false);
  };

  @Output() isDelBtnDisabledEmitter = new EventEmitter();
  @Output() tableDataEmitter = new EventEmitter();

  onCheckTableCheckboxBodyStatus = (data?: T): void => {
    const bodyCheckboxListUpdated = this.tableBodyList.filter(
      body => body.isBodyCheckboxChecked == true
    );
    this.isTableHeaderCheckBoxChecked = bodyCheckboxListUpdated.length > 0;
    this.isDelBtnDisabledEmitter.emit(bodyCheckboxListUpdated.length != 1);
    if (data) this.tableDataEmitter.emit(data);
  };

  onBodyCheckboxCheckChange = (index: number, event: Event, data?: T) => {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.tableBodyList = this.tableBodyList.map((body, idx) => {
      if (index == idx) {
        return {
          ...body,
          isBodyCheckboxChecked: isChecked,
        };
      }
      return body;
    });
    if (isChecked) {
      this.onCheckTableCheckboxBodyStatus(data);
    } else {
      this.onCheckTableCheckboxBodyStatus();
    }
  };

  onShowRowPopUp = (event: MouseEvent | KeyboardEvent, idx: number): void => {
    event.stopPropagation();
    this.tableBodyList = this.tableBodyList.map(body => {
      return {
        ...body,
        isRowPopUpActive: false,
      };
    });
    this.tableBodyList = this.tableBodyList.map((body, index) => {
      if (index == idx) {
        return {
          ...body,
          isRowPopUpActive: true,
        };
      }
      return body;
    });
  };

  onSetCheckboxBodyToDefault = (): void => {
    const tableBodyList = this.tableBodyList.map(body => {
      return {
        ...body,
        isBodyCheckboxChecked: false,
      };
    });
    this.tableBodyList = tableBodyList;
  };

  onSetModalCheckIconCheckedToDefault = (): void => {
    const tableBodyList = this.tableBodyList.map(body => {
      return {
        ...body,
        isModalCheckIconChecked: false,
      };
    });
    this.tableBodyList = tableBodyList;
  };

  @Output() rowClickEmitter = new EventEmitter();

  onRowClick = (event: MouseEvent | KeyboardEvent, body: ITableBody<T>, idx: number): void => {
    event.stopPropagation();
    if (this.isModal) {
      this.tableBodyList = this.tableBodyList.map((body, index) => {
        if (index == idx) {
          return {
            ...body,
            isModalCheckIconChecked: !body.isModalCheckIconChecked,
          };
        } else {
          return {
            ...body,
            isModalCheckIconChecked: false,
          };
        }
      });
      if (this.tableBodyList[idx].isModalCheckIconChecked) {
        this.rowClickEmitter.emit(body.data);
      } else {
        this.rowClickEmitter.emit();
      }
    } else {
      this.rowClickEmitter.emit(body.data);
    }
  };

  @Output() refreshBtnClickEmitter = new EventEmitter();

  onRefreshBtnClick(): void {
    this.refreshBtnClickEmitter.emit();
  }

  @Output() tableDeleteBtnClickEmitter = new EventEmitter<T>();

  onTableDeleteBtnClick(data: T): void {
    this.data.set(data);
    this.tableDeleteBtnClickEmitter.emit(this.data());
  }

  @Output() cloneBtnClickEmitter = new EventEmitter<T>();

  onCloneBtnClick(data: T): void {
    this.data.set(data);
    this.cloneBtnClickEmitter.emit(this.data());
  }

  ngOnDestroy(): void {
    this.subscribe?.unsubscribe();
  }
}
