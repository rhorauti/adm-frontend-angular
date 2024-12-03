import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '@components/button/button.component';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule, ButtonComponent, MatIconModule],
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
