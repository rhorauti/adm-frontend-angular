import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toogle-button',
  imports: [CommonModule, FormsModule],
  templateUrl: './toogle-button.component.html',
  styleUrl: './toogle-button.component.scss',
})
export class ToogleButtonComponent {
  @Input() isChecked = false;
  @Input({ required: true }) toggleId!: string;
  @Output() isCheckedEmitter = new EventEmitter<boolean>();

  onChecked(checkedEvent: Event): void {
    this.isChecked = (checkedEvent.target as HTMLInputElement).checked;
    this.isCheckedEmitter.emit(this.isChecked);
  }
}
