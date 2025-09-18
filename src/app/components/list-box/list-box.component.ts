import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonIconComponent } from '@components/button/button-icon/button-icon.component';

@Component({
  selector: 'app-list-box',
  imports: [FormsModule, MatIconModule, ButtonIconComponent],
  templateUrl: './list-box.component.html',
  styleUrl: './list-box.component.scss',
})
export class ListBoxComponent implements AfterViewInit {
  @ViewChildren('listItems') private listItemsFromLeft!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('listItemsSelected') private listItemsFromRight!: QueryList<
    ElementRef<HTMLElement>
  >;

  @Input() dataList: string[] = [];

  @Input() selectedDataList: string[] = [];
  activeRowClass = 'active-row';

  ngAfterViewInit(): void {
    this.listItemsFromRight.forEach(item => {
      item.nativeElement.style.display = 'none';
    });
  }

  onToggleActiveClass(element: HTMLElement): void {
    if (element.classList.contains(this.activeRowClass)) {
      element.classList.remove(this.activeRowClass);
      element.classList.add('hover-bg-color');
    } else {
      element.classList.add(this.activeRowClass);
      element.classList.remove('hover-bg-color');
    }
  }

  onActivateRow(index: number, event: MouseEvent | KeyboardEvent): void {
    const targetElement = event.target as HTMLElement;
    const isFromDataList = this.listItemsFromLeft.some(item => item.nativeElement == targetElement);
    if (isFromDataList) {
      const selectedElement = this.listItemsFromLeft.get(index)?.nativeElement;
      if (selectedElement) this.onToggleActiveClass(selectedElement);
    } else {
      const selectedElement = this.listItemsFromRight.get(index)?.nativeElement;
      if (selectedElement) this.onToggleActiveClass(selectedElement);
    }
  }

  onDeactivateItems(): void {
    this.listItemsFromLeft.forEach(element => {
      element.nativeElement.classList.remove(this.activeRowClass);
    });
    this.listItemsFromRight.forEach(element => {
      element.nativeElement.classList.remove(this.activeRowClass);
    });
  }

  @Output() dataListEmitter = new EventEmitter<string[]>();

  onSelectItems(): void {
    this.listItemsFromLeft.forEach((element, index) => {
      if (element.nativeElement.classList.contains(this.activeRowClass)) {
        element.nativeElement.style.display = 'none';
        this.listItemsFromRight.forEach((item, idx) => {
          if (idx == index) item.nativeElement.style.display = 'block';
        });
        this.selectedDataList.push(this.dataList[index]);
      }
    });
    this.onDeactivateItems();
    this.dataListEmitter.emit(this.selectedDataList);
    console.log('selectedData', this.selectedDataList);
  }

  onRemoveItems(): void {
    this.listItemsFromRight.forEach((element, index) => {
      if (element.nativeElement.classList.contains(this.activeRowClass)) {
        element.nativeElement.style.display = 'none';
        this.listItemsFromLeft.forEach((item, idx) => {
          if (idx == index) item.nativeElement.style.display = 'block';
        });
        const selectedIdx = this.selectedDataList.findIndex(
          el => el == element.nativeElement.innerHTML.trim()
        );
        this.selectedDataList.splice(selectedIdx, 1);
      }
    });
    this.onDeactivateItems();
    this.dataListEmitter.emit(this.selectedDataList);
    console.log('selectedData', this.selectedDataList);
  }
}
