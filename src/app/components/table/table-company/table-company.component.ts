import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { CompanyStore } from '@store/company/company.store';
import { MatIconModule } from '@angular/material/icon';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { RouterModule } from '@angular/router';
import { ModalStore } from '@store/modal/modal.store';
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
  readonly companyStore = inject(CompanyStore);
  readonly modalStore = inject(ModalStore);
  private document = inject(DOCUMENT);
  @ViewChildren('divBoxes') private divBoxes!: QueryList<ElementRef>;
  @ViewChildren('iconOptions', { read: ElementRef }) private iconOptions!: QueryList<ElementRef>;

  ngOnInit() {
    this.companyStore.onCheckTableCheckboxStatus(this.companyStore.tableCheckbox().body);
    this.document.addEventListener('mousedown', this.onTableItemClick);
  }

  ngOnDestroy(): void {
    this.document.removeEventListener('mousedown', this.onTableItemClick);
  }

  gridTemplateColumns = computed(() => {
    const columnsWidth: string[] = ['2fr'];
    this.companyStore.tableHeaders().forEach(header => {
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
      this.companyStore.onCloseTableItemsBox();
    } else {
      return;
    }
  };

  computedFirstRegister = computed(() => {
    return (
      (this.companyStore.pagination().currentPage - 1) * this.companyStore.pagination().qtyPerPage
    );
  });

  computedLastRegister = computed(() => {
    return this.companyStore.pagination().currentPage * this.companyStore.pagination().qtyPerPage;
  });

  setMask(type: string, idx?: number): string {
    if (type == 'cnpj') {
      if ((this.companyStore.companiesData()[idx || 0]?.cnpj || '')?.length > 11) {
        return '00.000.000/0000-00';
      } else {
        return '000.000.000-00';
      }
    } else {
      return '';
    }
  }

  onShowModalAskToDelete(event: MouseEvent | KeyboardEvent, companyData: ICompany): void {
    event.stopPropagation();
    this.companyStore.onSetCompanyData(companyData);
    this.modalStore.onShowAskModal(
      'Excluir Registro',
      `Deseja excluir o registro <b>${this.companyStore.companyData().name || ''}</b>?`,
      this.onCloseAskModalActionOk
    );
  }

  onCloseAskModalActionOk = (): void => {
    this.companyStore.onDeleteRegister(this.companyStore.companyData().idCompany);
  };
}
