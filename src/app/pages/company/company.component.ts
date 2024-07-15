import { Component, OnInit, signal } from '@angular/core';
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
import { ICompany } from '@core/interfaces/ICompany';
import { ICompanyTableHeader } from '@core/interfaces/ITableHeader';
import { ModalCheckComponent } from '@components/modal/modal-check/modal-check.component';
import { TabComponent } from '@components/tab/tab.component';
import { InputAddonsComponent } from '../../components/input/input-addons/input-addons.component';
import { TableComponent } from '../../components/table/table.component';
import { TableHeaderBoxComponent } from '@components/table-header-box/table-header-box.component';
import { ActivatedRoute } from '@angular/router';

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
export class CompanyComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private registerCompanyApi: RegisterCompanyApi
  ) {}

  public companyTypeString = '';
  public companyTypeNumber = 0;
  public showLoading = signal(false);
  public companyType: string | null = '';

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.companyType = params.get('company-type');
      this.showCompaniesList(Number(this.companyType));
    });
  }

  public isHeaderBoxActive = signal(false);

  /**
   * showTableHeader
   * Mostra ou esconde a coluna da tabela selecionada e atualiza o select do filtro.
   * @param header ICompanyTableHeaders
   */
  showTableHeader(header: ICompanyTableHeader): void {
    header.showHeader = !header.showHeader;
  }

  public companyTableHeaders = signal<ICompanyTableHeader[]>([
    { id: 0, showHeader: true, name: 'Id' },
    { id: 1, showHeader: true, name: 'Data' },
    { id: 2, showHeader: true, name: 'Apelido' },
    { id: 3, showHeader: true, name: 'Nome' },
    { id: 4, showHeader: true, name: 'CNPJ' },
    { id: 5, showHeader: true, name: 'Ações' },
  ]);

  public initialTableData = signal<ICompany[]>([]);
  public companiesData = signal<ICompany[]>([]);
  public companyData = signal<ICompany>({
    idCompany: 0,
    type: 0,
    date: new Date().toISOString(),
    nickname: '',
    name: '',
    cnpj: '',
  });
  public tableIdx = signal(0);
  public QtyPerPage = 12;
  public inputValueFilter = signal('');
  public selectValueFilter = signal('');

  filterTable(): void {
    if (!this.inputValueFilter) {
      this.companiesData.set(
        this.initialTableData().slice(this.tableIdx(), this.tableIdx() + this.QtyPerPage)
      );
    } else {
      this.companiesData.set(
        this.initialTableData().filter(company =>
          String(company[this.selectValueFilter().toLowerCase() as keyof ICompany])
            .toLowerCase()
            .includes(String(this.inputValueFilter()).toLowerCase().trim())
        )
      );
    }
  }

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
      this.companiesData.set(companies.data);
    } catch (e: any) {
      this.handleModal('failure', e.message);
    } finally {
      this.showLoading.set(false);
    }
  }

  async addNewCompany() {
    try {
      this.showLoading.set(true);
      const companyData = await this.registerCompanyApi.addNewCompany(this.companyData());
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
        this.companyData(),
        this.companyData().idCompany
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
      const companyData = await this.registerCompanyApi.deleteRegister(this.companyData().idCompany);
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

  showModalAskToDeleteCompany(company: ICompany): void {
    this.companyData.set(company);
    this.handleModal('confirmation', `Deseja excluir ${this.companyData.name}?`);
    this.isModalAskActive = true;
  }

  public isModalFormCompanyActive = false;
  public isEditForm = false;

  showModalFormToEditCompany(companyData: ICompany): void {
    this.companyData.set({ ...companyData });
    this.isEditForm = true;
    this.isModalFormCompanyActive = true;
  }

  public isModalCheckActive = false;

  closeModalCheckEvent() {}

  OnModalAskActionOk(): void {
    this.isModalAskActive = false;
  }
}
