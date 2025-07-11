import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tab',
  imports: [CommonModule, MatIconModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class TabComponent {
  @Input() divClass = '';
  selectedTabIdx = 0;
  @Input({ required: true }) tabList!: string[];

  @Output() tabChangeEmitter = new EventEmitter();

  onChangeTabIdx(tabIdx: number): void {
    this.selectedTabIdx = tabIdx;
    this.tabChangeEmitter.emit(tabIdx);
  }
}
