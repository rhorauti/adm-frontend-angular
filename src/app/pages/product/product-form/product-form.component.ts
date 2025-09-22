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
import { SelectComponent } from '@components/select/select.component';
import { ActionCallback } from '@core/interfaces/modal.interface';
import { BaseApiName } from '@core/types/base.type';
import { BaseRegisterStore } from '@store/base/base.register.store';
import { ModalStore } from '@store/modal/modal.store';
import { Subscription } from 'rxjs';
import { PhotoBoxSingleComponent } from '@components/photo-box/photo-box-single/photo-box-single.component';
import { ProductApi } from '@core/http/product/product.api';
import { IProduct, IProductType } from '@core/interfaces/product.interface';
import { IUnit } from '@core/interfaces/unit.interface';
import { UnitApi } from '@core/http/unit/unit.api';
import { ProductTypeApi } from '@core/http/product/product-type.api';
import { TextAreaComponent } from '@components/text-area/text-area.component';

@Component({
  selector: 'app-product-form',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    ButtonLabelComponent,
    FormsModule,
    InputComponent,
    SelectComponent,
    PhotoBoxSingleComponent,
    TextAreaComponent,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ViewChildren(SelectComponent) select!: QueryList<SelectComponent>;
  @ViewChildren('labelForm') private labels!: QueryList<ElementRef>;
  readonly productApi = inject(ProductApi);
  readonly unitApi = inject(UnitApi);
  readonly productTypeApi = inject(ProductTypeApi);
  readonly baseRegisterStore = inject(BaseRegisterStore);
  private activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);

  private cdr = inject(ChangeDetectorRef);

  currentView: BaseApiName = 'products';
  currentViewTranslated = 'Produtos'.slice(0, -1);
  subscription: Subscription | undefined = undefined;
  breadcrumbList: string[] = [];
  idProduct = 0;
  idCompany = 0;
  unitList: IUnit[] = [];
  unitOptionList: string[] = [];
  productTypeList: IProductType[] = [];
  productTypeOptionList: string[] = [];
  currencyList = ['R$', 'USD'];

  // unitData = {
  //   idUnit: null,
  //   name: '',
  //   comment: '',
  // } as IUnit;

  // productTypeData = {
  //   idProductType: null,
  //   name: '',
  //   comment: '',
  // } as IProductType;

  imgPreview: File | null = null;
  isRemovedPhoto = false;

  selectedOrigin = '';
  originList = ['Produto nacional', 'Fabricado interno', 'Produto importado'];
  ncmList = ['000000', '1111111'];

  productData = {
    idProduct: null,
    internalPartNumber: '',
    customerPartNumber: '',
    name: '',
    nameTranslated: '',
    origin: 0,
    ncm: '',
    icms: 0,
    pis: 0,
    cofins: 0,
    ipi: 0,
    purchasingCurrency: this.currencyList[0],
    purchasingUnitPrice: 0,
    salesCurrency: this.currencyList[0],
    salesUnitPrice: 0,
    materialSpec: '',
    width: 0,
    height: 0,
    depth: 0,
    weight: 0,
    qrcode: '',
    photoUrl: '',
    comment: '',
    unit: {
      idUnit: null,
      name: '',
      comment: '',
    },
    productType: {
      idProductType: null,
      name: '',
      comment: '',
    },
  } as IProduct;

  async ngOnInit(): Promise<void> {
    this.subscription = this.activatedRoute.paramMap.subscribe(params => {
      this.idProduct = Number(params.get('idProduct')) || 0;
    });
    await this.onGetUnitList();
    await this.onGetProductTypeList();
    if (this.baseRegisterStore.isEditData()) {
      this.productData = this.baseRegisterStore.data() as IProduct;
      this.baseRegisterStore.onSetSlicePropsToNewValue('isEditData', false);
    } else if (this.baseRegisterStore.isCopiedData()) {
      this.productData = this.baseRegisterStore.data() as IProduct;
      this.productData.idProduct = 0;
      this.idProduct = 0;
      this.productData.photoUrl = '';
      this.baseRegisterStore.onSetSlicePropsToNewValue('isCopiedData', false);
    }
    this.productData.unit = this.unitList.find(d => d.idUnit == this.productData.unit.idUnit) ?? {
      idUnit: null,
      name: '',
      comment: '',
    };
    this.productData.productType = this.productTypeList.find(
      p => p.idProductType == this.productData.productType.idProductType
    ) ?? { idProductType: null, name: '', comment: '' };
    this.onSetOriginToString(this.productData.origin);
    this.defineTitle();
    this.breadcrumbList = ['Cadastro', this.currentViewTranslated, `${this.defineTitle()}`];
  }

  onSetOriginToString = (origin: number): void => {
    switch (origin) {
      case 1: {
        this.selectedOrigin = this.originList[0];
        break;
      }
      case 2: {
        this.selectedOrigin = this.originList[1];
        break;
      }
      case 3: {
        this.selectedOrigin = this.originList[2];
        break;
      }
    }
  };

  onSetOriginToNumber = (originTranslated: string): void => {
    switch (originTranslated) {
      case this.originList[0]: {
        this.productData.origin = 1;
        break;
      }
      case this.originList[1]: {
        this.productData.origin = 2;
        break;
      }
      case this.originList[2]: {
        this.productData.origin = 3;
        break;
      }
    }
  };

  onGetUnitList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.unitApi.onGetDataList();
      if (response.data) {
        const data = response.data as IUnit[];
        this.unitList = data;
        this.unitOptionList = data.map(unit => unit.name);
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Listar departamentos: ', error.error?.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  onGetProductTypeList = async (): Promise<void> => {
    try {
      this.modalStore.onLoading(true);
      const response = await this.productTypeApi.onGetDataList();
      if (response.data) {
        const data = response.data as IProductType[];
        this.productTypeList = data;
        this.productTypeOptionList = data.map(position => position.name);
      } else {
        return;
      }
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.modalStore.onShowInfoModal('Listar cargos: ', error.error?.message);
    } finally {
      this.modalStore.onLoading(false);
    }
  };

  defineTitle = (): string => {
    if (this.idProduct == 0) {
      return 'Novo Registro';
    } else {
      return this.productData.name;
    }
  };

  ngAfterViewInit(): void {
    this.onDefineInputId();
    this.cdr.detectChanges();
  }

  onDefineInputId = () => {
    this.inputs.forEach((input, index) => {
      input.id = `${this.currentView}-form-input-${index}`;
      this.labels.get(index)?.nativeElement.setAttribute('for', input.id);
    });
  };

  onDefineSelectId = () => {
    this.select.forEach((select, index) => {
      select.id = `${this.currentView}-form-select-${index}`;
      this.labels.get(index)?.nativeElement.setAttribute('for', select.id);
    });
  };

  setUnitValue = (unitName: string): void => {
    this.productData.unit = this.unitList.find(unit => unit.name == unitName.trim()) as IUnit;
    if (!this.productData.unit) {
      this.productData.unit = {
        idUnit: null,
        name: '',
        comment: '',
      };
    }
  };

  setProductTypeValue = (productTypeName: string): void => {
    this.productData.productType = this.productTypeList.find(
      type => type.name == productTypeName.trim()
    ) as IProductType;
    if (!this.productData.productType) {
      this.productData.productType = {
        idProductType: null,
        name: '',
        comment: '',
      };
    }
  };

  onPhotoRemoved = (file: File | null): void => {
    if (file == null) {
      this.isRemovedPhoto = true;
      this.imgPreview = null;
    } else {
      this.imgPreview = file;
      this.isRemovedPhoto = false;
    }
  };

  onBackToPreviousPage = (): void => {
    this.modalStore.onRedirectPage(`/${this.currentView}`);
  };

  fieldValidation = (): void => {
    let message = '';
    if (this.productData && this.productData.name.length == 0) {
      message = 'O campo Nome não pode estar vazio.';
    }
    if (message.length > 0) {
      throw Error(message);
    }
  };

  setFinalData = (): FormData => {
    const formData = new FormData();
    if (this.imgPreview) {
      formData.append('file', this.imgPreview, this.imgPreview.name);
    }
    formData.append(
      'data',
      JSON.stringify({
        idProduct: this.productData.idProduct,
        internalPartNumber: this.productData.internalPartNumber ?? '',
        customerPartNumber: this.productData.customerPartNumber ?? '',
        name: this.productData.name ?? '',
        nameTranslated: this.productData.nameTranslated ?? '',
        ncm: this.productData.ncm ?? '',
        icms: this.productData.icms ?? 0,
        pis: this.productData.pis ?? 0,
        cofins: this.productData.cofins ?? 0,
        ipi: this.productData.ipi ?? 0,
        origin: this.productData.origin ?? 0,
        purchasingCurrency: this.productData.purchasingCurrency ?? '',
        purchasingUnitPrice: this.productData.purchasingUnitPrice ?? 0,
        salesCurrency: this.productData.salesCurrency ?? '',
        salesUnitPrice: this.productData.salesUnitPrice ?? 0,
        materialSpec: this.productData.materialSpec ?? '',
        width: this.productData.width ?? 0,
        height: this.productData.height ?? 0,
        depth: this.productData.depth ?? 0,
        weight: this.productData.weight ?? 0,
        unit: this.productData.unit ?? null,
        productType: this.productData.productType ?? null,
        comment: this.productData.comment ?? '',
        isRemovedPhoto: this.isRemovedPhoto,
      } as IProduct)
    );
    return formData;
  };

  onSaveRegister = async (onActionOk?: ActionCallback): Promise<void> => {
    try {
      const finalData = this.setFinalData();
      this.fieldValidation();
      this.modalStore.onLoading(true);
      const response = await this.productApi.onSave(finalData);
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
