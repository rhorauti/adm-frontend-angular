import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { RouterModule } from '@angular/router';
import { ModalStore } from '@store/modal/modal.store';
import { BaseRegisterStore } from '@store/base/base.register.store';
import { BaseType, KeyOfData } from '@core/types/base.type';
import { IProduct } from '@core/interfaces/product.interface';

@Component({
  selector: 'app-table',
  imports: [CommonModule, FormsModule, MatIconModule, ButtonCloseComponent, RouterModule],
  providers: [provideNgxMask(), NgxMaskPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit, OnDestroy {
  @ViewChildren('divBoxes') private divBoxes!: QueryList<ElementRef>;
  @ViewChildren('iconOptions', { read: ElementRef }) private iconOptions!: QueryList<ElementRef>;
  private document = inject(DOCUMENT);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  readonly modalStore = inject(ModalStore);
  readonly mask = inject(NgxMaskPipe);
  dataList = computed<BaseType[]>(() => this.baseRegisterStore.dataList());

  ngOnInit() {
    this.baseRegisterStore.onCheckTableCheckboxStatus(this.baseRegisterStore.tableCheckbox().body);
    this.document.addEventListener('mousedown', this.onTableItemClick);
  }

  ngOnDestroy(): void {
    this.document.removeEventListener('mousedown', this.onTableItemClick);
  }

  gridTemplateColumns = computed(() => {
    const columnsWidth: string[] = ['2fr'];
    this.baseRegisterStore.tableHeaders().forEach(header => {
      if (header.isHeaderActive) {
        if (header.id != 0 && header.id != 2) {
          columnsWidth.push('2fr');
        } else if (header.id == 2) {
          columnsWidth.push('3fr');
        } else {
          columnsWidth.push('1fr');
        }
      }
    });
    return columnsWidth.join(' ');
  });

  onTableItemClick = (event: MouseEvent): void => {
    const targetNode = event.target as Node;
    if (
      !this.divBoxes.some(box => box && box.nativeElement.contains(targetNode)) &&
      !this.iconOptions.some(icon => icon && icon.nativeElement.contains(targetNode))
    ) {
      this.baseRegisterStore.onSetSlicePropsToNewValue(
        'tableItemsBox',
        this.baseRegisterStore.tableItemsBox().map(() => false)
      );
    } else {
      return;
    }
  };

  computedFirstRegister = computed(() => {
    return (
      (this.baseRegisterStore.pagination().currentPage - 1) *
      this.baseRegisterStore.pagination().qtyPerPage
    );
  });

  computedLastRegister = computed(() => {
    return (
      this.baseRegisterStore.pagination().currentPage *
      this.baseRegisterStore.pagination().qtyPerPage
    );
  });

  getCnpj(row: BaseType): string {
    return (row as any)?.cnpj ?? (row as any)?.company?.cnpj ?? '';
  }

  setCnpjMask(cnpj: string): string {
    return (cnpj?.length ?? 0) > 11 ? '00.000.000/0000-00' : '000.000.000-00';
  }

  formatCell(row: BaseType, key: KeyOfData): string {
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

  onSetOrigin(data: BaseType): string {
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

  @Output() rowClickEmitter = new EventEmitter();

  onRowClick(data: BaseType): void {
    this.rowClickEmitter.emit(data);
  }

  @Output() refreshBtnClickEmitter = new EventEmitter();

  onRefreshBtnClick(): void {
    this.refreshBtnClickEmitter.emit();
  }

  @Output() deleteBtnClickEmitter = new EventEmitter();

  onDeleteBtnClick(data: BaseType): void {
    this.deleteBtnClickEmitter.emit(data);
  }

  @Output() cloneBtnClickEmitter = new EventEmitter();

  onCloneBtnClick(data: BaseType): void {
    this.cloneBtnClickEmitter.emit(data);
  }
}
