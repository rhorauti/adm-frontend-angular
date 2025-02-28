import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, computed, Inject, Input, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@components/button/button.component';
import { InputAddonsComponent } from '@components/input/input-addons/input-addons.component';
import { TableHeaderBoxComponent } from '@components/table/table-header-box/table-header-box.component';
import { TableBaseComponent } from '@components/table/table-base/table-base.component';
import { HttpRequestService } from '@core/api/http-request.service';
import { ICompany, IModalForm, ITableCheckbox } from '@core/interfaces/ICompany';
import { ModalBaseComponent } from '@components/modal/modal-base/modal-base.component';
import { InputStandardComponent } from '@components/input/input-standard/input-standard.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { IFilter, IPagination } from '@core/interfaces/IBase';
import { environment } from '@environments/environment';
import { FormsModule } from '@angular/forms';
import { ITableHeader } from '@core/interfaces/ITableHeader';

@Component({
  selector: 'app-table-company',
  standalone: true,
  imports: [
    CommonModule,
    InputAddonsComponent,
    FormsModule,
    TableBaseComponent,
    ButtonComponent,
    TableHeaderBoxComponent,
    ModalBaseComponent,
    InputStandardComponent,
    ModalAskComponent,
    ModalInfoComponent,
    LoadingComponent,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask()],
  templateUrl: './table-company.component.html',
  styleUrl: './table-company.component.scss',
})
export class TableCompanyComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private httpRequestService: HttpRequestService
  ) {}
  version = 'v1';

  tabList = ['Clientes', 'Fornecedores', 'MyCompany'];
  tabIdx = signal(0);
  filter = signal<IFilter>({
    selectValues: [],
    selectValue: 'Id',
    input: '',
    placeholder: '',
  });
  isHeaderBoxActive = signal(false);
  tableHeaders = signal<ITableHeader[]>([
    { id: 0, showHeader: true, name: '' },
    { id: 1, showHeader: true, name: 'Id' },
    { id: 2, showHeader: true, name: 'Apelido' },
    { id: 3, showHeader: true, name: 'Razão Social' },
    { id: 4, showHeader: true, name: 'CNPJ/CPF' },
    { id: 5, showHeader: false, name: 'Inscr. Estadual' },
    { id: 6, showHeader: false, name: 'Inscr. Municipal' },
  ]);
  initialTableData = signal<ICompany[]>([]);
  companiesData = signal<ICompany[]>([]);
  companyData = signal<ICompany>({
    idCompany: 0,
    type: 0,
    nickname: '',
    name: '',
    cnpj: '',
    ie: '',
    im: '',
  });
  tableCheckbox = signal<ITableCheckbox>({
    header: false,
    body: [],
  });
  pagination = signal<IPagination>({
    firstIdx: 0,
    qtyPerPage: 12,
  });
  modalForm = signal<IModalForm>({
    isActive: false,
    isInputClear: false,
    isEditForm: false,
  });
  modalAsk = signal({
    isActive: false,
  });

  modalInfo = signal({
    isActive: false,
    type: '',
    description: '',
    isActionOk: false,
  });

  @Input() isModalCompany = false;
  isEditBtnDisabled = signal(false);
  isDelBtnDisabled = signal(false);

  ngOnInit(): void {
    this.onShowCompanyList();
    this.showOptionList();
    this.showInputPlaceholder();
    this.onBodyCheckboxStatusCheck(this.tableCheckbox().body);
  }

  get checkboxHeaderValue(): boolean {
    return this.tableCheckbox().header;
  }

  set checkboxHeaderValue(isChecked: boolean) {
    this.tableCheckbox().header = isChecked;
    this.tableCheckbox.update(state => ({ ...state, body: state.body.map(() => isChecked) }));
  }

  onBodyCheckboxStatusCheck(array: boolean[]) {
    const updatedTrueArray = array.filter(element => element == true);
    this.isEditBtnDisabled.set(updatedTrueArray.length == 0 || updatedTrueArray.length > 1);
    this.isDelBtnDisabled.set(updatedTrueArray.length == 0);
    this.tableCheckbox.update(state => ({ ...state, header: updatedTrueArray.length > 0 }));
  }

  onChangeBodyCheckboxValue(index: number, event: Event) {
    const newValue = (event.target as HTMLInputElement).checked;
    const updatedArray = this.tableCheckbox().body.map((element, idx) =>
      idx == index ? (element = newValue) : element
    );
    this.onBodyCheckboxStatusCheck(updatedArray);
  }

  /**
   * showOptionList
   *
   * Define option list according to table header selected.
   * @param group
   */
  showOptionList(): void {
    this.filter().selectValues = [];
    this.tableHeaders().forEach(header => {
      if (header.showHeader) {
        this.filter().selectValues.push(header.name);
        this.showInputPlaceholder();
      }
    });
  }

  /**
   * showInputPlaceholder
   *
   * Change filter´s input placeholder when change select value.
   * @param group
   */
  showInputPlaceholder(): void {
    this.filter().placeholder = `Digite um(a) ${this.filter().selectValue}`;
  }

  /**
   * changeSelectPlaceHolder
   * Get select value from app-input-addons component and change placeholder
   * @param value string. Value received from app-input-addons component
   */
  changeSelectPlaceHolder(value: string) {
    this.filter().placeholder = `Digite um(a) ${value}`;
    this.filter().selectValue = value;
  }

  filterTable(): void {
    this.companiesData.set(
      this.initialTableData().filter(company => {
        if (this.filter().input == '') {
          return company.type == this.tabIdx();
        } else {
          const key = this.setCompanyKeyValueFilter() as keyof ICompany;
          return (
            company?.[key]
              ?.toString()
              .toLowerCase()
              .trim()
              .includes(this.filter().input.toLowerCase().trim()) && company.type == this.tabIdx()
          );
        }
      })
    );
  }

  setCompanyKeyValueFilter(): string {
    const selectValue = this.filter().selectValue;
    switch (selectValue) {
      case 'Id': {
        return 'idCompany';
      }
      case 'Data': {
        return 'date';
      }
      case 'Apelido': {
        return 'nickname';
      }
      case 'Razão Social': {
        return 'name';
      }
      case 'CNPJ/CPF': {
        return 'cnpj';
      }
      case 'Inscr. Estadual': {
        return 'ie';
      }
      case 'Inscr. Municipal': {
        return 'im';
      }
      default:
        return '';
    }
  }

  setMask(type: string, idx?: number): string {
    if (type == 'cnpj') {
      if ((this.companiesData()[idx || 0]?.cnpj || '')?.length > 11) {
        return '00.000.000/0000-00';
      } else {
        return '000.000.000-00';
      }
    } else {
      return '';
    }
  }

  showNewCompanyForm(): void {
    this.clearCompanyInfo();
    this.modalForm.update(state => ({
      ...state,
      isActive: true,
    }));
  }

  clearCompanyInfo(): void {
    this.companyData.update(state => ({
      ...state,
      idCompany: 0,
      nickname: '',
      name: '',
      cnpj: '',
      ie: '',
      im: '',
    }));
  }

  onCloseModalForm(): void {
    if (this.modalForm().isActive) {
      if (this.modalForm().isEditForm) {
        this.modalForm.update(state => ({
          ...state,
          isEditForm: false,
          isInputClear: true,
        }));
      }
      this.modalForm.update(state => ({ ...state, isActive: false }));
    }
  }

  arrayCompaniesChecked = computed(() => {
    const itemsChecked = this.tableCheckbox()
      .body.map((value, index) => (value == true ? index : null))
      .filter(index => index != null);
    const companiesChecked = this.companiesData().map((value, index) =>
      itemsChecked.includes(index) ? value : null
    );
    return companiesChecked.filter(value => value != null);
  });

  clearCheckbox(): void {
    this.tableCheckbox.update(state => ({ header: false, body: state.body.map(() => false) }));
  }

  onShowModalEditForm(): void {
    const selectedCompany = this.arrayCompaniesChecked()[0];
    if (selectedCompany) this.companyData.set(structuredClone(selectedCompany));
    this.modalForm.update(state => ({
      ...state,
      isActive: true,
      isEditForm: true,
    }));
  }

  onHandleModalInfo(type: string, description: string): void {
    this.modalInfo.update(state => ({
      ...state,
      type: type,
      description: description,
    }));
  }

  onCloseModalAsk(): void {
    if (this.modalAsk().isActive) {
      this.modalAsk.update(state => ({
        ...state,
        isActive: false,
      }));
    }
  }

  onCloseModalInfo(): void {
    if (this.modalInfo().isActionOk) {
      this.onShowCompanyList();
      this.onCloseModalForm();
      this.onCloseModalAsk();
      this.modalInfo.update(state => ({
        ...state,
        isActionOk: false,
        isActive: false,
      }));
      this.clearCheckbox();
      this.isEditBtnDisabled.set(true);
    } else {
      this.modalInfo.update(state => ({
        ...state,
        isActive: false,
      }));
    }
  }

  onShowModalAskToDelete(): void {
    const selectedCompany = this.arrayCompaniesChecked()[0];
    if (selectedCompany) {
      this.onHandleModalInfo(
        'confirmation',
        `Deseja excluir ${this.arrayCompaniesChecked().length == 1 ? selectedCompany.name : 'os registros selecionados?'}`
      );
      this.modalAsk().isActive = true;
    }
  }

  onModalAskActionOk(): void {
    this.deleteCompany();
    this.clearCompanyInfo();
    this.modalInfo.update(state => ({ ...state, isActionOk: true, isActive: true }));
  }

  showLoading = signal(false);

  fillCheckboxArray(dataLength: number): void {
    this.tableCheckbox().body = Array.from({ length: dataLength }, () => false);
  }

  /**
   * showTableDataList
   *
   * Request datas to backend to fill table information.
   * @param groupType number - type of the group (1 - Customer, 2 - Supplier, 3 - MyCompany)
   * @param baseGroupSignal WritableSignal - Data of the group informed.
   * @param baseGroupName string - Name of the group informed (ex. company, product, etc)
   */
  async onShowCompanyList(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company`,
        'GET'
      );
      this.initialTableData.set(response.data);
      this.companiesData.set(response.data);
      this.fillCheckboxArray(this.companiesData().length);
      this.filterCompanyType();
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
    } finally {
      this.showLoading.set(false);
    }
  }

  filterCompanyType(): void {
    this.companiesData.set(
      this.initialTableData().filter(company => {
        return company.type == this.tabIdx();
      })
    );
  }

  finalCompanyData = {
    idCompany: 0,
    date: '',
    type: 0,
    nickname: '',
    name: '',
    cnpj: '',
    ie: '',
    im: '',
  } as ICompany;

  removeMask(data: string): string {
    return (data ?? '').replace(/[\D]/g, '');
  }

  setCompanyData(): void {
    this.finalCompanyData.idCompany = this.companyData().idCompany;
    this.finalCompanyData.type = this.companyData().type;
    this.finalCompanyData.nickname = this.companyData().nickname;
    this.finalCompanyData.name = this.companyData().name;
    this.finalCompanyData.cnpj = this.removeMask(this.companyData()?.cnpj || '');
    this.finalCompanyData.ie = this.removeMask(this.companyData().ie || '');
    this.finalCompanyData.im = this.removeMask(this.companyData().im || '');
  }

  async saveCompany(): Promise<void> {
    try {
      this.showLoading.set(true);
      this.setCompanyData();
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company`,
        'POST',
        this.finalCompanyData
      );
      this.onHandleModalInfo('success', response.msg);
      this.modalInfo.update(state => ({ ...state, isActionOk: true, isActive: true }));
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
      this.modalInfo.update(state => ({ ...state, isActive: true }));
    } finally {
      this.showLoading.set(false);
    }
  }

  async deleteCompany(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company/delete`,
        'POST',
        this.arrayCompaniesChecked()
      );
      this.modalAsk.update(state => ({ ...state, isActive: false }));
      this.onHandleModalInfo('success', response.msg);
      this.modalInfo.update(state => ({ ...state, isActive: true }));
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
      this.modalInfo.update(state => ({ ...state, isActive: true }));
    } finally {
      this.showLoading.set(false);
    }
  }
}
