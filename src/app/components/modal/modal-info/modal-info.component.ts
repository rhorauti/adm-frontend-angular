import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { ModalStore } from '@store/modal/modal.store';

export type ModalIconType = 'success' | 'failure';

@Component({
  selector: 'app-modal-info',
  imports: [CommonModule, MatIconModule, ModalBaseComponent, ButtonLabelComponent],
  templateUrl: './modal-info.component.html',
  styleUrl: './modal-info.component.scss',
})
export class ModalInfoComponent {
  readonly modalStore = inject(ModalStore);
  readonly icon = computed(() => (this.modalStore.info().type == 'success' ? 'check' : 'close'));
  readonly iconBackgroundColor = computed(() =>
    this.modalStore.info().type == 'success' ? 'bg-green-600' : 'bg-red-500'
  );

  @Input({ required: true }) isModalActive!: boolean;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() showHeader = false;

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
