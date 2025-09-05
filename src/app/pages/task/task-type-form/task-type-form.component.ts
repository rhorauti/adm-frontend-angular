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
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { InputComponent } from '@components/input/input.component';
import { TextAreaComponent } from '@components/text-area/text-area.component';
import { DepartmentApi } from '@core/http/department/department.api';
import { TaskTypeApi } from '@core/http/task-type/task-type.api';
import { IDepartment } from '@core/interfaces/department.interface';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { ITaskType } from '@core/interfaces/task.interface';
import { BaseApiName } from '@core/types/base.type';
import { translateDeptName } from '@core/utils/misc';
import { BaseRegisterStore } from '@store/base/base.register.store';
import { ModalStore } from '@store/modal/modal.store';
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
  ],
  templateUrl: './task-type-form.component.html',
  styleUrl: './task-type-form.component.scss',
})
export class TaskTypeFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
  readonly taskApi = inject(TaskTypeApi);
  readonly departmentApi = inject(DepartmentApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);

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

  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.id = Number(params.get('id')) || 0;
      this.deptName = params.get('department') || '';
    });
    if (this.baseRegisterStore.isEditData()) {
      this.data = this.baseRegisterStore.data() as ITaskType;
      this.baseRegisterStore.onSetSlicePropsToNewValue('isEditData', false);
    } else if (this.baseRegisterStore.isCopiedData()) {
      this.data = this.baseRegisterStore.data() as ITaskType;
      this.id = 0;
      this.data.idTaskType = 0;
      this.baseRegisterStore.onSetSlicePropsToNewValue('isCopiedData', false);
    }
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  defineTitle = (): string => {
    if (this.id == 0) {
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
    this.modalStore.onRedirectPage(`/${this.deptName}/${this.currentView}`);
  };

  fieldValidation = (): void => {
    const message = 'O campo Nome do Cargo não pode estar vazio.';
    if (this.data.name.length == 0) {
      this.modalStore.onShowInfoModal(`Cadastro de ${this.currentViewTranslatedSingular}`, message);
      throw Error(message);
    }
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      this.fieldValidation();
      const deptNameTranslated = translateDeptName(this.deptName);
      const dept = await this.departmentApi.onGetDataByField('name', deptNameTranslated);
      const deptData = dept.data as IDepartment;
      this.data.department = deptData;
      const response = await this.taskApi.onSave(this.deptName, this.data);
      if (response.status) {
        this.modalStore.onSetModalInfoType('success');
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslatedSingular}`,
          response.message,
          onActionOk
        );
      } else {
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslatedSingular}`,
          response.error?.message || ''
        );
      }
    } catch (e: unknown) {
      if (e instanceof HttpErrorResponse) {
        const error = e as HttpErrorResponse;
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslated}`,
          error.error.message
        );
      } else {
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslated}`,
          (e as Error).message
        );
      }
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
