import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input-validation',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './input-validation.component.html',
  styleUrl: './input-validation.component.scss',
})
export class InputValidationComponent implements OnChanges {
  @Input() inputValue = '';
  @Input() icon = 'close';
  @Input() validationText = 'Email inválido!';
  @Input() validationType = 'caracteres';
  @Input() validationLettersQty = 6;
  @Input() textColor = 'text-red-400';
  @Input() inputValueToCompare = '';
  @Output() emitValidationResult = new EventEmitter<boolean>();
  public showValidationText = false;

  ngOnChanges() {
    if (this.inputValue.length == 0) {
      this.showValidationText = false;
    } else if (this.inputValue.length > 0) {
      this.textColor = 'text-red-400';
      this.icon = 'close';
      this.showValidationText = true;
      if (
        (this.validationType == 'letters' &&
          this.inputValue.length >= this.validationLettersQty) ||
        (this.validationType == 'email' &&
          /\.com/gi.test(this.inputValue) &&
          /@/gi.test(this.inputValue)) ||
        (this.validationType == 'passwordUppercase' &&
          /[A-Z]/g.test(this.inputValue)) ||
        (this.validationType == 'passwordSymbol' &&
          /[^0-9A-Za-z]/g.test(this.inputValue)) ||
        (this.validationType == 'passwordNumber' &&
          /[0-9]/g.test(this.inputValue)) ||
        (this.validationType == 'passwordConfirmation' &&
          this.inputValue == this.inputValueToCompare)
      ) {
        this.textColor = 'text-green-400';
        this.icon = 'check_circle_outline';
        this.emitValidationResult?.emit(true);
      } else {
        this.emitValidationResult?.emit(false);
      }
    }
  }
}
