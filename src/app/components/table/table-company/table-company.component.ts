import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { TableBaseComponent } from '@components/table/table-base/table-base.component';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FormsModule } from '@angular/forms';
import { CompanyStore } from '@store/company/company.store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-table-company',
  imports: [CommonModule, FormsModule, TableBaseComponent, NgxMaskPipe, MatIconModule],
  providers: [provideNgxMask()],
  templateUrl: './table-company.component.html',
  styleUrl: './table-company.component.scss',
})
export class TableCompanyComponent implements OnInit {
  companyStore = inject(CompanyStore);

  ngOnInit() {
    this.companyStore.onCheckTableCheckboxStatus(this.companyStore.tableCheckbox().body);
  }

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
