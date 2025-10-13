import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { onSetIconStatus, optionTaskStatusList, Status } from 'app/enum/status.enum';
import { MatSelectModule } from '@angular/material/select';
import { ValidationType } from '@core/types/validation.type';

type SelectType = 'state' | 'addressType' | 'status' | 'custom';

@Component({
  selector: 'app-select',
  imports: [CommonModule, MatIconModule, FormsModule, MatSelectModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements OnInit, OnChanges {
  @Input() optionList: string[] = [];
  @Input() selectValue = 'Selecione um item';
  @Input() id = '';
  @Input() borderType: ValidationType = 'success';
  @Input() isDisabled = false;
  @Input() selectType: SelectType = 'custom';
  @Output() selectValueEmitter = new EventEmitter();
  statusIcon = '';
  iconClass = '';
  borderClass = '';

  ngOnInit(): void {
    this.changeStatusInfo(this.selectValue as Status);
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
      case 'status': {
        this.optionList = optionTaskStatusList;
      }
    }
  }

  changeStatusInfo = (value: Status): void => {
    this.statusIcon = onSetIconStatus(value);
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['borderType']) {
      switch (this.borderType) {
        case 'initial': {
          this.borderClass = 'focus-within:border-gray-500 border-gray-500';
          break;
        }
        case 'success': {
          this.borderClass = 'focus-within:border-logo border-logo';
          break;
        }
        case 'failure': {
          this.borderClass = 'focus-within:border-red-400 border-red-400';
          break;
        }
      }
    }
  }

  outputSelectValue(event: Event): void {
    this.selectValue = (event.target as HTMLSelectElement).value;
    if (this.selectType == 'status') {
      this.changeStatusInfo(this.selectValue as Status);
    }
    this.selectValueEmitter.emit(this.selectValue);
  }

  @Output() clearSelectEmitter = new EventEmitter<boolean>();

  clearSelect(): void {
    this.selectValue = 'Selecione um item';
    this.clearSelectEmitter.emit(true);
  }
}
