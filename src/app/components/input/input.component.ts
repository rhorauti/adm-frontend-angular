import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputAddonsContract } from '@core/component-contract/input-addons.contract';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Icon } from '@core/types/icon.type';

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
export class InputComponent implements OnInit {
  readonly inputAddonsContract = inject(InputAddonsContract);
  @Input({ required: true }) inputType!: InputName;
  @Input({ required: true }) id!: string;
  @Input() inputValue = '';
  @Input() isDisabled = false;
  @Input() inputClass = '';
  @Input() placeholder = '';
  @Input() iconName: Icon = '';
  @Input() type: InputType = 'search';
  @Input() tabIndex = 0;
  maskValue = '';
  showPassword = false;

  @Output() inputValueEmitter = new EventEmitter<string>();

  ngOnInit(): void {
    switch (this.inputType) {
      case 'custom': {
        this.type = 'text';
        this.tabIndex = -1;
        break;
      }
      case 'email': {
        this.placeholder = 'Digite o e-mail';
        this.placeholder = 'teste@exemplo.com';
        this.iconName = 'email';
        this.tabIndex = -1;
        this.type = 'text';
        break;
      }
      case 'password': {
        this.placeholder = '******';
        this.iconName = 'lock';
        this.tabIndex = -1;
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
        this.placeholder = 'Digite o telefone';
        this.tabIndex = -1;
        this.type = 'text';
        break;
      }
      case 'cnpj': {
        this.maskValue = '000.000.000-00 ||00.000.000/0000-00';
        this.placeholder = 'Digite o CNPJ ou CPF';
        this.tabIndex = -1;
        this.type = 'text';
        break;
      }
      case 'postalCode': {
        this.maskValue = '00000-000';
        this.placeholder = 'Digite o CEP';
        this.tabIndex = -1;
        this.type = 'text';
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
    this.clickEmitter.emit();
  }
}
