import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './input-login.component.html',
  styleUrl: './input-login.component.scss',
})
export class InputLoginComponent {
  @Input() showIconRight = true;
  @Input() iconLeft = 'lock';
  @Input() placeholder = '******';
  @Input() borderColor = 'ring-logo-blue-hover';
  @Input() isEmail = false;
  @Output() emitInputValue = new EventEmitter<string>();

  public inputValue = '';
  public showPassword = false;

  sendInputValue(inputData: Event): void {
    this.inputValue = (inputData.target as HTMLInputElement).value.trim();
    this.emitInputValue.emit(this.inputValue);
  }
}
