import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask()],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.scss',
})
export class InputFormComponent implements OnInit {
  @Input() showSearchIcon = true;
  @Input() showRightIcon = true;
  @Input() placeholder = '';
  @Input() inputType = 'text';
  @Input() typeNumberMin = 0;
  @Input() inputClass = '';
  @Input() isEmail = false;
  @Input() isDisabled = false;
  @Output() emitInputValue = new EventEmitter<string>();

  @Input() inputValue = '';
  @Input() maskType = '';
  public maskValue = '';
  public maskPrefix = '';
  public showPassword = false;
  @Output() clearInputEmitter = new EventEmitter<boolean>();

  ngOnInit(): void {
    if (!this.showRightIcon) {
      this.inputClass = 'pr-3';
    }
    switch (this.maskType) {
      case 'telefone': {
        this.maskPrefix = '+55 ';
        this.maskValue = '(00) 00000-0000';
        break;
      }
      case 'cpf': {
        this.maskValue = '000.000.000-00||00.000.000/0000-00';
        break;
      }
    }
  }

  clearInput(): void {
    this.inputValue = '';
    this.clearInputEmitter.emit(true);
  }

  sendInputValue(inputData: Event): void {
    this.inputValue = (inputData.target as HTMLInputElement).value.trim();
    this.emitInputValue.emit(this.inputValue);
  }
}
