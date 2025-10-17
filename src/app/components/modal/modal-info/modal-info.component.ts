import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { ModalType } from '@store/modal/modal.store';

export type ModalIconType = 'success' | 'failure';

@Component({
  selector: 'app-modal-info',
  imports: [CommonModule, MatIconModule, ModalBaseComponent, ButtonLabelComponent],
  templateUrl: './modal-info.component.html',
  styleUrl: './modal-info.component.scss',
})
export class ModalInfoComponent implements OnChanges {
  @Input({ required: true }) isModalActive!: boolean;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() showHeader = false;
  @Input() type: ModalType = '';
  icon = '';
  iconBackgroundColor = '';

  ngOnChanges(): void {
    if (this.type == 'success') {
      this.icon = 'check';
      this.iconBackgroundColor = 'bg-green-600';
    } else {
      this.icon = 'close';
      this.iconBackgroundColor = 'bg-red-500';
    }
  }

  onKeyBoardEnter(event: KeyboardEvent): void {
    if (event.key == 'Enter') {
      this.onClick();
    }
  }

  @Output() clickEmitter = new EventEmitter();

  onClick(): void {
    this.clickEmitter.emit();
  }
}
