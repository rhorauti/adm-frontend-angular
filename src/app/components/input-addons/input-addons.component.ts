import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputAddonsContract } from '@core/component-contract/input-addons.contract';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Icon } from '@core/types/icon.type';

type InputName = 'phone' | 'cnpj' | 'postalCode' | 'email' | 'password' | 'qty';
type InputType = 'search' | 'text' | 'password' | 'number';
type Mask = 'phone' | 'cnpj' | 'postalCode' | '';

@Component({
  selector: 'app-input-addons',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './input-addons.component.html',
  styleUrl: './input-addons.component.scss',
})
export class InputAddonsComponent implements OnInit {
  readonly inputAddonsContract = inject(InputAddonsContract);
  @Input({ required: true }) inputType!: InputName;
  @Input({ required: true }) id!: string;
  @Input() inputValue = '';
  @Input() isDisabled = false;
  @Input() inputClass = '';
  maskValue = '';
  type: InputType = 'search';
  placeholder = '';
  iconName: Icon = '';
  maskType: Mask = '';
  showPassword = false;

  @Output() inputValueEmitter = new EventEmitter<string>();

  ngOnInit(): void {
    switch (this.inputType) {
      case 'email': {
        this.placeholder = 'Digite o e-mail';
        this.type = 'text';
        break;
      }
      case 'password': {
        this.placeholder = '******';
        this.type = this.showPassword ? 'text' : 'password';
        break;
      }
      case 'phone': {
        this.maskValue = '(00) 0000-0000 ||(00) 00000-0000';
        this.placeholder = 'Digite o telefone';
        this.type = 'text';
        break;
      }
      case 'cnpj': {
        this.maskValue = '000.000.000-00 ||00.000.000/0000-00';
        this.placeholder = 'Digite o CNPJ ou CPF';
        this.type = 'text';
        break;
      }
      case 'postalCode': {
        this.maskValue = '00000-000';
        this.placeholder = 'Digite o CEP';
        this.type = 'text';
        break;
      }
    }
  }

  onInputValue(event: Event): void {
    this.inputValue = (event.target as HTMLInputElement).value;
    this.inputValueEmitter.emit(this.inputValue);
  }

  @Output() clickEmitter = new EventEmitter();

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.clickEmitter.emit();
  }
}
