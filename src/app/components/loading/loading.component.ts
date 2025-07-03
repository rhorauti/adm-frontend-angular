import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoadingContract } from '@core/component-contract/loading.contract';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  readonly loadingContract = inject(LoadingContract);
}
