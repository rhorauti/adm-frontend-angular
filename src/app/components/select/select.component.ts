import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

type SelectType = 'state' | 'addressType' | 'status' | 'custom';
type Status = 'Não iniciado' | 'Em andamento' | 'Pausado' | 'Finalizado';

@Component({
  selector: 'app-select',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements OnInit, OnChanges {
  @Input() optionList: string[] = [];
  @Input() selectValue = 'Selecione um item';
  @Input() id = '';
  @Input() isDisabled = false;
  @Input() selectType: SelectType = 'custom';
  @Output() selectValueEmitter = new EventEmitter();
  statusIcon = '';
  iconClass = '';

  ngOnInit(): void {
    this.changeStatusIcon();
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

  changeStatusIcon = (): void => {
    if (this.selectType == 'status') {
      switch (this.selectValue as Status) {
        case 'Não iniciado': {
          this.statusIcon = 'stop';
          this.iconClass = 'text-gray-400';
          break;
        }
        case 'Em andamento': {
          this.statusIcon = 'play_circle_filled';
          this.iconClass = 'text-yellow-400';
          break;
        }
        case 'Pausado': {
          this.statusIcon = 'pause_circle_filled';
          this.iconClass = 'text-blue-400';
          break;
        }
        case 'Finalizado': {
          this.statusIcon = 'check_circle';
          this.iconClass = 'text-green-400';
          break;
        }
      }
    }
  };

  ngOnChanges(): void {
    this.changeStatusIcon();
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
