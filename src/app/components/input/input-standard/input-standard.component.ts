import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-input-standard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './input-standard.component.html',
  styleUrl: './input-standard.component.scss',
})
export class InputStandardComponent implements OnInit, OnChanges {
  @Input() showSearchIcon = true;
  @Input() showRightIcon = true;
  @Input() placeholder = '';
  @Input() inputType = 'text';
  @Input() typeNumberMin = 0;
  @Input() inputClass = '';
  @Input() isEmail = false;
  @Input() isDisabled = false;
  @Input() maskType = '';
  @Input() isClearInputForm = false;
  @Input() propsInput: number | string = '';

  inputValue: number | string = this.propsInput;
  maskValue = '';
  maskPrefix = '';
  showPassword = false;

  @Output() emitInputValue = new EventEmitter<string>();
  @Output() clearInputEmitter = new EventEmitter<boolean>();
  @Output() changeTriggerEmitter = new EventEmitter<string>();

  ngOnInit(): void {
    if (!this.showRightIcon) {
      this.inputClass = 'pr-3';
    }
    switch (this.maskType) {
      case 'phone': {
        this.maskPrefix = '+55 ';
        this.maskValue = '(00) 00000-0000';
        break;
      }
      case 'cnpj': {
        this.maskValue = '000.000.000-00||00.000.000/0000-00';
        break;
      }
    }
  }

  isInputLengthNotZero(inputValue: unknown): boolean {
    return (inputValue as string).length > 0;
  }

  ngOnChanges(): void {
    if (this.isClearInputForm) {
      this.inputValue = '';
      this.clearInputEmitter.emit(false);
      console.log('inputValue', this.inputValue);
    } else {
      this.inputValue = this.propsInput;
    }
  }

  clearInput(): void {
    this.inputValue = '';
    this.clearInputEmitter.emit(false);
    this.isClearInputForm = false;
  }

  sendInputValue(inputData: Event): void {
    this.inputValue = (inputData.target as HTMLInputElement).value.trim();
    this.emitInputValue.emit(this.inputValue);
  }

  sendChangeTrigger(change: Event): void {
    this.inputValue = (change.target as HTMLInputElement).value.trim();
    this.changeTriggerEmitter.emit(this.inputValue);
  }
}
