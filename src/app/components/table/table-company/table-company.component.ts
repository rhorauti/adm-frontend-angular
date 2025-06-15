import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { ButtonComponent } from '@components/button/button.component';
import { InputAddonsComponent } from '@components/input/input-addons/input-addons.component';
import { TableHeaderBoxComponent } from '@components/table/table-header-box/table-header-box.component';
import { TableBaseComponent } from '@components/table/table-base/table-base.component';
import { HttpRequestService } from '@core/api/http-request.service';
import { ICompany } from '@core/interfaces/ICompany';
import { ModalBaseComponent } from '@components/modal/modal-base/modal-base.component';
import { InputStandardComponent } from '@components/input/input-standard/input-standard.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { IFilter, IModalForm, IPagination, ITableCheckbox } from '@core/interfaces/IBase';
import { environment } from '@environments/environment';
import { FormsModule } from '@angular/forms';
import { ITableHeader } from '@core/interfaces/ITableHeader';
import { PaginationComponent } from '../../pagination/pagination.component';

@Component({
    selector: 'app-table-company',
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
        PaginationComponent,
    ],
    providers: [provideNgxMask()],
    templateUrl: './table-company.component.html',
    styleUrl: './table-company.component.scss'
})
export class TableCompanyComponent implements OnInit {
  constructor(private httpRequestService: HttpRequestService) {}
  version = 'v1';

  filter = signal<IFilter>({
    selectValue: 'idCompany',
    input: '',
    placeholder: 'Digite um(a) Id',
  });
  isHeaderBoxActive = signal(false);
  tableHeaders = signal<ITableHeader[]>([
    { id: 0, showHeader: true, name: '', value: '' },
    { id: 1, showHeader: true, name: 'Id', value: 'idCompany' },
    { id: 2, showHeader: true, name: 'Apelido', value: 'nickname' },
    { id: 3, showHeader: true, name: 'Razão Social', value: 'name' },
    { id: 4, showHeader: true, name: 'CNPJ/CPF', value: 'cnpj' },
    { id: 5, showHeader: false, name: 'Inscr. Estadual', value: 'ie' },
    { id: 6, showHeader: false, name: 'Inscr. Municipal', value: 'im' },
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
    currentPage: 1,
    lastPage: 1,
    qtyPerPage: 10,
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

  @Input() companyType = 1;
  @Input() isModal = false;
  isEditBtnDisabled = signal(false);
  isDelBtnDisabled = signal(false);

  ngOnInit(): void {
    this.onShowDataList();
    this.onBodyCheckboxStatusCheck(this.tableCheckbox().body);
  }

  get checkboxHeaderValue(): boolean {
    return this.tableCheckbox().header;
  }

  set checkboxHeaderValue(isChecked: boolean) {
    this.tableCheckbox().header = isChecked;
    this.tableCheckbox.update(state => ({ ...state, body: state.body.map(() => isChecked) }));
    this.isDelBtnDisabled.set(!isChecked);
    const updatedTrueArray = this.tableCheckbox().body.filter(element => element == true);
    this.isEditBtnDisabled.set(updatedTrueArray.length == 0 || updatedTrueArray.length > 1);
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

  @Output() showDetailsEmitter = new EventEmitter<boolean>();

  showDetails(): void {
    this.showDetailsEmitter.emit(true);
  }

  @Output() sendIdEmitter = new EventEmitter<number>();

  sendId(): void {
    this.sendIdEmitter.emit(this.companyData().idCompany);
  }

  /**
   * changeSelectPlaceHolder
   * Get select value from app-input-addons component and change placeholder
   * @param value string. Value received from app-input-addons component
   */
  changeSelectPlaceHolder(value: string) {
    this.filter().placeholder = `Digite um(a) ${this.tableHeaders().find(header => header.value == value)?.name}`;
    this.filter().selectValue = value;
  }

  onFilterInputChange(inputValue: string): void {
    this.tableCheckbox.update(state => ({ ...state, header: false }));
    this.filterTable(inputValue);
  }

  filterTable(inputValue: string): void {
    this.filter.update(state => ({ ...state, input: inputValue }));
    const filterData = this.initialTableData().filter(company => {
      const filterResult = company[this.filter().selectValue as keyof ICompany];
      return String(filterResult).toLowerCase().trim().includes(inputValue.toLowerCase().trim());
    });
    this.companiesData.set(filterData);
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

  showNewForm(): void {
    this.clearData();
    this.modalForm.update(state => ({
      ...state,
      isActive: true,
    }));
  }

  clearData(): void {
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

  arrayDatasChecked = computed(() => {
    const itemsChecked = this.tableCheckbox()
      .body.map((value, index) => (value == true ? index : null))
      .filter(index => index != null);
    const datasChecked = this.companiesData().map((value, index) =>
      itemsChecked.includes(index) ? value : null
    );
    return datasChecked.filter(value => value != null);
  });

  clearCheckbox(): void {
    this.tableCheckbox.update(state => ({ header: false, body: state.body.map(() => false) }));
  }

  onShowModalEditForm(): void {
    const selectedData = this.arrayDatasChecked()[0];
    if (selectedData) this.companyData.set(structuredClone(selectedData));
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
      this.onShowDataList();
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
    const selectedData = this.arrayDatasChecked()[0];
    if (selectedData) {
      this.onHandleModalInfo(
        'confirmation',
        `Deseja excluir ${this.arrayDatasChecked().length == 1 ? selectedData.name : 'os registros selecionados?'}`
      );
      this.modalAsk().isActive = true;
    }
  }

  onModalAskActionOk(): void {
    this.delete();
    this.clearData();
    this.modalInfo.update(state => ({ ...state, isActionOk: true, isActive: true }));
  }

  showLoading = signal(false);

  fillCheckboxArray(dataLength: number): void {
    this.tableCheckbox().body = Array.from({ length: dataLength }, () => false);
  }

  changePage(page: number) {
    this.pagination.update(state => ({ ...state, currentPage: page }));
    this.tableCheckbox.update(state => ({ ...state, header: false }));
    this.onShowDataList();
  }

  /**
   * showTableDataList
   *
   * Request datas to backend to fill table information.
   * @param groupType number - type of the group (1 - Customer, 2 - Supplier, 3 - MyCompany)
   * @param baseGroupSignal WritableSignal - Data of the group informed.
   * @param baseGroupName string - Name of the group informed (ex. company, product, etc)
   */
  async onShowDataList(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company?page=${this.pagination().currentPage}&limit=${this.pagination().qtyPerPage}&input=${this.filter().input}&select=${this.filter().selectValue}&type=${this.companyType}`,
        'GET'
      );
      this.initialTableData.set(response.data.companies);
      this.companiesData.set(response.data.companies);
      this.pagination.update(state => ({ ...state, lastPage: response.data.totalPages }));
      this.fillCheckboxArray(this.companiesData().length);
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
    } finally {
      this.showLoading.set(false);
    }
  }

  finalData = {
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

  setFinalData(): void {
    this.finalData.idCompany = this.companyData().idCompany;
    this.finalData.type = this.companyType;
    this.finalData.nickname = this.companyData().nickname;
    this.finalData.name = this.companyData().name;
    this.finalData.cnpj = this.removeMask(this.companyData()?.cnpj || '');
    this.finalData.ie = this.removeMask(this.companyData().ie || '');
    this.finalData.im = this.removeMask(this.companyData().im || '');
  }

  async save(): Promise<void> {
    try {
      this.showLoading.set(true);
      this.setFinalData();
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company`,
        'POST',
        this.finalData
      );
      if (!this.modalForm().isEditForm) {
        this.pagination.update(state => ({ ...state, currentPage: 1 }));
      }
      this.onHandleModalInfo('success', response.msg);
      this.modalInfo.update(state => ({ ...state, isActionOk: true, isActive: true }));
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
      this.modalInfo.update(state => ({ ...state, isActive: true }));
    } finally {
      this.showLoading.set(false);
    }
  }

  async delete(): Promise<void> {
    try {
      this.showLoading.set(true);
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/company/delete`,
        'POST',
        this.arrayDatasChecked()
      );
      this.pagination.update(state => ({ ...state, currentPage: 1 }));
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
