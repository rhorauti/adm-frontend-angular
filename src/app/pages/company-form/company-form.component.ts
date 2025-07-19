import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { CompanyStore } from '@store/company/company.store';
import { ModalStore } from '@store/modal/modal.store';

@Component({
  selector: 'app-company-form',
  imports: [BreadcrumbComponent, CommonModule, ButtonLabelComponent, FormsModule, InputComponent],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss',
})
export class CompanyFormComponent {
  readonly companyStore = inject(CompanyStore);
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
}
