import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input-addons',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './input-addons.component.html',
  styleUrl: './input-addons.component.scss',
})
export class InputAddonsComponent implements OnChanges {
  @Input() optionList: string[] = [];
  @Input() placeholder = '';
  @Input() selectValueFilter = 'Id';
  @Input() btnLabel = 'Buscar';
  @Input() divClass = '';

  public inputValue = '';
  public selectValue = this.selectValueFilter;
  @Output() inputValueEmitter = new EventEmitter<string>();
  @Output() selectValueEmitter = new EventEmitter<string>();

  ngOnChanges(): void {
    this.selectValue = this.selectValueFilter;
  }

  sendInputValue(inputData: Event): void {
    this.inputValue = (inputData.target as HTMLInputElement).value.trim();
    this.inputValueEmitter.emit(this.inputValue);
  }

  outputSelectValue(event: Event): void {
    this.selectValue = (event.target as HTMLSelectElement).value;
    this.selectValueEmitter.emit(this.selectValue);
  }

  @Output() btnClickEmitter = new EventEmitter();

  click(): void {
    this.btnClickEmitter.emit();
  }
}
