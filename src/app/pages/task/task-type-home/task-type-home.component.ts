import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '@components/home/home.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { TaskTypeApi } from '@core/http/task-type/task-type.api';
import { ActionCallback, IModalAsk, IModalInfo } from '@core/interfaces/modal.interface';
import { ITableHeader } from '@core/interfaces/table.interface';
import { ITaskType } from '@core/interfaces/task.interface';
import { KeyOfData } from '@core/types/base.type';
import { loadStorage } from '@core/utils/misc';
import { AuthStore } from '@store/auth/auth.store';
import { defaultTableHeaderIcon } from '@store/base/base.register.store';
import { ModalType } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-type-home',
  imports: [HomeComponent, ModalAskComponent, ModalInfoComponent, LoadingComponent],
  templateUrl: './task-type-home.component.html',
  styleUrl: './task-type-home.component.scss',
})
export class TaskTypeHomeComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private authStore = inject(AuthStore);
  readonly router = inject(Router);
  currentView = 'task-types';
  breadcrumbList = ['Cadastro', 'Tipos de Atividades'];
  inputSearchFilterList: KeyOfData[] = ['idTaskType', 'name', 'comment'];
  inputSearchPlaceholder = 'Id ou Nome, Comentários';
  paramsIdDepartment = 0;
  subscription: Subscription | undefined = undefined;
  tableHeadersLocalStorageId = `table_headers_${this.currentView}_${this.authStore.user().id}`;

  readonly taskTypeApi = inject(TaskTypeApi);
  isComponentSetToDefault = signal(false);
  initialDataList = signal<ITaskType[]>([]);
  data = signal<ITaskType>({
    idTaskType: 0,
    name: '',
    comment: '',
    department: {
      idDepartment: 0,
      name: '',
      comment: '',
    },
  });

  newRegisterUrl = '';

  tableHeaders = [
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idTaskType',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Nome da atividade',
      databaseField: 'name',
    },
    {
      id: 2,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Comentários',
      databaseField: 'comment',
    },
  ] as ITableHeader<ITaskType>[];

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
      this.paramsIdDepartment = Number(params.get('idDepartment') || 0);
    });
    this.newRegisterUrl = `/${this.paramsIdDepartment}/${this.currentView}/new`;
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

  onRedirectToEditPage = (data: ITaskType): void => {
    this.router.navigate([
      `/${this.paramsIdDepartment}/${this.currentView}/edit/${data.idTaskType}`,
    ]);
  };

  onCloneRegister = (data: ITaskType): void => {
    this.router.navigate([
      `/${this.paramsIdDepartment}/${this.currentView}/new/${data.idTaskType}`,
    ]);
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
      const response = await this.taskTypeApi.onGetDataList(this.paramsIdDepartment);
      if (response.data) {
        const dataList = response.data as ITaskType[];
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

  onDeleteRegister = async (id: number, onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.isLoading.set(true);
      const response = await this.taskTypeApi.onDelete(this.paramsIdDepartment, id);
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

  async onDelete(selectedData: ITaskType): Promise<void> {
    await this.onDeleteRegister(selectedData.idTaskType as number);
  }

  onShowModalToDeleteThroughTopBtn(): void {
    this.onShowAskModal(
      'Cadastro de atividades',
      `Deseja excluir o registro <b>${this.data().name}</b>?`,
      () => this.onDelete(this.data())
    );
  }

  onShowModalToDeleteThroughTableBtn(data?: ITaskType): void {
    const selectedData = data ? data : this.data();
    this.onShowAskModal(
      'Cadastro de atividades',
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }
}
