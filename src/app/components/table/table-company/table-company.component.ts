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
import { TableBaseComponent } from '@components/table/table-base/table-base.component';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { CompanyStore } from '@store/company/company.store';
import { MatIconModule } from '@angular/material/icon';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-table-company',
  imports: [
    CommonModule,
    FormsModule,
    TableBaseComponent,
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

  onTableItemClick = (event: MouseEvent): void => {
    const targetNode = event.target as Node;
    if (
      !this.divBoxes.some(box => box && box.nativeElement.contains(targetNode)) &&
      !this.iconOptions.some(icon => icon && icon.nativeElement.contains(targetNode))
    ) {
      this.companyStore.onCloseTableItemBox();
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
}
