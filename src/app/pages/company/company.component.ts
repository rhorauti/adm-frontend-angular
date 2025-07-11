import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from '@components/tab/tab.component';
import { TableCompanyComponent } from '../../components/table/table-company/table-company.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { CompanyStore } from '@store/company/company.store';
import { TableHeaderBoxComponent } from '@components/side-bar/side-bar.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { InputAddonsContract } from '@core/component-contract/input-addons.contract';
import { TabContract } from '@core/component-contract/tab.contract';
import { MatIconModule } from '@angular/material/icon';
import { LoadingContract } from '@core/component-contract/loading.contract';
import { ButtonLabelComponent } from '../../components/button/button-label/button-label.component';
import { ButtonDeleteComponent } from '../../components/button/button-delete/button-delete.component';
import { ButtonIconComponent } from '../../components/button/button-icon/button-icon.component';
import { TooltipComponent } from '@components/tooltip/tooltip.component';
import { ToogleButtonComponent } from '../../components/toogle-button/toogle-button.component';
import { InputComponent } from '@components/input/input.component';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';

@Component({
  selector: 'app-company',
  imports: [
    CommonModule,
    TabComponent,
    TableHeaderBoxComponent,
    InputComponent,
    TableCompanyComponent,
    PaginationComponent,
    BreadcrumbComponent,
    ModalAskComponent,
    ModalInfoComponent,
    LoadingComponent,
    MatIconModule,
    ButtonLabelComponent,
    ButtonDeleteComponent,
    ButtonIconComponent,
    TooltipComponent,
    ToogleButtonComponent,
    ButtonCloseComponent,
  ],
  providers: [
    { provide: InputAddonsContract, useClass: CompanyStore },
    { provide: TabContract, useClass: CompanyStore },
    { provide: LoadingContract, useClass: CompanyStore },
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent implements OnInit {
  readonly companyStore = inject(CompanyStore);
  breadcrumb = ['Cadastro', 'Empresas'];
  isLoading = false;

  async ngOnInit() {
    this.companyStore.onShowDataList();
  }
}
