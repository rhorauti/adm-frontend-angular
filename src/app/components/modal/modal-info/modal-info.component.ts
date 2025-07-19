import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('modalInfoButton') modalInfoButton!: ElementRef<HTMLElement>;
  readonly modalStore = inject(ModalStore);
  readonly icon = computed(() => (this.modalStore.info().isActionOk ? 'check' : 'close'));
  readonly iconBackgroundColor = computed(() =>
    this.modalStore.info().isActionOk ? 'bg-green-600' : 'bg-red-500'
  );

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
