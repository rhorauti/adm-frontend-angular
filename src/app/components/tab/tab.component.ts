import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class TabComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  @Input() tabList = ['Tab1', 'Tab2', 'Tab3'];
  @Input() divClass = '';
  selectedTabIdx = 0;

  @Output() selectedTabEmitter = new EventEmitter<number>();

  selectTab(tabSelected: number): void {
    this.selectedTabIdx = tabSelected;
    this.selectedTabEmitter.emit(this.selectedTabIdx);
  }
}
