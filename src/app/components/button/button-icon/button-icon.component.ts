import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Icon } from '@core/types/icon.type';

@Component({
  selector: 'app-button-icon',
  imports: [CommonModule, MatIconModule],
  templateUrl: './button-icon.component.html',
  styleUrl: './button-icon.component.scss',
})
export class ButtonIconComponent implements OnInit {
  @Input() iconClass = '';
  @Input() iconName: Icon = '';
  @Input() isColorLogo = true;
  @Input() isDisabled = false;

  ngOnInit(): void {
    if (this.isDisabled) {
      this.iconClass = 'text-gray-400 border-gray-400 rounded-md';
    } else {
      if (this.isColorLogo) {
        this.iconClass = 'border-logo hover:bg-logo-hover text-logo cursor-pointer';
      } else {
        this.iconClass = 'border-gray-400 cursor-pointer';
      }
    }
  }

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
