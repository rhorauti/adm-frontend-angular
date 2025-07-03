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
  @Input() title = '';
  @Input() titleIconName = '';
  @Input() isTwoThirdWidth = true;
  @Input() isFooterActive = true;

  @Output() isCloseBtnClickedEmitter = new EventEmitter<boolean>();

  onCloseBtnClicked(): void {
    this.isCloseBtnClickedEmitter.emit(false);
  }
}
