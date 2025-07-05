import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button-close',
  imports: [MatIconModule, CommonModule],
  templateUrl: './button-close.component.html',
  styleUrl: './button-close.component.scss',
})
export class ButtonCloseComponent {
  @Input() iconClass = '';

  @Output() keyboardEmitter = new EventEmitter();

  onKeydown(event: KeyboardEvent): void {
    this.keyboardEmitter.emit(event);
  }
}
