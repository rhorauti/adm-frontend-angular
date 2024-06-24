import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-base',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.scss',
})
export class ModalBaseComponent {
  @Input() showModal = false;
  @Input() title = '';
  @Input() showHeader = false;
  @Input() showCloseBtn = false;
  @Input() headerClass = '';
  @Input() isModalForm = false;
  @Input() bodyClass = '';
  @Input() showFooter = false;
  @Input() footerClass = '';
  @Output() emitCloseModal = new EventEmitter<boolean>();

  closeModal(): void {
    this.emitCloseModal.emit(false);
  }
}
