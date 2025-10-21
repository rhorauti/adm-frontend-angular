import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidationType } from '@core/types/validation.type';

@Component({
  selector: 'app-text-area',
  imports: [FormsModule, CommonModule],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss',
})
export class TextAreaComponent implements OnChanges {
  @Input() id?: string;
  @Input() name = 'default';
  @Input() inputValue = '';
  @Input() borderType: ValidationType = 'success';
  @Input() isDisabled = false;
  @Input() placeholder = '';
  borderClass = '';
  uniqueId = crypto.randomUUID();

  ngOnChanges(): void {
    switch (this.borderType) {
      case 'initial': {
        this.borderClass = 'focus-within:border-gray-500 border-gray-500';
        break;
      }
      case 'success': {
        this.borderClass = 'focus-within:border-logo border-logo';
        break;
      }
      case 'failure': {
        this.borderClass = 'focus-within:border-red-400 border-red-400';
        break;
      }
    }
  }

  @Output() inputValueEmitter = new EventEmitter();

  onInputValue(event: Event): void {
    this.inputValue = (event.target as HTMLInputElement).value;
    this.inputValueEmitter.emit(this.inputValue.trim());
  }

  @Output() clickEmitter = new EventEmitter();

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.clickEmitter.emit(event);
  }

  @Output() keyboardEmitter = new EventEmitter();

  onKeydown(event: KeyboardEvent): void {
    this.keyboardEmitter.emit(event);
  }

  @Output() blurEmitter = new EventEmitter();

  onBlur(event: Event): void {
    this.blurEmitter.emit(event);
  }
  @Output() focusEmitter = new EventEmitter();

  onFocus(event: Event): void {
    this.focusEmitter.emit(event);
  }

  @Output() changeEmitter = new EventEmitter();

  onChange(event: Event): void {
    this.changeEmitter.emit(event);
  }
}
