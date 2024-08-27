import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { RegisterCompanyApi } from '@core/api/http/company.api';
import { HttpRequestService } from '@core/api/http-request.service';
import { ButtonComponent } from '@components/button/button.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { ICompanyItemGroup, ICompanyGroup } from '@core/interfaces/ICompany';
import { ModalCheckComponent } from '@components/modal/modal-check/modal-check.component';
import { TabComponent } from '@components/tab/tab.component';
import { InputAddonsComponent } from '../../components/input/input-addons/input-addons.component';
import { TableComponent } from '../../components/table/table.component';
import { TableHeaderBoxComponent } from '@components/table-header-box/table-header-box.component';
import { ModalBaseComponent } from '@components/modal/modal-base/modal-base.component';
import { InputFormComponent } from '@components/input/input-form/input-form.component';
import { TableItemType } from '@core/interfaces/IBase';
import { BaseRegister } from '@core/generic/baseRegister';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    FormsModule,
    InputFormComponent,
    ButtonComponent,
    CommonModule,
    PaginationComponent,
    ModalAskComponent,
    ModalInfoComponent,
    ModalCheckComponent,
    ModalBaseComponent,
    LoadingComponent,
    TabComponent,
    InputAddonsComponent,
    TableComponent,
    TableHeaderBoxComponent,
  ],
  providers: [RegisterCompanyApi, HttpRequestService, MatIconModule, PaginationComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent extends BaseRegister implements OnInit {
  constructor(httpRequestService: HttpRequestService) {
    super(httpRequestService);
  }

  ngOnInit(): void {
    this.showTableDataList(this.company, 'company', 1);
    this.company().tableHeaderSelected = this.company().companyTableHeaders;
    this.showOptionList(this.company);
    this.showInputPlaceholder(this.company);
    this.companyItem().tableHeaderSelected = this.companyItem().adressTableHeaders;
    this.showOptionList(this.companyItem);
    this.showInputPlaceholder(this.companyItem);
  }

  public company = signal<ICompanyGroup>({
    companyType: 1,
    arrayTab: ['Clientes', 'Fornecedores', 'MyCompany'],
    arraySelectFilter: [],
    inputValueFilter: '',
    selectValueFilter: 'Id',
    placeholderFilter: '',
    tabIndex: 0,
    isHeaderBoxActive: false,
    tableHeaderSelected: [],
    companyTableHeaders: [
      { id: 0, showHeader: true, name: 'Id' },
      { id: 1, showHeader: true, name: 'Data' },
      { id: 2, showHeader: true, name: 'Apelido' },
      { id: 3, showHeader: true, name: 'Nome' },
      { id: 4, showHeader: true, name: 'CNPJ' },
      { id: 5, showHeader: true, name: 'Ações' },
    ],
    tableDataSelected: [],
    tableItemSelected: {
      idCompany: 0,
      date: new Date().toISOString(),
      nickname: '',
      name: '',
      cnpj: '',
    },
    initialTableData: [],
    companiesData: [],
    companyData: {
      idCompany: 0,
      date: new Date().toISOString(),
      nickname: '',
      name: '',
      cnpj: '',
    },
    tableIdx: 0,
    qtyPerPage: 12,
    isTableExpanded: false,
  });
  public companyItem = signal<ICompanyItemGroup>({
    arrayTab: ['Endereços', 'Projetos', 'Funcionarios'],
    arraySelectFilter: [],
    inputValueFilter: '',
    selectValueFilter: 'Id',
    placeholderFilter: '',
    tabIndex: 0,
    isHeaderBoxActive: false,
    tableHeaderSelected: [
      {
        id: 0,
        showHeader: false,
        name: '',
      },
    ],
    adressTableHeaders: [
      { id: 0, showHeader: true, name: 'Id' },
      { id: 1, showHeader: true, name: 'Tipo' },
      { id: 2, showHeader: true, name: 'Endereço' },
      { id: 3, showHeader: true, name: 'Número' },
      { id: 4, showHeader: true, name: 'Complemento' },
      { id: 5, showHeader: true, name: 'Bairro' },
      { id: 6, showHeader: true, name: 'Cidade' },
      { id: 7, showHeader: true, name: 'UF' },
      { id: 8, showHeader: true, name: 'Ações' },
    ],
    projectTableHeaders: [
      { id: 0, showHeader: true, name: 'Id' },
      { id: 1, showHeader: true, name: 'Data' },
      { id: 2, showHeader: true, name: 'Código' },
      { id: 3, showHeader: true, name: 'Produto' },
      { id: 4, showHeader: true, name: 'SOP' },
      { id: 5, showHeader: true, name: 'Ações' },
    ],
    employeeTableHeaders: [
      { id: 0, showHeader: true, name: 'Id' },
      { id: 1, showHeader: true, name: 'Nome' },
      { id: 2, showHeader: true, name: 'Departamento' },
      { id: 3, showHeader: true, name: 'Cargo' },
      { id: 4, showHeader: true, name: 'E-mail' },
      { id: 5, showHeader: true, name: 'Telefone fixo' },
      { id: 6, showHeader: true, name: 'Celular' },
      { id: 7, showHeader: true, name: 'Ações' },
    ],
    initialTableData: [],
    tableDataSelected: [],
    tableItemSelected: {
      idAddress: 0,
      type: '',
      adress: '',
      number: 0,
      complement: '',
      district: '',
      city: '',
      state: '',
    },
    addressData: {
      idAddress: 0,
      type: '',
      adress: '',
      number: 0,
      complement: '',
      district: '',
      city: '',
      state: '',
    },
    projectData: {
      idProject: 0,
      date: '',
      code: '',
      product: '',
      startOfProduction: '',
    },
    employeeData: {
      idEmployee: 0,
      name: '',
      department: '',
      position: '',
      email: '',
      deskphone: '',
      cellphone: '',
    },
    tableIdx: 0,
    qtyPerPage: 12,
    isTableExpanded: false,
  });

  setCompanyIdx(idx: number): void {
    this.company().tabIndex = idx;
  }

  setCompanyProperty(
    tableItemSelected: TableItemType,
    propertyName: string,
    valueSet: string
  ): void {
    if (this.isTypeValid(tableItemSelected, 'company')) {
      switch (propertyName) {
        case 'idCompany': {
          tableItemSelected.idCompany = Number(valueSet);
          break;
        }
        case 'nickname': {
          tableItemSelected.nickname = valueSet;
          break;
        }
        case 'name': {
          tableItemSelected.name = valueSet;
          break;
        }
        case 'cnpj': {
          tableItemSelected.cnpj = valueSet;
          break;
        }
      }
      this.isClearInputForm.set(false);
    }
  }

  modalCheckCompany = signal({
    idCompany: 0,
    nickname: '',
    name: '',
    cnpj: '',
  });

  isModalCheckActive = signal(false);

  showModalCheck(tableItemSelected: TableItemType): void {
    this.isModalCheckActive.set(true);
    if (this.isTypeValid(tableItemSelected, 'company')) {
      this.modalCheckCompany().idCompany = tableItemSelected.idCompany;
      this.modalCheckCompany().nickname = tableItemSelected.nickname;
      this.modalCheckCompany().name = tableItemSelected.name;
      this.modalCheckCompany().cnpj = tableItemSelected.cnpj;
    }
  }

  addNewCompany(tableItemSelected: TableItemType): void {
    if (this.isTypeValid(tableItemSelected, 'company')) {
      this.addRegister(tableItemSelected, 'company', this.company().companyType);
    }
  }

  /**
   * getCustomers
   * Get companines list from database
   * @returns Promise<void>
   */
  // async showCompaniesList(companyType: number): Promise<void> {
  //   try {
  //     this.showLoading.set(true);
  //     const companies = await this.registerCompanyApi.getCompaniesList(companyType);
  //     console.log(companies);
  //     this.company().companiesData = companies.data;
  //   } catch (e) {
  //     this.handleModal('failure', (e as Error).message);
  //   } finally {
  //     this.showLoading.set(false);
  //   }
  // }

  // async addNewCompany() {
  //   try {
  //     this.showLoading.set(true);
  //     const companyData = await this.registerCompanyApi.addNewCompany(this.company().companyData);
  //     this.handleModal('success', companyData.message);
  //   } catch (e) {
  //     this.handleModal('failure', (e as Error).message);
  //   } finally {
  //     this.showLoading.set(false);
  //   }
  // }

  // async updateCompany() {
  //   try {
  //     this.showLoading.set(true);
  //     const companyData = await this.registerCompanyApi.updateCompany(
  //       this.company().companyData,
  //       this.company().companyData.idCompany
  //     );
  //     this.handleModal('success', companyData.message);
  //   } catch (e) {
  //     this.handleModal('failure', (e as Error).message);
  //   } finally {
  //     this.showLoading.set(false);
  //   }
  // }

  // async deleteCompany(): Promise<void> {
  //   try {
  //     this.showLoading.set(true);
  //     const companyData = await this.registerCompanyApi.deleteRegister(
  //       this.company().companyData.idCompany
  //     );
  //     this.handleModal('success', companyData.message);
  //     this.isModalInfoActive = true;
  //   } catch (e) {
  //     this.handleModal('failure', (e as Error).message);
  //     this.isModalInfoActive = true;
  //   } finally {
  //     this.showLoading.set(false);
  //   }
  // }

  // public isModalCompanyActive = false;

  // showModalNewCompany(): void {
  //   this.isModalCompanyActive = true;
  // }

  // public isModalAskActive = false;

  // handleModal(type: string, description: string): void {
  //   this.modalData.type = type;
  //   this.modalData.description = description;
  // }

  // showModalAskToDeleteCompany(data: IPageGroup): void {
  //   if (this.isTypeValid(data, 'company')) {
  //     this.company().companyData = data;
  //     this.handleModal('confirmation', `Deseja excluir ${this.company().companyData.name}?`);
  //   } else if (this.isTypeValid(data, 'address')) {
  //     this.companyItem().addressData = data;
  //     this.handleModal('confirmation', `Deseja excluir ${this.companyItem().addressData.adress}?`);
  //   } else if (this.isTypeValid(data, 'project')) {
  //     this.companyItem().projectData = data;
  //     this.handleModal('confirmation', `Deseja excluir ${this.companyItem().projectData.code}?`);
  //   } else if (this.isTypeValid(data, 'employee')) {
  //     this.companyItem().employeeData = data;
  //     this.handleModal('confirmation', `Deseja excluir ${this.companyItem().employeeData.name}?`);
  //   }

  //   this.isModalAskActive = true;
  // }

  // public isModalFormCompanyActive = false;
  // public isEditForm = false;

  // showModalFormToEditCompany(data: IPageGroup): void {
  //   if (this.isTypeValid(data, 'company')) {
  //     this.company().companyData = { ...data };
  //   } else if (this.isTypeValid(data, 'address')) {
  //     this.companyItem().addressData = { ...data };
  //   } else if (this.isTypeValid(data, 'project')) {
  //     this.companyItem().projectData = { ...data };
  //   } else if (this.isTypeValid(data, 'employee')) {
  //     this.companyItem().employeeData = { ...data };
  //   }
  //   this.isEditForm = true;
  //   this.isModalFormCompanyActive = true;
  // }

  // public isModalCheckActive = false;

  // closeModalCheckEvent() {
  //   return;
  // }

  // OnModalAskActionOk(): void {
  //   this.isModalAskActive = false;
  // }
}
