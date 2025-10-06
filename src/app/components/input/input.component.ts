import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
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
  | 'date'
  | 'qty'
  | 'search'
  | 'custom';
type InputType = 'search' | 'text' | 'password' | 'number' | 'date' | 'datetime' | 'datetime-local';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule, MatIconModule, NgxMaskDirective],
  providers: [provideNgxMask(), HostListener],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements OnInit, OnChanges {
  elRef = inject(ElementRef);

  @Input({ required: true }) inputName!: InputName;
  @Input() id?: string;
  @Input() inputValue = '';
  @Input() initialInputList: string[] = [];
  @Input() isDisabled = false;
  @Input() borderType: ValidationType = 'success';
  @Input() inputClass = '';
  @Input() placeholder = '';
  @Input() iconName: Icon = '';
  @Input() type: InputType = 'search';
  @Input() borderClass = '';
  @Input() tabIndex = 0;
  @Input() min = 1;
  maskValue = '';
  showPassword = false;
  showInputBox = false;
  inputListFiltered: string[] = [];
  idx = -1;

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
    this.inputListFiltered = [...this.initialInputList];
  }

  onFilterInputList = (): void => {
    this.inputListFiltered = this.initialInputList
      .filter(value => value.toLowerCase().includes(this.inputValue.toLowerCase()))
      .slice(0, 5);
    this.showInputBox = this.inputValue.length > 0;
  };

  onInputValueChange(event: Event): void {
    this.inputValue = (event.target as HTMLInputElement).value;
    this.onFilterInputList();
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
  }

  onMouseOver = (index: number): void => {
    this.idx = index;
  };

  onSelectOptionThroughKeyboard = (event: KeyboardEvent): void => {
    if (this.inputListFiltered.length > 0) {
      if (event.key == 'ArrowDown') {
        if (this.idx >= this.inputListFiltered.length - 1) {
          this.idx = 0;
        } else {
          this.idx++;
        }
        this.showInputBox = true;
      } else if (event.key == 'ArrowUp') {
        if (this.idx <= 0) {
          this.idx = this.inputListFiltered.length - 1;
        } else {
          this.idx--;
        }
        this.showInputBox = true;
      } else if (event.key == 'Enter' && this.idx > -1) {
        this.inputValue = this.inputListFiltered[this.idx];
        this.showInputBox = false;
      }
    }
  };

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.showInputBox = false;
    }
  }

  onInputBoxItemClick = (event: MouseEvent | KeyboardEvent, index: number): void => {
    event.stopPropagation();
    this.idx = index;
    this.inputValue = this.inputListFiltered[this.idx];
    this.showInputBox = false;
  };

  @Output() keyboardEmitter = new EventEmitter();

  onKeydown(event: KeyboardEvent): void {
    this.onSelectOptionThroughKeyboard(event);
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
