import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button-close',
  imports: [MatIconModule, CommonModule],
  templateUrl: './button-close.component.html',
  styleUrl: './button-close.component.scss',
})
export class ButtonCloseComponent implements OnInit {
  @Input() iconClass = '';
  @Input() isSmallSize = false;

  @Output() keyboardEmitter = new EventEmitter();

  onKeydown(event: KeyboardEvent): void {
    this.keyboardEmitter.emit(event);
  }

  ngOnInit(): void {
    if (this.isSmallSize) {
      this.iconClass = 'text-[0.55rem]';
    } else {
      this.iconClass = 'text-sm';
    }
  }
}
