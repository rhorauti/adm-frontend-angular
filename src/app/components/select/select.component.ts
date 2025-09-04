import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BaseType } from '@core/types/base.type';

type SelectType = 'state' | 'addressType' | 'custom';

@Component({
  selector: 'app-select',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements OnInit {
  @Input() optionList: string[] = [];
  @Input() selectValue = 'Selecione um item';
  @Input() selectType: SelectType = 'custom';
  @Output() selectValueEmitter = new EventEmitter<string | number | boolean>();

  ngOnInit(): void {
    switch (this.selectType) {
      case 'state': {
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
        break;
      }
      case 'addressType': {
        this.optionList = [
          'Rua',
          'Avenida',
          'Alameda',
          'Travessa',
          'Praça',
          'Rodovia',
          'Estrada',
          'Vila',
          'Ladeira',
          'Beco',
          'Viaduto',
          'Largo',
          'Passarela',
          'Servidão',
        ];
        break;
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
