import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ButtonStandardComponent } from '@components/button/button-standard/button-standard.component';
import { InputFormComponent } from '@components/input/input-form/input-form.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalFormCompanyComponent } from '@components/modal/modal-form-company/modal-form-company.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { HttpRequestService } from '@core/api/http-request.service';
import { RegisterCompanyApi } from '@core/api/http/register.api';
import { IModal } from '@core/api/interfaces/IModal';
import {
  ICompany,
  IProduct,
  IResponseCompany,
  IResponseProduct,
} from '@core/api/interfaces/IRegister';

export interface ICompanyTableHeaders {
  id: number;
  isChecked: boolean;
  name: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    InputFormComponent,
    ButtonStandardComponent,
    InputFormComponent,
    LoadingComponent,
    ModalInfoComponent,
    ModalAskComponent,
    ModalFormCompanyComponent,
  ],
  providers: [RegisterCompanyApi, HttpRequestService],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnChanges, OnInit {
  private registerApi = inject(RegisterCompanyApi);
  public isModalInfoActive = false;
  public isModalAskActive = false;
  @Input() showLoading = false;
  @Output() tableDataEmitter = new EventEmitter<ICompany[] | IProduct[]>();
  @Input() companyTableHeaders: ICompanyTableHeaders[] = [];
  public productTableHeaders = [
    'Id',
    'Cadastro',
    'Nome',
    'cc',
    'ncm',
    'Unidade',
    'Preço',
    'Comentários',
    'Ação',
  ];

  public modalAsk: IModal = {
    modalType: '',
    modalDescription: '',
  };

  @Input() registerType: string | null = '';
  public companiesData: IResponseCompany = {
    date: '',
    status: false,
    message: '',
    data: [],
  };
  public productsData: IResponseProduct = {
    date: '',
    status: false,
    message: '',
    data: [],
  };
  public companyData: ICompany = {
    id: 0,
    cadastro: new Date(),
    nome: '',
    email: '',
    telefone: '',
    isCnpj: true,
    cnpj: '',
    logradouro: '',
    numero: 0,
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  };
  public productData: IProduct = {
    id: 0,
    cadastro: '',
    nome: '',
    cc: '',
    ncm: '',
    unidade: '',
    preco: '',
    fileName: '',
    comentario: '',
  };

  @Output() tableHeadersDataEmitter = new EventEmitter();

  public initialTableData: ICompany[] = [];

  async ngOnInit(): Promise<void> {
    await this.getList();
    switch (this.registerType) {
      case 'customers':
      case 'suppliers': {
        this.initialTableData = this.companiesData.data;
        this.filterTable();
      }
    }
  }

  public tableInitialIdx = 0;
  public tableLastIdx = 15;
  public qtyRegisterPerPage = 15;

  findInitialIdx(): number {
    if (this.currentPage == 1) {
      return (this.tableInitialIdx = 0);
    } else {
      return (this.tableInitialIdx = (this.currentPage - 1) * this.qtyRegisterPerPage);
    }
  }

  findLastIdx(): void {
    this.tableLastIdx = this.currentPage * this.qtyRegisterPerPage;
  }

  public lastPage = 0;
  @Output() lastPageEmitter = new EventEmitter<number>();

  findLastPage(tableData: Record<string, any>[]): void {
    this.lastPage = Math.ceil(tableData.length / this.qtyRegisterPerPage);
    this.lastPageEmitter.emit(this.lastPage);
  }

  @Input() currentPage = 0;
  @Input() inputValueFilter: string | number = 0;
  @Input() selectValueFilter = '';

  public companiesDataFilter: ICompany[] = [];

  filterTable(): void {
    if (!this.inputValueFilter) {
      this.findLastPage(this.initialTableData);
      this.companiesDataFilter = this.initialTableData.slice(
        this.tableInitialIdx,
        this.tableLastIdx
      );
    } else {
      const filterData = this.companiesData.data.filter(company =>
        String(company[this.selectValueFilter.toLowerCase() as keyof ICompany])
          .toLowerCase()
          .includes(String(this.inputValueFilter).toLowerCase().trim())
      );
      this.findLastPage(filterData);
      this.companiesDataFilter = filterData.slice(this.tableInitialIdx, this.tableLastIdx);
    }
  }

  @Output() tableUpdatedEmitter = new EventEmitter<boolean>();

  async resetTable(): Promise<void> {
    await this.getList();
    this.filterTable();
  }

  @Input() tableUpdated = false;

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const currentValuePage = changes['currentPage']?.currentValue ?? 0;
    const previousValuePage = changes['currentPage']?.previousValue ?? 0;
    const currentValueInput = changes['inputValueFilter']?.currentValue ?? 0;
    const previousValueInput = changes['inputValueFilter']?.previousValue ?? 0;
    const previousValueRegisterType = changes['registerType']?.previousValue;
    const currentValueRegisterType = changes['registerType']?.currentValue;
    if (this.tableUpdated) {
      await this.getList();
      this.tableInitialIdx = 0;
      this.filterTable();
      this.tableUpdatedEmitter.emit(false);
    } else {
      if (currentValueInput != previousValueInput || currentValuePage != previousValuePage) {
        if (currentValueInput != previousValueInput) {
          this.currentPage = 1;
        }
        this.findInitialIdx();
        this.findLastIdx();
        this.filterTable();
      }
      if (currentValueRegisterType != previousValueRegisterType) {
        await this.getList();
        this.initialTableData = this.companiesData.data;
        this.filterTable();
      }
    }
  }

  resetPage(): void {
    this.isEditForm = false;
    this.resetTable();
  }

  async OnModalAskActionOk(): Promise<void> {
    switch (this.registerType) {
      case 'customers':
      case 'suppliers': {
        await this.delete(this.companyData.id);
        this.isModalAskActive = false;
        this.resetTable();
        break;
      }
    }
  }

  showModalAskToDeleteCompany(company: ICompany): void {
    switch (this.registerType) {
      case 'customers':
      case 'suppliers': {
        this.companyData = company;
        this.modalAsk.modalType = 'confirmation';
        this.modalAsk.modalDescription = `Deseja excluir ${this.companyData.nome}?`;
        this.isModalAskActive = true;
        break;
      }
    }
  }

  showModalAskToDeleteProduct(product: IProduct): void {
    switch (this.registerType) {
      case 'supplier-products':
      case 'customer-products': {
        this.productData = product;
        this.modalAsk.modalType = 'confirmation';
        this.modalAsk.modalDescription = `Deseja excluir ${this.productData.nome}?`;
        this.isModalAskActive = true;
        break;
      }
    }
  }

  public isModalFormCompanyActive = false;
  public isEditForm = false;

  showModalFormToEditCompany(companyData: ICompany): void {
    this.companyData = { ...companyData };
    this.isEditForm = true;
    this.isModalFormCompanyActive = true;
  }

  public isModalFormProductActive = false;

  showModalFormToEditProduct(productData: IProduct): void {
    this.productData = productData;
    this.isModalFormProductActive = true;
  }

  public modalInfo: IModal = {
    modalType: '',
    modalDescription: '',
  };

  /**
   * handleSuccessModal
   * Função que popula os dados do modal no caso de email ou senha validados corretamente.
   */
  handleSuccessModal(message: string): void {
    this.modalInfo = {
      modalType: 'success',
      modalDescription: message,
    };
  }

  /**
   * handleFailureModal
   * Função que popula os dados do modal no caso de email ou senha digitados incorretamente.
   */
  handleFailureModal(message: string): void {
    this.modalInfo = {
      modalType: 'failure',
      modalDescription: message,
    };
  }

  /**
   * getCustomers
   * Solicita um lista de clientes registrados no banco de dados.
   * @returns Promise de sucesso com status, mensagem e array de dados cadastrais do cliente. No caso de erro, retorna somente o status e mensagem.
   */
  async getList(): Promise<void> {
    try {
      this.showLoading = true;
      switch (this.registerType) {
        case 'customers': {
          const customersData = await this.registerApi.getRegisterCompanyList('customers');
          this.companiesData.data = customersData.data;
          this.initialTableData = this.companiesData.data;
          this.companiesDataFilter = this.companiesData.data;
          break;
        }
        case 'suppliers': {
          const suppliersData = await this.registerApi.getRegisterCompanyList('suppliers');
          this.companiesData.data = suppliersData.data;
          this.initialTableData = this.companiesData.data;
          this.companiesDataFilter = this.companiesData.data;
          break;
        }
        case 'supplier-products': {
          const supplierProdutcsData =
            await this.registerApi.getRegisterProductsList('supplier-products');
          this.productsData.data = supplierProdutcsData.data;
          break;
        }
        case 'customer-products': {
          const customerProdutcsData =
            await this.registerApi.getRegisterProductsList('customer-products');
          this.productsData.data = customerProdutcsData.data;
          break;
        }
      }
    } catch (e: any) {
      this.handleFailureModal(e.error.message);
    } finally {
      this.showLoading = false;
    }
  }

  async addNew() {
    try {
      this.showLoading = true;
      switch (this.registerType) {
        case 'customers': {
          const customersData = await this.registerApi.addNewCompany(this.companyData, 'customers');
          this.handleSuccessModal(customersData.message);
          break;
        }
        case 'suppliers': {
          const supplierData = await this.registerApi.addNewCompany(this.companyData, 'suppliers');
          this.handleSuccessModal(supplierData.message);
          break;
        }
        case 'supplier-products': {
          const supplierProdutcData = await this.registerApi.addNewCompany(
            this.companyData,
            'supplier-products'
          );
          this.handleSuccessModal(supplierProdutcData.message);
          break;
        }
        case 'customer-products': {
          const customerProdutcData = await this.registerApi.addNewCompany(
            this.companyData,
            'customer-products'
          );
          this.handleSuccessModal(customerProdutcData.message);
          break;
        }
      }
    } catch (e: any) {
      this.handleFailureModal(e.error.message);
    } finally {
      this.showLoading = false;
    }
  }

  async update() {
    try {
      this.showLoading = true;
      switch (this.registerType) {
        case 'customers': {
          const customerData = await this.registerApi.updateCompany(
            this.companyData,
            'customers',
            this.companyData.id
          );
          this.handleSuccessModal(customerData.message);
          break;
        }
        case 'suppliers': {
          const supplierData = await this.registerApi.updateCompany(
            this.companyData,
            'suppliers',
            this.companyData.id
          );
          this.handleSuccessModal(supplierData.message);
          break;
        }
        case 'supplier-products': {
          const supplierProdutcData = await this.registerApi.updateProduct(
            this.productData,
            'supplier-products',
            this.productData.id
          );
          this.handleSuccessModal(supplierProdutcData.message);
          break;
        }
        case 'customer-products': {
          const customerProdutcData = await this.registerApi.updateProduct(
            this.productData,
            'customer-products',
            this.productData.id
          );
          this.handleSuccessModal(customerProdutcData.message);
          break;
        }
      }
    } catch (e: any) {
      this.handleFailureModal(e.error.message);
    } finally {
      this.showLoading = false;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      this.showLoading = true;
      switch (this.registerType) {
        case 'customers': {
          const customerData = await this.registerApi.deleteRegister('customers', id.toString());
          this.handleSuccessModal(customerData.message);
          this.isModalInfoActive = true;
          break;
        }
        case 'suppliers': {
          const supplierData = await this.registerApi.deleteRegister('suppliers', id.toString());
          this.handleSuccessModal(supplierData.message);
          this.isModalInfoActive = true;
          break;
        }
        case 'supplier-products': {
          const supplierProdutcData = await this.registerApi.deleteRegister(
            'supplier-products',
            id.toString()
          );
          this.handleSuccessModal(supplierProdutcData.message);
          this.isModalInfoActive = true;
          break;
        }
        case 'customer-products': {
          const customerProdutcsData = await this.registerApi.deleteRegister(
            'customer-products',
            id.toString()
          );
          this.handleFailureModal(customerProdutcsData.message);
          this.isModalInfoActive = true;
          break;
        }
      }
    } catch (e: any) {
      this.handleFailureModal(e.error.message);
      this.isModalInfoActive = true;
    } finally {
      this.showLoading = false;
    }
  }
}
