import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonCloseComponent } from '../button/button-close/button-close.component';
import { ButtonLabelComponent } from '../button/button-label/button-label.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, ButtonCloseComponent, ButtonLabelComponent, MatIconModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class TableHeaderBoxComponent implements OnInit {
  @Input() isSideBarActive = false;
  @Input() title = 'Title';
  @Input() btnLabel = 'Salvar';
  @Input() titleIconName = '';
  @Input() isTwoThirdWidth = true;
  @Input() isFooterActive = true;
  @Input() isPrimaryBtnDisabled = false;
  isTransitionEnabled = false;

  @Output() isCloseBtnClickEmitter = new EventEmitter<boolean>();

  ngOnInit(): void {
    setTimeout(() => {
      this.isTransitionEnabled = true;
    }, 0);
  }

  onCloseBtnClick(): void {
    this.isCloseBtnClickEmitter.emit(false);
  }

  @Output() primaryBtnClickEmitter = new EventEmitter();

  onPrimaryBtnClick(): void {
    this.primaryBtnClickEmitter.emit();
  }
}
