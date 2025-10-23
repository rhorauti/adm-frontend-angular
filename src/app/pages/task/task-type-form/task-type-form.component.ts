import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { TextAreaComponent } from '@components/text-area/text-area.component';
import { DepartmentApi } from '@core/http/department/department.api';
import { TaskTypeApi } from '@core/http/task-type/task-type.api';
import { IDepartment } from '@core/interfaces/department.interface';
import { ActionCallback, IModalInfo } from '@core/interfaces/modal.interface';
import { ITaskType } from '@core/interfaces/task.interface';
import { BaseApiName } from '@core/types/base.type';
import { translateDeptName } from '@core/utils/misc';
import { ModalType } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-type-form',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    ButtonLabelComponent,
    FormsModule,
    InputComponent,
    TextAreaComponent,
    ModalInfoComponent,
    LoadingComponent,
  ],
  templateUrl: './task-type-form.component.html',
  styleUrl: './task-type-form.component.scss',
})
export class TaskTypeFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
  readonly taskTypeApi = inject(TaskTypeApi);
  readonly departmentApi = inject(DepartmentApi);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);

  private cdr = inject(ChangeDetectorRef);

  currentView: BaseApiName = 'task-types';
  currentViewTranslated = 'Tipos de atividades';
  currentViewTranslatedSingular = this.currentViewTranslated.slice(0, -1);
  subscription: Subscription | undefined = undefined;
  breadcrumbList: string[] = [];
  deptName = '';
  id: number | null = null;
  data = {
    idTaskType: null,
    name: '',
    comment: '',
    department: {
      idDepartment: null,
      name: '',
      comment: '',
    },
  } as ITaskType;

  modalInfo = signal<IModalInfo>({
    isActive: false,
    title: '',
    description: '',
    type: '',
    onActionOk: null,
  });

  isLoading = signal(false);

  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.id = Number(params.get('idTaskType')) || -1;
      this.deptName = params.get('department') || '';
    });
    if (this.router.url.includes('edit') && (this.id || 0) > 0) {
      const taskType = await this.taskTypeApi.onGetDataById(this.deptName, this.id || 0);
      this.data = taskType.data as ITaskType;
    } else if (this.router.url.includes('new') && (this.id || 0) > 0) {
      const taskType = await this.taskTypeApi.onGetDataById(this.deptName, this.id || 0);
      this.data = taskType.data as ITaskType;
      this.data.idTaskType = null;
    }
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  defineTitle = (): string => {
    if (!this.id || this.id == -1) {
      return 'Novo Registro';
    } else {
      return this.data.name;
    }
  };

  ngAfterViewInit(): void {
    this.onDefineInputId();
    this.cdr.detectChanges();
  }

  onDefineInputId = () => {
    this.inputs.forEach((input, index) => {
      input.id = `${this.currentView}-form-${index}`;
      this.labels.get(index)?.nativeElement.setAttribute('for', input.id);
    });
  };

  onBackToPreviousPage = (): void => {
    this.router.navigate([`/${this.deptName}/${this.currentView}`]);
  };

  fieldValidation = (): void => {
    const message = 'O campo Nome do Cargo não pode estar vazio.';
    if (this.data.name.length == 0) {
      this.onShowInfoModal('failure', `Cadastro de ${this.currentViewTranslatedSingular}`, message);
      throw Error(message);
    }
  };

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

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.isLoading.set(true);
      this.fieldValidation();
      const deptNameTranslated = translateDeptName(this.deptName);
      const dept = await this.departmentApi.onGetDataByQuery('name', deptNameTranslated);
      const deptData = dept.data as IDepartment;
      this.data.department = deptData;
      const response = await this.taskTypeApi.onSave(this.deptName, this.data);
      if (response.status) {
        this.onShowInfoModal(
          'success',
          `Cadastro de ${this.currentViewTranslatedSingular}`,
          response.message,
          onActionOk
        );
      } else {
        this.onShowInfoModal(
          'failure',
          `Cadastro de ${this.currentViewTranslatedSingular}`,
          response.error?.message || ''
        );
      }
    } catch (e: unknown) {
      if (e instanceof HttpErrorResponse) {
        const error = e as HttpErrorResponse;
        this.onShowInfoModal(
          'failure',
          `Cadastro de ${this.currentViewTranslated}`,
          error.error.message
        );
      } else {
        this.onShowInfoModal(
          'failure',
          `Cadastro de ${this.currentViewTranslated}`,
          (e as Error).message
        );
      }
    } finally {
      this.isLoading.set(false);
    }
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
