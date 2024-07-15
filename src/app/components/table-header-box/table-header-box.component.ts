import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonComponent } from '@components/button/button.component';
import { ICompanyTableHeader } from '@core/interfaces/ITableHeader';

@Component({
  selector: 'app-table-header-box',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './table-header-box.component.html',
  styleUrl: './table-header-box.component.scss',
})
export class TableHeaderBoxComponent {
  public isHeaderBoxActive = signal(false);

  /**
   * showTableHeader
   * Mostra ou esconde a coluna da tabela selecionada e atualiza o select do filtro.
   * @param header ICompanyTableHeaders
   */
  showTableHeader(header: ICompanyTableHeader): void {
    header.showHeader = !header.showHeader;
  }

  public tableHeaders = signal<ICompanyTableHeader[]>([
    { id: 0, showHeader: true, name: 'Id' },
    { id: 1, showHeader: true, name: 'Data' },
    { id: 2, showHeader: true, name: 'Apelido' },
    { id: 3, showHeader: true, name: 'Nome' },
    { id: 4, showHeader: true, name: 'CNPJ' },
    { id: 5, showHeader: true, name: 'Projetos' },
    { id: 6, showHeader: true, name: 'Funcionários' },
    { id: 7, showHeader: true, name: 'Endereços' },
    { id: 8, showHeader: true, name: 'Ações' },
  ]);
}
