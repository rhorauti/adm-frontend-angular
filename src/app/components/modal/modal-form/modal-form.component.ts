import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { ModalStore } from '@store/modal/modal.store';

@Component({
  selector: 'app-modal-form',
  imports: [CommonModule, FormsModule, ModalBaseComponent, ButtonLabelComponent],
  templateUrl: './modal-form.component.html',
  styleUrl: './modal-form.component.scss',
})
export class ModalFormComponent {
  readonly modalStore = inject(ModalStore);
  @Input() isModalActive!: boolean;
  @Input() bodyClass = '';
  @Input() width = 'sm:w-5/6';
  @Input() isDisabled = true;

  @Output() closeActionNokEmitter = new EventEmitter<boolean>();

  OnActionNok(): void {
    this.closeActionNokEmitter.emit();
  }

  @Output() closeActionOkEmitter = new EventEmitter();

  OnActionOk(): void {
    this.closeActionOkEmitter.emit();
  }
}
