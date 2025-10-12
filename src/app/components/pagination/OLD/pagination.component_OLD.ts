// import { CommonModule } from '@angular/common';
// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { MatIconModule } from '@angular/material/icon';
// import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';

// @Component({
//   selector: 'app-pagination',
//   imports: [CommonModule, MatIconModule, ButtonLabelComponent],
//   templateUrl: './pagination.component.html',
//   styleUrl: './pagination.component.scss',
// })
// export class PaginationComponent {
//   public version = 'v1';
//   @Input() pagesArray: string[] | number[] = [];
//   @Input() totalRegister = 1;
//   @Input() currentPage = 1;
//   @Input() qtyPerPage = 10;
//   @Input() breakpointPage = 7;
//   @Input() totalPages = 1;
//   @Output() currentPageEmitter = new EventEmitter<number>();

//   onPageNumberClick(page: string | number): void {
//     if (typeof page == 'number') {
//       const pageNumber = Number(page);
//       this.currentPageEmitter.emit(pageNumber);
//     }
//   }

//   goBackPage(): void {
//     if (this.currentPage <= 1) {
//       return;
//     } else {
//       this.currentPage -= 1;
//     }
//     this.currentPageEmitter.emit(this.currentPage);
//   }

//   goForwardPage(): void {
//     if (this.currentPage >= this.totalPages) {
//       return;
//     } else {
//       this.currentPage += 1;
//     }
//     this.currentPageEmitter.emit(this.currentPage);
//   }
// }
