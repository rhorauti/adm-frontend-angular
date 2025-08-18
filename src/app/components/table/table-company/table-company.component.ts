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
import { ICompany } from '@core/interfaces/company.interface';

@Component({
  selector: 'app-table-company',
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskPipe,
    MatIconModule,
    ButtonCloseComponent,
    RouterModule,
  ],
  providers: [provideNgxMask()],
  templateUrl: './table-company.component.html',
  styleUrl: './table-company.component.scss',
})
export class TableCompanyComponent implements OnInit, OnDestroy {
  @ViewChildren('divBoxes') private divBoxes!: QueryList<ElementRef>;
  @ViewChildren('iconOptions', { read: ElementRef }) private iconOptions!: QueryList<ElementRef>;
  private document = inject(DOCUMENT);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  readonly modalStore = inject(ModalStore);
  companiesData: ICompany[] = [];

  ngOnInit() {
    this.baseRegisterStore.onCheckTableCheckboxStatus(this.baseRegisterStore.tableCheckbox().body);
    this.document.addEventListener('mousedown', this.onTableItemClick);
    this.companiesData = this.baseRegisterStore.dataList() as ICompany[];
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

  setMask(type: string, idx?: number): string {
    if (type == 'cnpj') {
      if (((this.baseRegisterStore.dataList()[idx || 0] as ICompany)?.cnpj || '')?.length > 11) {
        return '00.000.000/0000-00';
      } else {
        return '000.000.000-00';
      }
    } else {
      return '';
    }
  }

  onRedirectToEditPage = (companyData: ICompany): void => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', companyData);
    this.modalStore.onRedirectPage(
      `/companies/edit/${(this.baseRegisterStore.data() as ICompany).idCompany}`
    );
  };

  // onShowModalAskToDelete(event: MouseEvent | KeyboardEvent, companyData: ICompany): void {
  //   event.stopPropagation();
  //   this.baseRegisterStore.onSetSlicePropsToNewValue('data', companyData);
  //   this.modalStore.onShowAskModal(
  //     'Excluir Registro',
  //     `Deseja excluir o registro <b>${(this.baseRegisterStore.data() as ICompany).name || ''}</b>?`,
  //     this.onCloseAskModalActionOk
  //   );
  // }

  // onCloseAskModalActionOk = (): void => {
  //   this.baseRegisterStore.onDeleteRegister((this.baseRegisterStore.data() as ICompany).idCompany);
  // };

  @Output() refreshBtnClickEmitter = new EventEmitter();

  onRefreshBtnClick(): void {
    this.refreshBtnClickEmitter.emit();
  }

  @Output() deleteBtnClickEmitter = new EventEmitter();

  onDeleteBtnClick(): void {
    this.deleteBtnClickEmitter.emit();
  }

  @Output() cloneBtnClickEmitter = new EventEmitter();

  onCloneBtnClick(companyData: ICompany): void {
    this.cloneBtnClickEmitter.emit(companyData);
  }
}
