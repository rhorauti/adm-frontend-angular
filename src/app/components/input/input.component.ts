import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Icon } from '@core/types/icon.type';
import { ValidationType } from '@core/types/validation.type';

type InputName =
  | 'phone'
  | 'cnpj'
  | 'postalCode'
  | 'email'
  | 'password'
  | 'qty'
  | 'search'
  | 'custom';
type InputType = 'search' | 'text' | 'password' | 'number';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule, MatIconModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements OnInit, OnChanges {
  @Input({ required: true }) inputName!: InputName;
  @Input({ required: true }) id!: string;
  @Input() inputValue = '';
  @Input() isDisabled = false;
  @Input() borderType: ValidationType = 'initial';
  @Input() inputClass = '';
  @Input() placeholder = '';
  @Input() iconName: Icon = '';
  @Input() type: InputType = 'search';
  @Input() divClass = '';
  @Input() tabIndex = 0;
  maskValue = '';
  showPassword = false;

  @Output() inputValueEmitter = new EventEmitter<string>();

  ngOnInit(): void {
    switch (this.inputName) {
      case 'email': {
        this.placeholder = 'Digite o e-mail';
        this.placeholder = 'teste@exemplo.com';
        this.iconName = 'email';
        this.type = 'text';
        break;
      }
      case 'password': {
        this.placeholder = '******';
        this.iconName = 'lock';
        this.type = this.showPassword ? 'text' : 'password';
        break;
      }
      case 'search': {
        this.type = 'search';
        this.iconName = 'search';
        break;
      }
      case 'phone': {
        this.maskValue = '(00) 0000-0000 ||(00) 00000-0000';
        this.type = 'search';
        break;
      }
      case 'cnpj': {
        this.maskValue = '000.000.000-00 ||00.000.000/0000-00';
        this.type = 'search';
        break;
      }
      case 'postalCode': {
        this.maskValue = '00000-000';
        this.type = 'search';
        break;
      }
    }
  }

  ngOnChanges(): void {
    switch (this.borderType) {
      case 'initial': {
        this.divClass = 'border-gray-400';
        break;
      }
      case 'success': {
        this.divClass = 'focus-within:border-logo border-logo';
        break;
      }
      case 'failure': {
        this.divClass = 'focus-within:border-red-400 border-red-400';
        break;
      }
    }
  }

  onInputValue(event: Event): void {
    this.inputValue = (event.target as HTMLInputElement).value;
    this.inputValueEmitter.emit(this.inputValue.trim());
  }

  @Output() clickEmitter = new EventEmitter();

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.inputName == 'password') {
      if (this.showPassword) {
        this.iconName = 'lock';
        this.type = 'password';
      } else {
        this.iconName = 'lock_open';
        this.type = 'text';
      }
    }
    this.showPassword = !this.showPassword;
    this.clickEmitter.emit();
    console.log('show password', this.showPassword);
  }

  @Output() keyboardEmitter = new EventEmitter();

  onKeydown(event: KeyboardEvent): void {
    this.keyboardEmitter.emit(event);
  }

  @Output() blurEmitter = new EventEmitter();

  onBlur(): void {
    this.blurEmitter.emit();
  }
}
