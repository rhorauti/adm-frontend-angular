import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCompanyComponent } from '../../components/table/table-company/table-company.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { CompanyStore } from '@store/company/company.store';
import { TableHeaderBoxComponent } from '@components/side-bar/side-bar.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { ButtonLabelComponent } from '../../components/button/button-label/button-label.component';
import { ButtonDeleteComponent } from '../../components/button/button-delete/button-delete.component';
import { ButtonIconComponent } from '../../components/button/button-icon/button-icon.component';
import { TooltipComponent } from '@components/tooltip/tooltip.component';
import { ToogleButtonComponent } from '../../components/toogle-button/toogle-button.component';
import { InputComponent } from '@components/input/input.component';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { ModalStore } from '@store/modal/modal.store';
import { ICompany } from '@core/interfaces/company.interface';
import { AuthStore } from '@store/auth/auth.store';
import { loadStorage } from '@core/utils/misc';

@Component({
  selector: 'app-maintenance',
  imports: [
    CommonModule,
    TableHeaderBoxComponent,
    InputComponent,
    TableCompanyComponent,
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
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
})
export class MaintenanceComponent implements OnInit {
  readonly companyStore = inject(CompanyStore);
  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);

  tableHeadersLocalStorageId = 'table_headers_company' + this.authStore.user().id;

  async ngOnInit() {
    this.companyStore.onShowDataList();
    const tableHeaders = loadStorage(this.tableHeadersLocalStorageId);
    if (tableHeaders) {
      this.companyStore.onSetTableHeaders(tableHeaders);
    }
  }

  async onDeleteCompany(): Promise<void> {
    const itemToDelete = this.companyStore.itemSelected() as ICompany;
    await this.companyStore.onDeleteRegister(itemToDelete?.idCompany);
  }

  onShowModalToDelete(): void {
    this.modalStore.onShowAskModal(
      'Cadastro de empresas',
      `Deseja excluir o registro <b>${this.companyStore.itemSelected()?.name || ''}</b>?`,
      () => this.onDeleteCompany()
    );
  }
}
