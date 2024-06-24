import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements OnInit {
  public optionList: string[] = [];
  @Input() selectValue = 'Selecione um item';
  @Input() selectType = '';
  @Output() selectValueEmitter = new EventEmitter<string>();

  ngOnInit(): void {
    switch (this.selectType) {
      case 'estado': {
        this.optionList = [
          'AC',
          'AL',
          'AP',
          'AM',
          'BA',
          'CE',
          'DF',
          'ES',
          'GO',
          'MA',
          'MS',
          'MT',
          'MG',
          'PA',
          'PB',
          'PR',
          'PE',
          'PI',
          'RJ',
          'RN',
          'RS',
          'RO',
          'RR',
          'SC',
          'SP',
          'SE',
          'TO',
        ];
      }
    }
  }

  outputSelectValue(event: Event): void {
    this.selectValue = (event.target as HTMLSelectElement).value;
    this.selectValueEmitter.emit(this.selectValue);
  }

  @Output() clearSelectEmitter = new EventEmitter<boolean>();

  clearSelect(): void {
    this.selectValue = 'Selecione um item';
    this.clearSelectEmitter.emit(true);
  }
}
