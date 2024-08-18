import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '@components/button/button.component';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ModalCheckComponent } from '../modal-check/modal-check.component';
import { TableItemType } from '@core/interfaces/IBase';

@Component({
  selector: 'app-modal-ask',
  standalone: true,
  imports: [CommonModule, MatIconModule, ButtonComponent, ModalBaseComponent, ModalCheckComponent],
  templateUrl: './modal-ask.component.html',
  styleUrl: './modal-ask.component.scss',
})
export class ModalAskComponent implements OnChanges {
  @Input() showModal = false;
  @Input() description = '';
  @Input() type = '';
  @Input() icon = '';
  @Input() iconBackgroundColor = '';
  @Input() iconModalTextColor = '';
  @Input() title = '';
  @Input() tableItemSelected: TableItemType = {
    idCompany: null,
    type: 0,
    date: '',
    nickname: '',
    name: '',
    cnpj: '',
  };

  ngOnChanges() {
    switch (this.type) {
      case 'confirmation': {
        this.icon = 'question_answer';
        this.iconBackgroundColor = 'bg-yellow-500';
        this.iconModalTextColor = 'text-white';
        this.title = 'Alerta!';
        break;
      }
    }
  }

  @Output() closeEmitter = new EventEmitter<boolean>();

  close(): void {
    this.closeEmitter.emit(false);
  }

  @Output() actionOkEmitter = new EventEmitter<TableItemType>();

  OnActionOk(): void {
    this.actionOkEmitter.emit(this.tableItemSelected);
  }
}
