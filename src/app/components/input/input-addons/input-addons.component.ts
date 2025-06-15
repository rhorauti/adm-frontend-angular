import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ITableHeader } from '@core/interfaces/ITableHeader';

interface ISearchItem {
  img: string;
  item: string;
}

@Component({
    selector: 'app-input-addons',
    imports: [CommonModule, FormsModule, MatIconModule],
    templateUrl: './input-addons.component.html',
    styleUrl: './input-addons.component.scss'
})
export class InputAddonsComponent implements OnChanges {
  @Input() optionList: ITableHeader[] = [];
  // @Input() searchedItems: ISearchItem[] = [
  //   { img: '../../../assets/images/logo.png', item: 'Rafael Horauti blá blá 1' },
  //   { img: '../../../assets/images/logo.png', item: 'Rafael Horauti blá blá 2' },
  //   { img: '../../../assets/images/logo.png', item: 'Rafael Horauti blá blá 3' },
  //   { img: '../../../assets/images/logo.png', item: 'Rafael Horauti blá blá 4' },
  //   { img: '../../../assets/images/logo.png', item: 'Rafael Horauti blá blá 5' },
  // ];
  @Input() placeholder = '';
  @Input() selectValueProps = '';
  @Input() showButton = false;

  public inputValue = '';
  public selectValue = '';
  @Output() inputValueEmitter = new EventEmitter<string>();
  @Output() selectValueEmitter = new EventEmitter<string>();

  ngOnChanges(): void {
    this.selectValue = this.selectValueProps;
  }

  sendInputValue(inputData: Event): void {
    this.inputValue = (inputData.target as HTMLInputElement).value.trim();
    this.inputValueEmitter.emit(this.inputValue);
  }

  outputSelectValue(event: Event): void {
    this.selectValue = (event.target as HTMLSelectElement).value;
    this.selectValueEmitter.emit(this.selectValue);
  }
}
