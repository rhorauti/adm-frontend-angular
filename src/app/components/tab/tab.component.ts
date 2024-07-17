import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
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
  @Input() divClass = '';

  ngAfterViewInit(): void {
    this.selectTab(0);
  }

  clearSelectedTab(index: number) {
    const parentElement = this.document.getElementById(this.arrayTabsTitle[index])?.parentElement;
    const buttonTabArray = parentElement?.getElementsByTagName('button');
    if (buttonTabArray) {
      Array.from(buttonTabArray)?.forEach(tab => {
        if (tab.classList.contains('is-active')) {
          tab.classList.remove('is-active');
        }
      });
    }
  }

  @Output() selectedTabEmitter = new EventEmitter<number>();

  selectTab(index: number) {
    this.clearSelectedTab(index);
    const tabActive = this.document.getElementById(this.arrayTabsTitle[index]);
    tabActive?.classList.add('is-active');
    this.selectedTabEmitter.emit(index);
  }
}
