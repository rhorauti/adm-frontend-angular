import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonStandardComponent } from '../button/button-standard/button-standard.component';
import { InputFormComponent } from '../input/input-form/input-form.component';
import { FormsModule } from '@angular/forms';
import { ICompanyTableHeaders } from '../table/table.component';
import { InputAddonsComponent } from '../input/input-addons/input-addons.component';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    CommonModule,
    ButtonStandardComponent,
    InputFormComponent,
    FormsModule,
    InputAddonsComponent,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent implements OnInit {
  @Input() tableHeadersData: ICompanyTableHeaders[] = [];
  @Output() showModalNewRegisterEmitter = new EventEmitter<boolean>();
  public isHeadersBoxActive = false;
  public optionList: string[] = [];

  ngOnInit(): void {
    this.updateOptionValues();
  }

  /**
   * showNewRegister
   * Emite um evento boleano true para o componente pai para abrir o modal de novo registro.
   */
  showNewRegister(): void {
    this.showModalNewRegisterEmitter.emit(true);
  }

  public inputValue = '';
  @Output() inputValueEmitter = new EventEmitter();
  @Output() isPaginationResetEmitter = new EventEmitter<boolean>();

  /**
   * emitInputValue
   * Envia o valor digitado no input para o componente pai.
   */
  filterValues(): void {
    this.inputValueEmitter.emit(this.inputValue);
    this.selectValueEmitter.emit(this.selectValue);
    // this.isPaginationResetEmitter.emit(true);
  }

  public selectValue = '';
  @Output() selectValueEmitter = new EventEmitter();

  updateOptionValues(): void {
    this.tableHeadersData.forEach(header => {
      if (header.isChecked) {
        this.optionList.push(header.name);
      }
    });
  }

  @Output() tableHeaderDataEmitter = new EventEmitter<ICompanyTableHeaders[]>();

  /**
   * showTableHeader
   * Mostra ou esconde a coluna da tabela selecionada e atualiza o select do filtro.
   * @param header ICompanyTableHeaders
   */
  showTableHeader(header: ICompanyTableHeaders): void {
    this.optionList = [];
    header.isChecked = !header.isChecked;
    this.tableHeaderDataEmitter.emit(this.tableHeadersData);
    this.updateOptionValues();
  }
}
