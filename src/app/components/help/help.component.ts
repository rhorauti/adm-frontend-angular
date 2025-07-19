import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Icon } from '@core/types/icon.type';
import { ValidationType } from '@core/types/validation.type';

@Component({
  selector: 'app-help',
  imports: [CommonModule, MatIconModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss',
})
export class HelpComponent implements OnChanges {
  @Input({ required: true }) text!: string;
  @Input() type: ValidationType = 'initial';
  @Input() isHelpTextActive = false;
  icon: Icon = '';
  textColor = '';

  ngOnChanges() {
    switch (this.type) {
      case 'success': {
        this.icon = 'check';
        this.textColor = 'text-green-500';
        this.isHelpTextActive = true;
        break;
      }
      case 'failure': {
        this.icon = 'cancel';
        this.textColor = 'text-red-400';
        this.isHelpTextActive = true;
        break;
      }
    }
  }
}
