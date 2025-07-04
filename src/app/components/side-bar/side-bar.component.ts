import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonCloseComponent } from '../button/button-close/button-close.component';
import { ButtonLabelComponent } from '../button/button-label/button-label.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, ButtonCloseComponent, ButtonLabelComponent, MatIconModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class TableHeaderBoxComponent {
  @Input() isSideBarActive = false;
  @Input() title = 'Title';
  @Input() btnLabel = 'Salvar';
  @Input() titleIconName = '';
  @Input() isTwoThirdWidth = true;
  @Input() isFooterActive = true;

  @Output() isCloseBtnClickEmitter = new EventEmitter<boolean>();

  onCloseBtnClick(): void {
    this.isCloseBtnClickEmitter.emit(false);
  }

  @Output() primaryBtnClickEmitter = new EventEmitter();

  onPrimaryBtnClick(): void {
    this.primaryBtnClickEmitter.emit();
  }
}
