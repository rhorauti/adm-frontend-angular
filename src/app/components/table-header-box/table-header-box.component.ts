import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '@components/button/button.component';
import { ITableHeader } from '@core/interfaces/ITableHeader';

@Component({
  selector: 'app-table-header-box',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './table-header-box.component.html',
  styleUrl: './table-header-box.component.scss',
})
export class TableHeaderBoxComponent {
  public isHeaderBoxActive = false;

  /**
   * showTableHeader
   * Mostra ou esconde a coluna da tabela selecionada e atualiza o select do filtro.
   * @param header ICompanyTableHeaders
   */
  showTableHeader(header: ITableHeader): void {
    header.showHeader = !header.showHeader;
  }

  @Input() tableHeaders: ITableHeader[] = [];

  @Output() isTableHeaderActiveEmitter = new EventEmitter();

  sendTableHeaderActiveInfo(): void {
    this.isTableHeaderActiveEmitter.emit(this.tableHeaders);
  }
}
