import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { ButtonStandardComponent } from '../../button/button-standard/button-standard.component';
import { MatIconModule } from '@angular/material/icon';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ModalCheckComponent } from '../modal-check/modal-check.component';

@Component({
  selector: 'app-modal-ask',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ButtonStandardComponent,
    ModalBaseComponent,
    ModalCheckComponent,
  ],
  templateUrl: './modal-ask.component.html',
  styleUrl: './modal-ask.component.scss',
})
export class ModalAskComponent implements OnChanges {
  @Input() showModal = false;
  @Input() modalDescription = '';

  @Input() modalType = '';
  @Input() modalIcon = '';
  @Input() iconModalBackgroundColor = '';
  @Input() iconModalTextColor = '';
  @Input() modalTitle = '';

  ngOnChanges() {
    switch (this.modalType) {
      case 'confirmation': {
        this.modalIcon = 'question_answer';
        this.iconModalBackgroundColor = 'bg-yellow-500';
        this.iconModalTextColor = 'text-white';
        this.modalTitle = 'Alerta!';
        break;
      }
    }
  }

  @Output() cancelEmitter = new EventEmitter<boolean>();

  cancel(): void {
    this.cancelEmitter.emit(false);
  }

  @Output() actionOkEmitter = new EventEmitter<boolean>();

  OnActionOk(): void {
    this.actionOkEmitter.emit(false);
  }
}
