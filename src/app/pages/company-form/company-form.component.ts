import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { SelectComponent } from '@components/select/select.component';
import { AddressStore } from '@store/address/address.store';
import { CompanyStore } from '@store/company/company.store';
import { EmployeeStore } from '@store/employee/employee.store';
import { ModalStore } from '@store/modal/modal.store';

@Component({
  selector: 'app-company-form',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    ButtonLabelComponent,
    FormsModule,
    InputComponent,
    SelectComponent,
    ModalInfoComponent,
  ],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss',
})
export class CompanyFormComponent {
  readonly companyStore = inject(CompanyStore);
  readonly addressStore = inject(AddressStore);
  readonly employeeStore = inject(EmployeeStore);
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);

  formTitle = computed(() => {
    if (this.companyStore.tab().selectedTabIdx == 0) {
      return 'Novo Cliente';
    } else if (this.companyStore.tab().selectedTabIdx == 1) {
      return 'Novo Fornecedor';
    } else {
      return 'MyCompany';
    }
  });

  onCloseCompanyFormInfoModal(): void {
    this.modalStore.onCloseInfoModal(() => {
      this.addressStore.onClearData();
      this.employeeStore.onClearData();
      this.companyStore.onShowDataList();
      this.modalStore.onRedirectPage('/companies');
    });
  }

  onBackToCompaniesPage(): void {
    this.addressStore.onClearData();
    this.employeeStore.onClearData();
    this.companyStore.onClearData();
    this.modalStore.onRedirectPage('/companies');
  }
}
