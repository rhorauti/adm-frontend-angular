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
import { ProductionLineApi } from '@core/http/production-line/production-line.api';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { IProductionLine } from '@core/interfaces/production-line.interface';
import { BaseApiName } from '@core/types/base.type';
import { BaseRegisterStore } from '@store/base/base.register.store';
import { ModalStore } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-production-line-form',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    ButtonLabelComponent,
    FormsModule,
    InputComponent,
    TextAreaComponent,
  ],
  templateUrl: './production-line-form.component.html',
  styleUrl: './production-line-form.component.scss',
})
export class ProductionLineFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
  readonly productionLineApi = inject(ProductionLineApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);

  private cdr = inject(ChangeDetectorRef);

  currentView: BaseApiName = 'production-lines';
  currentViewTranslated = 'Linhas de Produção';
  subscription: Subscription | undefined = undefined;
  breadcrumbList: string[] = [];
  id = 0;

  data = {
    idProductionLine: 0,
    lineCode: '',
    lineName: '',
    comment: '',
  } as IProductionLine;

  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.id = Number(params.get('id')) || 0;
    });
    if (this.baseRegisterStore.isEditData()) {
      this.data = this.baseRegisterStore.data() as IProductionLine;
      this.baseRegisterStore.onSetSlicePropsToNewValue('isEditData', false);
    } else if (this.baseRegisterStore.isCopiedData()) {
      this.data = this.baseRegisterStore.data() as IProductionLine;
      this.id = 0;
      this.data.idProductionLine = 0;
      this.baseRegisterStore.onSetSlicePropsToNewValue('isCopiedData', false);
    }
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  defineTitle = (): string => {
    if (this.id == 0) {
      return 'Novo Registro';
    } else {
      return this.data.lineCode;
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
    this.modalStore.onRedirectPage(`/${this.currentView}`);
  };

  fieldValidation = (): void => {
    const message = 'O campo Nome do Cargo não pode estar vazio.';
    if (this.data && this.data.lineCode.length == 0) {
      throw Error(message);
    }
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      this.fieldValidation();
      const response = await this.productionLineApi.onSave(this.data);
      if (response.status) {
        this.modalStore.onSetModalInfoType('success');
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslated}`,
          response.message,
          onActionOk
        );
      } else {
        this.modalStore.onShowInfoModal(
          `Cadastro de ${this.currentViewTranslated}`,
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
