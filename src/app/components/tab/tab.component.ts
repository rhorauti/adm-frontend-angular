import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TabContract } from '@core/component-contract/tab.contract';

@Component({
  selector: 'app-tab',
  imports: [CommonModule, MatIconModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class TabComponent {
  tabContract = inject(TabContract);
  @Input() divClass = '';
}
