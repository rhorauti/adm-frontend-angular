import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { ButtonComponent } from '@components/button/button.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { RegisterCompanyApi } from '@core/api/http/company.api';
import { TableItemType } from '@core/interfaces/IBase';

interface IFormData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-modal-check',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ModalBaseComponent,
    ModalInfoComponent,
    ButtonComponent,
    LoadingComponent,
  ],
  providers: [RegisterCompanyApi],
  templateUrl: './modal-check.component.html',
  styleUrl: './modal-check.component.scss',
})
export class ModalCheckComponent implements OnChanges {
  @Input() tableDataSelected: TableItemType = {
    idCompany: 0,
    date: new Date().toISOString(),
    nickname: '',
    name: '',
    cnpj: '',
  };
  @Input() isEditForm = false;
  public firstIdx1 = 0;
  public firstIdx2 = 0;
  public lastIdx1 = 0;
  public lastIdx2 = 0;
  public sizeArrayFormData = 8;
  public arrayFormData: IFormData[] = [{ title: '', description: '' }];

  ngOnChanges() {
    const arrayKeys = Object.keys(this.tableDataSelected);
    const arrayValues = Object.values(this.tableDataSelected);
    this.arrayFormData = arrayKeys.map((key, idx) => ({
      title: key,
      description: arrayValues[idx],
    }));
    if (this.arrayFormData.length > this.sizeArrayFormData) {
      this.lastIdx1 = Math.ceil(this.arrayFormData.length / 2);
      this.firstIdx2 = this.lastIdx1;
      this.lastIdx2 = this.arrayFormData.length;
    }
  }

  @Input() isModalCheckActive = false;

  showModalCheck() {
    this.isModalCheckActive = true;
  }

  @Output() closeEventEmitter = new EventEmitter();

  emitCloseEvent(): void {
    this.closeEventEmitter.emit();
  }

  @Output() successEventEmitter = new EventEmitter();

  emitSuccessEvent() {
    this.successEventEmitter.emit();
  }
}
