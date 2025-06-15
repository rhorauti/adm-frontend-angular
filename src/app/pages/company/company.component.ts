import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from '@components/tab/tab.component';
import { TableCompanyComponent } from '../../components/table/table-company/table-company.component';
import { ModalBaseComponent } from '@components/modal/modal-base/modal-base.component';
import { TableAddressComponent } from '@components/table/table-address/table-address.component';
import { TableEmployeeComponent } from '@components/table/table-employee/table-employee.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-company',
    imports: [
        CommonModule,
        TabComponent,
        TableCompanyComponent,
        TableAddressComponent,
        TableEmployeeComponent,
        ModalBaseComponent,
        BreadcrumbComponent,
    ],
    templateUrl: './company.component.html',
    styleUrl: './company.component.scss'
})
export class CompanyComponent {
  companyTabIdx = 0;
  modalTabIdx = 0;
  showModal = false;
  idCompany = 0;
  breadcrumb = ['Cadastro', 'Empresas'];

  onChangeTabIdx(type: string, idx: number): void {
    if (type == 'company') {
      this.companyTabIdx = idx;
    } else {
      this.modalTabIdx = idx;
    }
  }
}
