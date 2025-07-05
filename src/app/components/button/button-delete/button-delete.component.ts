import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button-delete',
  imports: [CommonModule, MatIconModule],
  templateUrl: './button-delete.component.html',
  styleUrl: './button-delete.component.scss',
})
export class ButtonDeleteComponent {
  @Input() isDisabled = false;

  onClick(event: MouseEvent): void {
    if (this.isDisabled) {
      event.stopPropagation();
      return;
    }
  }

  @Output() keyboardEmitter = new EventEmitter();

  onKeydown(event: KeyboardEvent): void {
    this.keyboardEmitter.emit(event);
  }
}
