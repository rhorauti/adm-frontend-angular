import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class ModalInfoComponent {
  @Input({ required: true }) isModalActive!: boolean;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() showHeader = false;
  @Input() type: ModalType = 'failure';
  icon = '';
  iconBackgroundColor = '';

  ngOnChanges = (): void => {
    if (this.type == 'success') {
      this.icon = 'check';
      this.iconBackgroundColor = 'bg-green-600';
    } else {
      this.icon = 'close';
      this.iconBackgroundColor = 'bg-red-500';
    }
    console.log('icon', this.icon);
    console.log('iconBackgroundColor', this.iconBackgroundColor);
  };

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
