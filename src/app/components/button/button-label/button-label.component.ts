import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Icon } from '@core/types/icon.type';

@Component({
  selector: 'app-button-label',
  imports: [CommonModule, MatIconModule],
  templateUrl: './button-label.component.html',
  styleUrl: './button-label.component.scss',
})
export class ButtonLabelComponent implements OnInit {
  @Input() iconLeftName: Icon = '';
  @Input() iconRightName: Icon = '';
  @Input() labelClass = '';
  @Input() showLeftIcon = true;
  @Input() showRightIcon = false;
  @Input() iconLeftClass = '';
  @Input() iconRightClass = '';
  @Input() tabIndex = 0;
  @Input() label = '';
  @Input() isColorLogo = true;
  @Input() isDisabled = false;
  btnClass = '';
  ngOnInit(): void {
    if (this.isColorLogo) {
      this.btnClass = 'bg-logo hover:bg-logo-hover text-white';
    } else {
      this.btnClass = 'border hover:bg-gray-200 border-gray-400';
    }
  }

  @Output() keyboardEmitter = new EventEmitter();

  onKeydown(event: KeyboardEvent): void {
    this.keyboardEmitter.emit(event);
  }
}
