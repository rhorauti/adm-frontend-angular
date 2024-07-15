import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '@components/button/button.component';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule, ButtonComponent, MatIconModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
})
export class TabComponent implements AfterViewInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  public selectValueFilter = '';
  @Input() arrayTabsTitle = ['Tab1', 'Tab2', 'Tab3'];

  ngAfterViewInit(): void {
    this.selectTab(0);
  }

  clearSelectedTab() {
    const buttonTabArray = this.document.querySelectorAll('.tab-component-class button');
    buttonTabArray.forEach(tab => {
      if (tab.classList.contains('is-active')) {
        tab.classList.remove('is-active');
      }
    });
  }

  selectTab(index: number) {
    this.clearSelectedTab();
    const tabActive = this.document.querySelectorAll('.tab-component-class button')[index];
    tabActive.classList.add('is-active');
  }
}
