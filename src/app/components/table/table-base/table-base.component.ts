import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-base',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-base.component.html',
  styleUrl: './table-base.component.scss',
})
export class TableBaseComponent {
  @Input() divClass = '';
}
