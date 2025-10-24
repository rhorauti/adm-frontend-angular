import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '@components/home/home.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { CompanyApi } from '@core/http/company/company.api';
import { ICompanyHome } from '@core/interfaces/company.interface';
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
  selector: 'app-company-home',
  imports: [HomeComponent, ModalAskComponent, ModalInfoComponent, LoadingComponent],
  templateUrl: './company-home.component.html',
  styleUrl: './company-home.component.scss',
})
export class CompanyHomeComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private authStore = inject(AuthStore);
  readonly router = inject(Router);
  readonly companyApi = inject(CompanyApi);

  readonly currentView = 'companies';
  readonly currentViewTranslated = 'empresas';
  readonly keyId = 'idCompany';
  readonly breadcrumbList = ['Cadastro', 'Empresas'];
  readonly inputSearchFilterList: KeyOfData[] = ['idCompany', 'nickname', 'name'];
  readonly inputSearchPlaceholder = 'Id, Nome Fantasia, Razão Social';
  subscription: Subscription | undefined = undefined;
  tableHeadersLocalStorageId = `table_headers_${this.currentView}_${this.authStore.user().id}`;
  idCompany = 0;

  isComponentSetToDefault = signal(false);
  initialDataList = signal<ICompanyHome[]>([]);
  data = signal<ICompanyHome>({
    idCompany: 0,
    nickname: '',
    name: '',
    cnpj: '',
    ie: '',
    im: '',
  });

  newRegisterUrl = `/${this.currentView}/new`;

  tableHeaders = [
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idCompany',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Nome Fantasia',
      databaseField: 'nickname',
    },
    {
      id: 2,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Razão Social',
      databaseField: 'name',
    },
    {
      id: 3,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'CNPJ/CPF',
      databaseField: 'cnpj',
    },
    {
      id: 4,
      isHeaderActive: false,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Inscr.Estadual',
      databaseField: 'ie',
    },
    {
      id: 5,
      isHeaderActive: false,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Inscr.Municipal',
      databaseField: 'im',
    },
  ] as ITableHeader<ICompanyHome>[];

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

  onRedirectToEditPage = (data: ICompanyHome): void => {
    this.router.navigate([`/${this.currentView}/edit/${data.idCompany}`]);
  };

  onCloneRegister = (data: ICompanyHome): void => {
    this.router.navigate([`/${this.currentView}/new/${data.idCompany}`]);
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
      const response = await this.companyApi.onGetDataList();
      if (response.data) {
        const dataList = response.data as ICompanyHome[];
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
      const response = await this.companyApi.onDelete(this.idCompany);
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

  async onDelete(selectedData: ICompanyHome): Promise<void> {
    await this.onDeleteRegister(selectedData.idCompany as number);
  }

  onShowModalToDeleteThroughTopBtn(): void {
    this.onShowAskModal(
      'Cadastro de atividades',
      `Deseja excluir o registro <b>${this.data().name}</b>?`,
      () => this.onDelete(this.data())
    );
  }

  onShowModalToDeleteThroughTableBtn(data?: ICompanyHome): void {
    const selectedData = data ? data : this.data();
    this.onShowAskModal(
      'Cadastro de atividades',
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }
}
