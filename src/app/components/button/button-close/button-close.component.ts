import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button-close',
  imports: [MatIconModule, CommonModule],
  templateUrl: './button-close.component.html',
  styleUrl: './button-close.component.scss',
})
export class ButtonCloseComponent {
  @Input() iconClass = '';
}
