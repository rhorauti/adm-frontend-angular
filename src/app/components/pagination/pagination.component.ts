import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, MatIconModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  public version = 'v1';
  @Input() currentPage = 1;
  @Input() lastPage = 1;
  @Output() currentPageEmitter = new EventEmitter<number>();

  goBackPage(): void {
    if (this.currentPage <= 1) {
      return;
    } else {
      this.currentPage -= 1;
    }
    this.currentPageEmitter.emit(this.currentPage);
  }

  goForwardPage(): void {
    if (this.currentPage >= this.lastPage) {
      return;
    } else {
      this.currentPage += 1;
    }
    this.currentPageEmitter.emit(this.currentPage);
  }
}
