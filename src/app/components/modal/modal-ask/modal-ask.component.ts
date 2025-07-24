import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ButtonLabelComponent } from '../../button/button-label/button-label.component';
import { Icon } from '@core/types/icon.type';
import { ModalStore } from '@store/modal/modal.store';

@Component({
  selector: 'app-modal-ask',
  imports: [CommonModule, MatIconModule, ModalBaseComponent, ButtonLabelComponent],
  templateUrl: './modal-ask.component.html',
  styleUrl: './modal-ask.component.scss',
})
export class ModalAskComponent implements OnChanges {
  readonly modalStore = inject(ModalStore);
  @Input() isModalActive!: boolean;
  @Input() type = 'warning';
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  iconName: Icon = 'warning';
  divIconClass = '';
  iconClass = '';

  ngOnChanges() {
    switch (this.type) {
      case 'warning': {
        this.iconName = 'warning';
        this.iconClass = 'text-yellow-500';
        break;
      }
    }
  }

  @Output() closeActionNokEmitter = new EventEmitter<boolean>();

  OnActionNok(): void {
    this.closeActionNokEmitter.emit();
  }

  @Output() closeActionOkEmitter = new EventEmitter();

  OnActionOk(): void {
    this.closeActionOkEmitter.emit();
  }
}
