import { CommonModule, DOCUMENT } from '@angular/common';
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
  QueryList,
  ViewChildren,
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
import { BaseType, KeyOfData } from '@core/types/base.type';
import { IProduct } from '@core/interfaces/product.interface';
import { ITableCheckbox, ITableHeader } from '@core/interfaces/table.interface';
import { defaultTableHeaderIcon } from '@store/base/base.register.store';
import { DataService } from '@core/services/data.service';
import { Subscription } from 'rxjs';
import { onSetIconStatus, onSetIconStatusBackgroundColor } from 'app/enum/status.enum';

interface StatusIcon {
  iconName: string;
  backgroundColor: string;
}

@Component({
  selector: 'app-table',
  imports: [CommonModule, FormsModule, MatIconModule, ButtonCloseComponent, RouterModule],
  providers: [provideNgxMask(), NgxMaskPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T = BaseType> implements OnInit, OnDestroy, OnChanges {
  @ViewChildren('divRowModal') private divRowModal!: QueryList<ElementRef>;
  @ViewChildren('rowIconOptions', { read: ElementRef })
  private rowIconOptions!: QueryList<ElementRef>;

  readonly elRef = inject(ElementRef);
  readonly document = inject(DOCUMENT);
  readonly mask = inject(NgxMaskPipe);
  readonly dataService = inject(DataService);
  private subscribe!: Subscription;

  @Input() initialDataList: T[] = [];
  @Input() tableHeaders: ITableHeader<T>[] = [];
  @Input() isModal = false;
  @Input() currentPage = signal<number>(1);

  gridTemplateColumns = '';

  qtyPerPage = 10;
  dataList: T[] = [];
  rowModalVisibilityControlList: boolean[] = [];
  tableCheckBox: ITableCheckbox = { header: false, body: [] };
  icons: StatusIcon[] = [];

  ngOnInit(): void {
    this.dataList = [...this.initialDataList] as T[];
    this.subscribe = this.dataService.emitEvent.subscribe(currentPage => {
      this.currentPage.set(currentPage);
    });
    this.onSetCheckboxArrayToDefault();
    this.onCreateTableItemsBoxArray();
    this.onGridTemplateColumnsChange();
    this.onCreateTableIconArray();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialDataList']) {
      this.dataList = [...this.initialDataList] as T[];
      this.onSetSortFilterToDefault();
      this.onCreateTableIconArray();
    }
    if (changes['tableHeaders']) {
      this.onGridTemplateColumnsChange();
    }
  }

  onCreateTableIconArray = (): void => {
    this.icons = Array.from({ length: this.dataList.length }, (_, i) => {
      const row = this.dataList[i] as any;
      const value = row?.status ?? row?.statusId ?? undefined;
      return {
        iconName: onSetIconStatus(value),
        backgroundColor: onSetIconStatusBackgroundColor(value),
      };
    });
  };

  @Output() isDelBtnDisabledEmitter = new EventEmitter();
  @Output() tableDataEmitter = new EventEmitter();

  onCheckTableCheckboxBodyStatus = (array: boolean[], data?: T): void => {
    const bodyCheckboxListUpdated = array.filter(element => element == true);
    this.tableCheckBox.header = bodyCheckboxListUpdated.length > 0;
    this.isDelBtnDisabledEmitter.emit(bodyCheckboxListUpdated.length != 1);
    if (data) this.tableDataEmitter.emit(data);
  };

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.rowModalVisibilityControlList = this.rowModalVisibilityControlList.map(() => false);
    }
  }

  onCreateTableItemsBoxArray = (): void => {
    this.rowModalVisibilityControlList = Array.from({ length: this.dataList.length }, () => false);
  };

  trackByHeaderId = (_: number, header: any): number => header.id;
  trackByDataId = (index: number, data: any): string => {
    const id = data.id || data.idTask || data.idProduct || 'no-id';
    return `${id}-${index}`;
  };

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

  @Output() rowClickEmitter = new EventEmitter();

  onRowClick = (event: MouseEvent | KeyboardEvent, data: T): void => {
    event.stopPropagation();
    this.rowClickEmitter.emit(data);
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

  formatCell(row: T, key: KeyOfData): string {
    const value = (row as any)?.[key];

    switch (key) {
      case 'cnpj': {
        const raw = this.getCnpj(row);
        const expr = this.setCnpjMask(raw);
        return this.mask.transform(raw, expr) ?? '';
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
  onFilterThroughSort = <K extends keyof T>(idx: number): T[] => {
    if (!this.dataList || this.dataList.length == 0) return [];
    const keyId = Object.keys(this.dataList[0] as unknown as object)[0] as K;
    const header = this.tableHeaders[idx];
    const key = header.databaseField as K;
    const sortDirection = header.sortDirection;
    if (this.tableHeaders[idx].sortDirection == 0) {
      return [
        ...this.dataList.sort((a, b) => {
          const valueA = a[keyId];
          const valueB = b[keyId];
          if (typeof valueA === 'number' && typeof valueB === 'number') {
            return valueB - valueA;
          }
          return 0;
        }),
      ];
    } else {
      return [
        ...this.dataList.sort((a, b) => {
          const valueA = a[key];
          const valueB = b[key];
          let comparison = 0;
          if (typeof valueA === 'number' && typeof valueB === 'number') {
            comparison = ((valueA as number) - valueB) as number;
          } else if (typeof valueA === 'string' && typeof valueB === 'string') {
            comparison = (valueA as string).localeCompare(valueB as string);
          }
          return sortDirection == 2 ? comparison * -1 : comparison;
        }),
      ];
    }
  };

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

  onSetTableDataSortDirectionToDefault = <K extends keyof T>(): void => {
    const keyId = Object.keys(this.dataList)[0] as K;
    if (!keyId) return;
    this.dataList.sort((a, b) => {
      const last = b[keyId] as number;
      const first = a[keyId] as number;
      return last - first;
    });
  };

  onClickOnFilterBtnThroughSort = (idx: number): void => {
    this.onSetTableHeaderSortMethod(idx || 0);
    this.onSetTableHeaderIcon();
    this.dataList = this.onFilterThroughSort(idx || 0);
  };

  onSetSortFilterToDefault = (): void => {
    this.onSetTableDataSortDirectionToDefault();
    this.onSetSortStateToDefault();
  };

  onSetSortStateToDefault = (): void => {
    this.tableHeaders = this.tableHeaders.map(header => {
      return { ...header, sort: 0, icon: defaultTableHeaderIcon };
    });
  };

  onHeaderCheckboxChecked = (event: Event): void => {
    const newValue = (event.target as HTMLInputElement).checked;
    this.tableCheckBox.body = this.tableCheckBox.body.map(() => newValue);
    this.onCheckTableCheckboxBodyStatus(this.tableCheckBox.body);
  };

  onBodyCheckboxCheckChange = (index: number, event: Event, data?: T) => {
    const newValue = (event.target as HTMLInputElement).checked;
    this.tableCheckBox.body = this.tableCheckBox.body.map((element, idx) =>
      idx == index ? (element = newValue) : element
    );
    if (newValue) {
      this.onCheckTableCheckboxBodyStatus(this.tableCheckBox.body, data);
    } else {
      this.onCheckTableCheckboxBodyStatus(this.tableCheckBox.body);
    }
  };

  onShowTableItemBox = (event: MouseEvent | KeyboardEvent, idx: number): void => {
    event.stopPropagation();
    this.rowModalVisibilityControlList = this.rowModalVisibilityControlList.map((value, index) => {
      if (!value && index == idx) {
        return true;
      } else {
        return false;
      }
    });
  };

  onSetCheckboxArrayToDefault = (): void => {
    this.tableCheckBox.body = Array.from({ length: this.dataList.length }, () => false);
  };

  @Output() refreshBtnClickEmitter = new EventEmitter();

  onRefreshBtnClick(): void {
    this.refreshBtnClickEmitter.emit();
  }

  @Output() deleteBtnClickEmitter = new EventEmitter<T>();

  onDeleteBtnClick(data: T): void {
    console.log('table data', data);
    this.deleteBtnClickEmitter.emit(data);
  }

  @Output() cloneBtnClickEmitter = new EventEmitter<T>();

  onCloneBtnClick(data: T): void {
    this.cloneBtnClickEmitter.emit(data);
  }

  ngOnDestroy(): void {
    this.subscribe?.unsubscribe();
  }
}
