import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ButtonComponent } from '@components/button/button.component';

@Component({
  selector: 'app-modal-info',
  standalone: true,
  imports: [CommonModule, MatIconModule, ButtonComponent, ModalBaseComponent],
  templateUrl: './modal-info.component.html',
  styleUrl: './modal-info.component.scss',
})
export class ModalInfoComponent implements OnChanges {
  @Input() type = '';
  @Input() showModal = false;
  @Input() icon = 'check';
  @Input() iconBackgroundColor = 'bg-green-600';
  @Input() iconTextColor = 'text-green-100';
  @Input() title = 'Sucesso!';
  @Input() description = 'Dados registrados com sucesso!';
  @Output() closeEmitter = new EventEmitter<boolean>();
  @Output() actionOkEmitter = new EventEmitter<boolean>();

  ngOnChanges() {
    switch (this.type) {
      case 'success': {
        this.icon = 'check';
        this.title = 'Sucesso!';
        this.iconBackgroundColor = 'bg-green-600';
        this.iconTextColor = 'text-green-100';
        break;
      }
      case 'failure': {
        this.icon = 'close';
        this.title = 'Erro!';
        this.iconBackgroundColor = 'bg-red-500';
        this.iconTextColor = 'text-white';
        break;
      }
    }
  }

  @Output() closeModalEmitter = new EventEmitter<boolean>();

  /**
   * closeModalInfo
   * Emite um evento para o componente pai para fechar o modal Info.
   */
  closeModalInfo(): void {
    this.closeModalEmitter.emit(false);
  }

  onActionOk(): void {
    this.actionOkEmitter.emit();
  }
}
