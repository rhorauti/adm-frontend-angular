import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

type Position = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-tooltip',
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent implements OnInit {
  @Input() description = '';
  @Input() position: Position = 'top';
  @Input() positionClass = '';

  ngOnInit() {
    switch (this.position) {
      case 'top': {
        // this.positionClass = 'left-1/2 -translate-x-1/2 -top-full -mt-3';
        this.positionClass = 'left-1/2 -translate-x-1/2 -top-full -mt-2';
        break;
      }
      case 'bottom': {
        this.positionClass = 'left-1/2 -translate-x-1/2 top-full mt-2';
        break;
      }
      case 'left': {
        this.positionClass = 'right-full mr-2 top-1/2 -translate-y-1/2';
        break;
      }
      case 'right': {
        this.positionClass = 'left-full ml-2 top-1/2 -translate-y-1/2';
        break;
      }
    }
  }
}
