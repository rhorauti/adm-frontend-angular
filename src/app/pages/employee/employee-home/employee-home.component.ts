import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '@components/home/home.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { EmployeeApi } from '@core/http/employee/employee.api';
import { IEmployeeHome } from '@core/interfaces/employee.interface';
import { ActionCallback, IModalAsk, IModalInfo } from '@core/interfaces/modal.interface';
import { ITableHeader } from '@core/interfaces/table.interface';
import { KeyOfData } from '@core/types/base.type';
import { loadStorage } from '@core/utils/misc';
import { AuthStore } from '@store/auth/auth.store';
import { defaultTableHeaderIcon } from '@store/base/base.register.store';
import { ModalType } from '@store/modal/modal.store';
import { DEPT_NAMES_ENGLISH } from 'app/enum/department.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-home',
  imports: [HomeComponent, ModalAskComponent, ModalInfoComponent, LoadingComponent],
  templateUrl: './employee-home.component.html',
  styleUrl: './employee-home.component.scss',
})
export class EmployeeHomeComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private authStore = inject(AuthStore);
  readonly router = inject(Router);
  readonly currentViewTranslated = 'Funcionários';
  currentView = 'employees';
  breadcrumbList = ['Cadastro', 'Funcionários'];
  inputSearchFilterList: KeyOfData[] = [
    'idEmployee',
    'department',
    'name',
    'email',
    'employeePosition',
  ];
  inputSearchPlaceholder = 'Id, Nome, Email';
  // deptName = DEPT_NAMES_ENGLISH.MAINTENANCE as DEPT_NAMES_ENGLISH;
  subscription: Subscription | undefined = undefined;
  tableHeadersLocalStorageId = `table_headers_${this.currentView}_${this.authStore.user().id}`;
  idCompany = 0;

  readonly employeeApi = inject(EmployeeApi);
  isComponentSetToDefault = signal(false);
  initialDataList = signal<IEmployeeHome[]>([]);
  data = signal<IEmployeeHome>({
    idEmployee: 0,
    isDefault: false,
    name: '',
    cpf: '',
    email: '',
    deskphone: '',
    cellphone: '',
    photoUrl: '',
    company: '',
    department: '',
    employeePosition: '',
  });

  newRegisterUrl = `/${this.idCompany}/${this.currentView}/new`;

  tableHeaders = [
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idEmployee',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Departmento',
      databaseField: 'department',
    },
    {
      id: 2,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Nome',
      databaseField: 'name',
    },
    {
      id: 3,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Cargo',
      databaseField: 'employeePosition',
    },
    {
      id: 4,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'E-mail',
      databaseField: 'email',
    },
    {
      id: 5,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Telefone fixo',
      databaseField: 'deskphone',
    },
    {
      id: 6,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Celular',
      databaseField: 'cellphone',
    },
  ] as ITableHeader<IEmployeeHome>[];

  modalInfo = signal<IModalInfo>({
    isActive: false,
    title: '',
    description: '',
    type: '',
    onActionOk: null,
  });

  modalAsk = signal<IModalAsk>({
    isActive: false,
    title: '',
    description: '',
    onActionOk: null as ActionCallback,
    onActionNok: null as ActionCallback,
  });

  isLoading = signal(false);

  onShowInfoModal = (
    type: ModalType,
    title: string,
    description: string,
    onActionOk?: ActionCallback
  ): void => {
    this.modalInfo.set({
      ...this.modalInfo,
      isActive: true,
      type: type,
      title: title,
      description: description,
      onActionOk: onActionOk,
    });
  };

  async ngOnInit() {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.idCompany = Number(params.get('idCompany') as DEPT_NAMES_ENGLISH) || -1;
    });
    await this.onShowDataList();
    const selectedTableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
    const headers = selectedTableHeaders ? selectedTableHeaders : this.tableHeaders;
    this.tableHeaders = headers;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onRedirectToEditPage = (data: IEmployeeHome): void => {
    this.router.navigate([`/${this.idCompany}/${this.currentView}/edit/${data.idEmployee}`]);
  };

  onCloneRegister = (data: IEmployeeHome): void => {
    this.router.navigate([`/${this.idCompany}/${this.currentView}/new/${data.idEmployee}`]);
  };

  onCloseInfoModal = async (): Promise<void> => {
    const callback = this.modalInfo().onActionOk;
    if (callback) await Promise.resolve(callback());
    this.modalInfo.set({
      isActive: false,
      type: '',
      title: '',
      description: '',
      onActionOk: null,
    });
  };

  onShowAskModal = (
    title: string,
    description: string,
    onActionOk?: ActionCallback,
    onActionNok?: ActionCallback
  ): void => {
    this.modalAsk.set({
      ...this.modalAsk,
      isActive: true,
      title: title,
      description: description,
      onActionOk: onActionOk,
      onActionNok: onActionNok,
    });
  };

  onCloseAskModalAction = async (isConfirmed: boolean): Promise<void> => {
    const callback = isConfirmed ? this.modalAsk().onActionOk : this.modalAsk().onActionNok;
    if (callback) {
      await Promise.resolve(callback());
      this.modalInfo.update(current => ({ ...current, type: 'success' }));
    }
    this.modalAsk.set({
      isActive: false,
      title: '',
      description: '',
      onActionOk: null,
      onActionNok: null,
    });
  };

  onShowDataList = async (): Promise<void> => {
    try {
      this.isLoading.set(true);
      const response = await this.employeeApi.onGetDataList(this.idCompany);
      if (response.data) {
        const dataList = response.data as IEmployeeHome[];
        this.initialDataList.set([...dataList]);
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.onShowInfoModal('failure', 'Listar registros', error.error?.message);
    } finally {
      this.isLoading.set(false);
    }
  };

  onDeleteRegister = async (idEmployee: number, onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.isLoading.set(true);
      const response = await this.employeeApi.onDelete(this.idCompany, idEmployee);
      if (response.status) {
        this.onShowDataList();
        this.onShowInfoModal('success', 'Excluir registro', response.message, onActionOk);
      } else {
        this.onShowInfoModal('failure', 'Excluir registro', response.error?.message || '');
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.onShowInfoModal(
        'failure',
        'Excluir registro',
        error.error?.message || 'Erro desconhecido'
      );
    } finally {
      this.isComponentSetToDefault.set(true);
      this.isLoading.set(false);
    }
  };

  async onDelete(selectedData: IEmployeeHome): Promise<void> {
    await this.onDeleteRegister(selectedData.idEmployee as number);
  }

  onShowModalToDeleteThroughTopBtn(): void {
    this.onShowAskModal(
      'Cadastro de atividades',
      `Deseja excluir o registro <b>${this.data().name}</b>?`,
      () => this.onDelete(this.data())
    );
  }

  onShowModalToDeleteThroughTableBtn(data?: IEmployeeHome): void {
    const selectedData = data ? data : this.data();
    this.onShowAskModal(
      'Cadastro de atividades',
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }
}
