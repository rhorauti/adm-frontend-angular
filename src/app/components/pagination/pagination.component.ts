import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { DataService } from '@core/services/data.service';
import { BaseType } from '@core/types/base.type';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, MatIconModule, ButtonLabelComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnChanges {
  readonly dataService = inject(DataService);

  @Input() dataList: BaseType[] = [];

  currentPage = 1;
  qtyPerPage = 10;
  totalPages = 1;
  totalQtyRegister = 1;
  pagesArray: string[] | number[] = [];

  // @Output() currentPageEmitter = new EventEmitter<number>();

  ngOnChanges = (changes: SimpleChanges): void => {
    if (changes['dataList']) {
      this.onSetPaginationToDefault();
    }
  };

  onSetPaginationArray = (): void => {
    if (this.totalPages < 7) {
      this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else if (this.currentPage < 3) {
      this.pagesArray = [
        1,
        2,
        3,
        '...',
        this.totalPages - 2,
        this.totalPages - 1,
        this.totalPages,
      ] as string[];
    } else if (this.currentPage > 3 && this.currentPage < this.totalPages - 2) {
      this.pagesArray = [
        1,
        2,
        '...',
        this.currentPage - 1,
        this.currentPage,
        this.currentPage + 1,
        '...',
        this.totalPages - 1,
        this.totalPages,
      ] as string[];
    } else {
      this.pagesArray = [
        1,
        2,
        3,
        '...',
        this.totalPages - 2,
        this.totalPages - 1,
        this.totalPages,
      ] as string[];
    }
  };

  onSetPaginationToDefault = (): void => {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.dataList.length / this.qtyPerPage);
    this.onSetPaginationArray();
    this.dataService.emitData(this.currentPage);
  };

  onPageNumberClick(page: string | number): void {
    if (typeof page == 'number') {
      const pageNumber = Number(page);
      this.dataService.emitData(pageNumber);
    }
  }

  goBackPage(): void {
    if (this.currentPage <= 1) {
      return;
    } else {
      this.currentPage -= 1;
    }
    this.dataService.emitData(this.currentPage);
  }

  goForwardPage(): void {
    if (this.currentPage >= this.totalPages) {
      return;
    } else {
      this.currentPage += 1;
    }
    this.dataService.emitData(this.currentPage);
  }
}
