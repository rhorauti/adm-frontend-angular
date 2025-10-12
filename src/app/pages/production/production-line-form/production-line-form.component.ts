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
import { ListBoxComponent } from '@components/list-box/list-box.component';
import { TextAreaComponent } from '@components/text-area/text-area.component';
import { ToogleButtonComponent } from '@components/toogle-button/toogle-button.component';
import { ProductApi } from '@core/http/product/product.api';
import { ProductionLineApi } from '@core/http/production-line/production-line.api';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { IProduct } from '@core/interfaces/product.interface';
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
    ListBoxComponent,
    ToogleButtonComponent,
  ],
  templateUrl: './production-line-form.component.html',
  styleUrl: './production-line-form.component.scss',
})
export class ProductionLineFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
  readonly productionLineApi = inject(ProductionLineApi);
  readonly productApi = inject(ProductApi);
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
  showToolingList = true;
  listBoxStringList: string[] = [];
  selectedListBoxStringList: string[] = [];
  listBoxDataList: Partial<IProduct>[] = [];

  productionLineData = {
    idProductionLine: 0,
    lineCode: '',
    lineName: '',
    toolingList: null,
    comment: '',
  } as IProductionLine;

  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.id = Number(params.get('id')) || 0;
    });
    await this.onGetToolingList();
    this.listBoxStringList = this.listBoxDataList.map(
      data => data.internalPartNumber + ' - ' + data.name
    );
    if (this.baseRegisterStore.isEditData()) {
      this.productionLineData = this.baseRegisterStore.data() as IProductionLine;
      this.baseRegisterStore.onSetStateToNewValue('isEditData', false);
    } else if (this.baseRegisterStore.isCopiedData()) {
      this.productionLineData = this.baseRegisterStore.data() as IProductionLine;
      this.id = 0;
      this.productionLineData.idProductionLine = 0;
      this.baseRegisterStore.onSetStateToNewValue('isCopiedData', false);
    }
    if (this.productionLineData.toolingList && this.productionLineData.toolingList.length > 0) {
      this.selectedListBoxStringList = this.productionLineData.toolingList.map(
        data => data.internalPartNumber + ' - ' + data.name
      );
    }
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  onSetSelectedToolingList = (toolingList: string[]): void => {
    if (!this.showToolingList) {
      this.productionLineData.toolingList = [];
    } else {
      const splittedList = toolingList.map(tooling => tooling.split('-').map(item => item.trim()));
      const mappedList = splittedList.map(item => item[0]);
      const selectedToolingList = this.listBoxDataList.filter(tooling =>
        mappedList.some(pn => pn == tooling.internalPartNumber)
      );
      this.productionLineData.toolingList = selectedToolingList;
    }
  };

  onGetToolingList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.productApi.onGetDataListByProductType('name', 'Ativo');
      if (response.data) {
        this.listBoxDataList = response.data as Partial<IProduct>[];
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Listar tipos de atividades: ', error.error?.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  defineTitle = (): string => {
    if (this.id == 0) {
      return 'Novo Registro';
    } else {
      return this.productionLineData.lineCode;
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
    const message = 'O campo Código da Linha não pode estar vazio.';
    if (this.productionLineData && this.productionLineData.lineCode.length == 0) {
      throw Error(message);
    }
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      this.fieldValidation();
      const response = await this.productionLineApi.onSave(this.productionLineData);
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
          error.error?.message || 'Erro desconhecido'
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
