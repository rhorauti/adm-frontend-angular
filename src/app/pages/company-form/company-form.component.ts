import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { SelectComponent } from '@components/select/select.component';
import { AddressStore } from '@store/address/address.store';
import { CompanyStore } from '@store/company/company.store';
import { EmployeeStore } from '@store/employee/employee.store';
import { ModalStore } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';

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
export class CompanyFormComponent implements OnInit, OnDestroy {
  readonly companyStore = inject(CompanyStore);
  readonly addressStore = inject(AddressStore);
  readonly employeeStore = inject(EmployeeStore);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);

  subscription: Subscription | undefined = undefined;
  idCompany = 0;
  companyName = this.companyStore.companyData().name;

  ngOnInit(): void {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.idCompany = Number(params.get('id')) || 0;
    });
    this.addressStore.onGetAddressInfo(Number(this.idCompany));
    this.employeeStore.onGetEmployeeInfo(Number(this.idCompany));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  formTitle = computed(() => {
    if (this.idCompany == 0) {
      return 'Nova Empresa';
    } else {
      return this.companyName;
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
