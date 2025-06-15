import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@components/button/button.component';
import { InputAddonsComponent } from '@components/input/input-addons/input-addons.component';
import { TableHeaderBoxComponent } from '@components/table/table-header-box/table-header-box.component';
import { TableBaseComponent } from '@components/table/table-base/table-base.component';
import { HttpRequestService } from '@core/api/http-request.service';
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
import { IEmployee } from '@core/interfaces/IEmployee';

@Component({
    selector: 'app-table-employee',
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
    templateUrl: './table-employee.component.html',
    styleUrl: './table-employee.component.scss'
})
export class TableEmployeeComponent implements OnInit {
  constructor(private httpRequestService: HttpRequestService) {}
  version = 'v1';

  filter = signal<IFilter>({
    selectValue: 'idEmployee',
    input: '',
    placeholder: 'Digite um(a) Id',
  });
  isHeaderBoxActive = signal(false);
  tableHeaders = signal<ITableHeader[]>([
    { id: 0, showHeader: true, name: '', value: '' },
    { id: 1, showHeader: true, name: 'Id', value: 'idEmployee' },
    { id: 2, showHeader: true, name: 'Nome', value: 'name' },
    { id: 3, showHeader: true, name: 'cpf', value: 'cpf' },
    { id: 4, showHeader: true, name: 'Departamento', value: 'department' },
    { id: 5, showHeader: true, name: 'Cargo', value: 'position' },
    { id: 6, showHeader: true, name: 'E-mail', value: 'email' },
    { id: 7, showHeader: true, name: 'Tel. fixo', value: 'deskphone' },
    { id: 8, showHeader: true, name: 'Celular', value: 'cellphone' },
  ]);
  initialTableData = signal<IEmployee[]>([]);
  employeesData = signal<IEmployee[]>([]);
  employeeData = signal<IEmployee>({
    idEmployee: 0,
    name: '',
    cpf: '',
    department: '',
    position: '',
    email: '',
    deskphone: '',
    cellphone: '',
    idCompany: 0,
  });
  tableCheckbox = signal<ITableCheckbox>({
    header: false,
    body: [],
  });
  pagination = signal<IPagination>({
    currentPage: 1,
    lastPage: 1,
    qtyPerPage: 3,
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
  @Input() idCompany = 0;
  @Input() isSelectItemModal = false;
  isEditBtnDisabled = signal(false);
  isDelBtnDisabled = signal(false);

  ngOnInit(): void {
    this.onShowDataList();
    this.onBodyCheckboxStatusCheck(this.tableCheckbox().body);
  }

  getEmployeeId(value: string): void {
    this.employeeData().idEmployee = Number(value);
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

  /**
   * changeSelectPlaceHolder
   * Get select value from app-input-addons component and change placeholder
   * @param value string. Value received from app-input-addons component
   */
  changeSelectPlaceHolder(value: string) {
    this.filter().placeholder = `Digite um(a) ${this.tableHeaders().find(header => header.value == value)?.name}`;
    this.filter().selectValue = value;
  }

  filterTable(): void {
    this.onShowDataList();
    this.tableCheckbox.update(state => ({ ...state, header: false }));
  }

  setMask(type: string, idx: number): string {
    if (type == 'cpf') {
      if ((this.employeesData()[idx || 0]?.cpf || '')?.length > 11) {
        return '00.000.000/0000-00';
      } else {
        return '000.000.000-00';
      }
    } else {
      if ((this.employeesData()[idx || 0]?.deskphone || '')?.length <= 10) {
        return '(00) 0000-0000';
      } else {
        return '(00) 00000-0000';
      }
    }
  }

  showNewForm(): void {
    this.modalForm.update(state => ({
      ...state,
      isActive: true,
    }));
  }

  clearData(): void {
    this.employeeData.update(state => ({
      ...state,
      idEmployee: 0,
      name: '',
      cpf: '',
      department: '',
      position: '',
      email: '',
      deskphone: '',
      cellphone: '',
      idCompany: 0,
    }));
  }

  onCloseModalForm(): void {
    this.clearData();
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
    const datasChecked = this.employeesData().map((value, index) =>
      itemsChecked.includes(index) ? value : null
    );
    return datasChecked.filter(value => value != null);
  });

  clearCheckbox(): void {
    this.tableCheckbox.update(state => ({ header: false, body: state.body.map(() => false) }));
  }

  onShowModalEditForm(): void {
    const selectedData = this.arrayDatasChecked()[0];
    if (selectedData) this.employeeData.set(structuredClone(selectedData));
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
        `${environment.apiUrl}/${this.version}/employee?page=${this.pagination().currentPage}&limit=${this.pagination().qtyPerPage}&input=${this.filter().input}&select=${this.filter().selectValue}&idCompany=${this.idCompany}`,
        'GET'
      );
      this.initialTableData.set(response.data.employees);
      this.employeesData.set(response.data.employees);
      this.pagination.update(state => ({ ...state, lastPage: response.data.totalPages }));
      this.fillCheckboxArray(this.employeesData().length);
    } catch (e: any) {
      this.onHandleModalInfo('failure', e?.error?.msg);
    } finally {
      this.showLoading.set(false);
    }
  }

  finalData = {
    idEmployee: 0,
    name: '',
    cpf: '',
    department: '',
    position: '',
    email: '',
    deskphone: '',
    cellphone: '',
    idCompany: 0,
  } as IEmployee;

  removeMask(data: string): string {
    return (data ?? '').replace(/[\D]/g, '');
  }

  setFinalData(): void {
    this.finalData.idEmployee = this.employeeData().idEmployee;
    this.finalData.name = this.employeeData().name;
    this.finalData.cpf = this.removeMask(this.employeeData().cpf || '');
    this.finalData.department = this.employeeData().department || '';
    this.finalData.position = this.employeeData().position || '';
    this.finalData.email = this.employeeData().email || '';
    this.finalData.deskphone = this.removeMask(this.employeeData().deskphone || '');
    this.finalData.cellphone = this.removeMask(this.employeeData().cellphone || '');
    this.finalData.idCompany = this.idCompany;
  }

  async save(): Promise<void> {
    try {
      this.showLoading.set(true);
      this.setFinalData();
      const response = await this.httpRequestService.sendHttpRequest(
        `${environment.apiUrl}/${this.version}/employee`,
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
        `${environment.apiUrl}/${this.version}/employee/delete`,
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
