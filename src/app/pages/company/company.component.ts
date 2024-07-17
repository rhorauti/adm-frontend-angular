import { AfterViewInit, Component, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { ModalFormCompanyComponent } from '@components/modal/modal-form-company/modal-form-company.component';
import { RegisterCompanyApi } from '@core/api/http/company.api';
import { HttpRequestService } from '@core/api/http-request.service';
import { ButtonComponent } from '@components/button/button.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import {
  ICompanyItemGroup,
  ICompanyGroup,
  ICompanyPageGroup,
  ICompany,
} from '@core/interfaces/ICompany';
import { ITableHeader } from '@core/interfaces/ITableHeader';
import { ModalCheckComponent } from '@components/modal/modal-check/modal-check.component';
import { TabComponent } from '@components/tab/tab.component';
import { InputAddonsComponent } from '../../components/input/input-addons/input-addons.component';
import { TableComponent } from '../../components/table/table.component';
import { TableHeaderBoxComponent } from '@components/table-header-box/table-header-box.component';
import { ActivatedRoute } from '@angular/router';
import { IAdress } from '@core/interfaces/IAdress';
import { IProject } from '@core/interfaces/IProject';
import { IEmployee } from '@core/interfaces/IEmployee';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    CommonModule,
    PaginationComponent,
    ModalFormCompanyComponent,
    ModalAskComponent,
    ModalInfoComponent,
    ModalCheckComponent,
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
export class CompanyComponent implements AfterViewInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private registerCompanyApi: RegisterCompanyApi
  ) {}

  ngAfterViewInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.company().companyType = Number(params.get('company-type'));
      this.showInputPlaceholder(this.company);
      this.showInputPlaceholder(this.companyItem);
      this.showCompaniesList(Number(this.company().companyType));
      this.checkOptionListCompany(this.company);
      this.checkOptionListCompanyItem(this.companyItem);
    });
  }

  public showLoading = signal(false);
  public company = signal<ICompanyGroup>({
    companyType: 0,
    arrayTab: ['Clientes', 'Fornecedores', 'MyCompany'],
    arraySelectFilter: [],
    inputValueFilter: '',
    selectValueFilter: '',
    placeholderFilter: '',
    tabIndex: 0,
    isHeaderBoxActive: false,
    tableHeaders: [
      { id: 0, showHeader: true, name: 'Id' },
      { id: 1, showHeader: true, name: 'Data' },
      { id: 2, showHeader: true, name: 'Apelido' },
      { id: 3, showHeader: true, name: 'Nome' },
      { id: 4, showHeader: true, name: 'CNPJ' },
      { id: 5, showHeader: true, name: 'Ações' },
    ],
    initialTableData: [],
    companiesData: [],
    companyData: {
      idCompany: 0,
      type: 0,
      date: new Date().toISOString(),
      nickname: '',
      name: '',
      cnpj: '',
    },
    tableIdx: 0,
    qtyPerPage: 12,
  });
  public companyItem = signal<ICompanyItemGroup>({
    arrayTab: ['Endereços', 'Projetos', 'Funcionarios'],
    arraySelectFilter: [],
    inputValueFilter: '',
    selectValueFilter: '',
    placeholderFilter: '',
    tabIndex: 0,
    isHeaderBoxActive: false,
    tableHeaderSelected: [],
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
    adressData: {
      idAdress: 0,
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
  });

  checkOptionListCompany(companyGroup: Signal<ICompanyGroup>): void {
    companyGroup().arraySelectFilter = [];
    companyGroup().tableHeaders.forEach(header => {
      if (header.showHeader) {
        companyGroup().arraySelectFilter.push(header.name);
      }
    });
  }

  checkOptionListCompanyItem(companyItemGroup: Signal<ICompanyItemGroup>): void {
    companyItemGroup().arraySelectFilter = [];
    companyItemGroup().tableHeaderSelected.forEach(header => {
      if (header.showHeader) {
        companyItemGroup().arraySelectFilter.push(header.name);
      }
    });
    this.showInputPlaceholder(companyItemGroup);
  }

  isCompany(data: any): data is ICompany {
    return (data as ICompany).idCompany != undefined;
  }

  isAdress(data: any): data is IAdress {
    return (data as IAdress).idAdress != undefined;
  }

  isProject(data: any): data is IProject {
    return (data as IProject).idProject != undefined;
  }

  isEmployee(data: any): data is IEmployee {
    return (data as IEmployee).idEmployee != undefined;
  }

  showInputPlaceholder(companyData: Signal<ICompanyGroup> | Signal<ICompanyItemGroup>): void {
    companyData().placeholderFilter = `Digite um(a) ${companyData().selectValueFilter}`;
  }

  /**
   * showTableHeader
   * Mostra ou esconde a coluna da tabela selecionada e atualiza o select do filtro.
   * @param header ICompanyTableHeaders
   */
  showTableHeader(header: ITableHeader): void {
    header.showHeader = !header.showHeader;
  }

  // filterCompanyTable(inputValue: string): void {
  //   if (!inputValue) {
  //     this.companiesData.set(
  //       this.companyInitialTableData().slice(this.tableIdx(), this.tableIdx() + this.QtyPerPage)
  //     );
  //   } else {
  //     this.companiesData.set(
  //       this.companyInitialTableData().filter(company =>
  //         String(company[this.company().selectValueFilter.toLowerCase() as keyof ICompany])
  //           .toLowerCase()
  //           .includes(String(this.company().inputValueFilter).toLowerCase().trim())
  //       )
  //     );
  //   }
  // }

  /**
   * getCustomers
   * Solicita um lista de clientes registrados no banco de dados.
   * @returns Promise de sucesso com status, mensagem e array de dados cadastrais do cliente. No caso de erro, retorna somente o status e mensagem.
   */
  async showCompaniesList(companyType: number): Promise<void> {
    try {
      this.showLoading.set(true);
      const companies = await this.registerCompanyApi.getCompaniesList(companyType);
      console.log(companies);
      this.company().companiesData = companies.data;
    } catch (e: any) {
      this.handleModal('failure', e.message);
    } finally {
      this.showLoading.set(false);
    }
  }

  async addNewCompany() {
    try {
      this.showLoading.set(true);
      const companyData = await this.registerCompanyApi.addNewCompany(this.company().companyData);
      this.handleModal('success', companyData.message);
    } catch (e: any) {
      this.handleModal('failure', e.message);
    } finally {
      this.showLoading.set(false);
    }
  }

  async updateCompany() {
    try {
      this.showLoading.set(true);
      const companyData = await this.registerCompanyApi.updateCompany(
        this.company().companyData,
        this.company().companyData.idCompany
      );
      this.handleModal('success', companyData.message);
    } catch (e: any) {
      this.handleModal('failure', e.message);
    } finally {
      this.showLoading.set(false);
    }
  }

  async deleteCompany(): Promise<void> {
    try {
      this.showLoading.set(true);
      const companyData = await this.registerCompanyApi.deleteRegister(
        this.company().companyData.idCompany
      );
      this.handleModal('success', companyData.message);
      this.isModalInfoActive = true;
    } catch (e: any) {
      this.handleModal('failure', e.message);
      this.isModalInfoActive = true;
    } finally {
      this.showLoading.set(false);
    }
  }

  public isModalCompanyActive = false;

  showModalNewCompany(): void {
    this.isModalCompanyActive = true;
  }

  public isModalInfoActive = false;
  public isModalAskActive = false;
  public modalData = {
    type: '',
    description: '',
  };

  handleModal(type: string, description: string): void {
    this.modalData.type = type;
    this.modalData.description = description;
  }

  showModalAskToDeleteCompany(data: ICompanyPageGroup): void {
    if (this.isCompany(data)) {
      this.company().companyData = data;
      this.handleModal('confirmation', `Deseja excluir ${this.company().companyData.name}?`);
    } else if (this.isAdress(data)) {
      this.companyItem().adressData = data;
      this.handleModal('confirmation', `Deseja excluir ${this.companyItem().adressData.adress}?`);
    } else if (this.isProject(data)) {
      this.companyItem().projectData = data;
      this.handleModal('confirmation', `Deseja excluir ${this.companyItem().projectData.code}?`);
    } else if (this.isEmployee(data)) {
      this.companyItem().employeeData = data;
      this.handleModal('confirmation', `Deseja excluir ${this.companyItem().employeeData.name}?`);
    }

    this.isModalAskActive = true;
  }

  public isModalFormCompanyActive = false;
  public isEditForm = false;

  showModalFormToEditCompany(data: ICompanyPageGroup): void {
    if (this.isCompany(data)) {
      this.company().companyData = { ...data };
    } else if (this.isAdress(data)) {
      this.companyItem().adressData = { ...data };
    } else if (this.isProject(data)) {
      this.companyItem().projectData = { ...data };
    } else if (this.isEmployee(data)) {
      this.companyItem().employeeData = { ...data };
    }
    this.isEditForm = true;
    this.isModalFormCompanyActive = true;
  }

  public isModalCheckActive = false;

  closeModalCheckEvent() {}

  OnModalAskActionOk(): void {
    this.isModalAskActive = false;
  }
}
