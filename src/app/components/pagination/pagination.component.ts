import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnChanges {
  public currentPage = 1;
  @Input() lastPage = 0;
  @Input() inputValueFilter: number | string = 0;
  @Input() tableUpdated = false;

  @Output() currentPageEmitter = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['inputValueFilter']?.currentValue != changes['inputValueFilter']?.previousValue ||
      changes['tableUpdated']?.currentValue != changes['tableUpdated']?.previousValue
    ) {
      this.currentPage = 1;
    }
  }

  goBackPage(): void {
    if (this.currentPage <= 1) {
      this.currentPage = 1;
    } else {
      this.currentPage -= 1;
    }
    this.currentPageEmitter.emit(this.currentPage);
  }

  goForwardPage(): void {
    if (this.currentPage >= this.lastPage) {
      this.currentPage = this.lastPage;
    } else {
      this.currentPage += 1;
    }
    this.currentPageEmitter.emit(this.currentPage);
  }
}
