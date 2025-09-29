import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@components/table/table.component';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { TableHeaderBoxComponent } from '@components/side-bar/side-bar.component';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { ButtonDeleteComponent } from '@components/button/button-delete/button-delete.component';
import { ButtonIconComponent } from '@components/button/button-icon/button-icon.component';
import { TooltipComponent } from '@components/tooltip/tooltip.component';
import { ToogleButtonComponent } from '@components/toogle-button/toogle-button.component';
import { InputComponent } from '@components/input/input.component';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { ModalStore } from '@store/modal/modal.store';
import { AuthStore } from '@store/auth/auth.store';
import { loadStorage } from '@core/utils/misc';
import { BaseRegisterStore, defaultTableHeaderIcon } from '@store/base/base.register.store';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseApiName, KeyOfData } from '@core/types/base.type';
import { ITableHeader } from '@core/interfaces/table.interface';
import { ITask } from '@core/interfaces/task.interface';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskApi } from '@core/http/task/task.api';

@Component({
  selector: 'app-task-home',
  imports: [
    CommonModule,
    TableHeaderBoxComponent,
    InputComponent,
    TableComponent,
    PaginationComponent,
    BreadcrumbComponent,
    MatIconModule,
    ButtonLabelComponent,
    ButtonDeleteComponent,
    ButtonIconComponent,
    TooltipComponent,
    ToogleButtonComponent,
    ButtonCloseComponent,
  ],
  templateUrl: './task-home.component.html',
  styleUrl: './task-home.component.scss',
})
export class TaskHomeComponent implements OnInit {
  readonly taskApi = inject(TaskApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  private activatedRoute = inject(ActivatedRoute);
  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);

  subscription: Subscription | undefined = undefined;

  readonly currentView = 'tasks';
  relatedView: BaseApiName = 'departments';
  readonly breadcrumbList = ['Cadastro', 'Atividades'];
  readonly inputSearchFilterList: KeyOfData[] = ['idTask', 'name', 'comment'];
  readonly inputSearchPlaceholder = 'Id ou Nome, Comentários';
  readonly initialTableHeaders = [
    {
      id: 0,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Id',
      databaseField: 'idTask',
    },
    {
      id: 1,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Atividade',
      databaseField: 'name',
    },
    {
      id: 2,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Funcionário',
      databaseField: 'employee',
    },
    {
      id: 3,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Início',
      databaseField: 'startDate',
    },
    {
      id: 4,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Fim',
      databaseField: 'finishDate',
    },
    {
      id: 5,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Tipo da Atividade',
      databaseField: 'taskType',
    },
    {
      id: 6,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Linha',
      databaseField: 'productionLine',
    },
    {
      id: 7,
      isHeaderActive: true,
      sortDirection: 0,
      icon: defaultTableHeaderIcon,
      headerName: 'Status',
      databaseField: 'status',
    },
  ] as ITableHeader<ITask>[];
  tableHeadersLocalStorageId = `table_headers_${this.currentView} + ${this.authStore.user().id}`;
  deptName = '';

  async ngOnInit() {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.deptName = params.get('department') || '';
    });
    this.onShowDataList();
    const tableHeaders = await loadStorage(this.tableHeadersLocalStorageId);
    const headers = tableHeaders ? tableHeaders : this.initialTableHeaders;
    this.baseRegisterStore.onSetSlicePropsToNewValue('tableHeaders', headers);
  }

  onRedirectToEditPage = (data: ITask): void => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', data);
    this.baseRegisterStore.onSetSlicePropsToNewValue('isEditData', true);
    this.modalStore.onRedirectPage(
      `/${this.deptName}/${this.currentView}/edit/${(this.baseRegisterStore.data() as ITask).idTask}`
    );
  };

  onCloneRegister = async (data: ITask): Promise<void> => {
    this.baseRegisterStore.onSetSlicePropsToNewValue('isCopiedData', true);
    this.baseRegisterStore.onSetSlicePropsToNewValue('data', data);
    this.modalStore.onRedirectPage(`/${this.deptName}/${this.currentView}/new`);
  };

  onShowDataList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.taskApi.onGetDataList(this.deptName);
      if (response.data) {
        const dataList = response.data as ITask[];
        this.baseRegisterStore.onSetSlicePropsToNewValue('initialData', dataList);
        this.baseRegisterStore.onSetSlicePropsToNewValue('dataList', dataList);
        this.baseRegisterStore.onClearData(dataList);
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Listar registros', error.error?.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  onDeleteRegister = async (id: number, onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.taskApi.onDelete(this.deptName, id);
      if (response.status) {
        this.onShowDataList();
        this.modalStore.onSetModalInfoType('success');
        this.modalStore.onShowInfoModal('Excluir registro', response.message, onActionOk);
      } else {
        this.modalStore.onShowInfoModal('Excluir registro', response.error?.message || '');
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Excluir registro', error.error.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  async onDelete(data: ITask): Promise<void> {
    await this.onDeleteRegister(data.idTask as number);
  }

  onShowModalToDelete(data?: ITask): void {
    const selectedData = data ? data : (this.baseRegisterStore.itemSelected() as ITask) || '';
    this.modalStore.onShowAskModal(
      'Cadastro de departamentos',
      `Deseja excluir o registro <b>${selectedData.name}</b>?`,
      () => this.onDelete(selectedData)
    );
  }
}
