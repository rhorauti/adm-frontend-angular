import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ButtonIconComponent } from '@components/button/button-icon/button-icon.component';

interface Item {
  name: string;
  isChecked: boolean;
}

@Component({
  selector: 'app-list-box',
  imports: [FormsModule, MatIconModule, ButtonIconComponent],
  templateUrl: './list-box.component.html',
  styleUrl: './list-box.component.scss',
})
export class ListBoxComponent implements OnChanges {
  @Input() dataList: string[] = [];
  @Input() selectedDataList: string[] = [];
  leftItemsList: Item[] = [];
  rightItemsList: Item[] = [];

  ngOnChanges(): void {
    const leftDistinctItems = this.dataList.filter(
      data => !this.selectedDataList.some(selectedData => selectedData == data)
    );
    if (this.leftItemsList) {
      this.leftItemsList = leftDistinctItems.map(item => {
        return { name: item, isChecked: false };
      });
    }
    if (this.rightItemsList) {
      this.rightItemsList = this.selectedDataList.map(item => ({ name: item, isChecked: false }));
    }
    this.onSortItems(this.leftItemsList);
    this.onSortItems(this.rightItemsList);
  }

  onSortItems = (itemsList: Item[]): void => {
    itemsList.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
  };

  @Output() dataListEmitter = new EventEmitter<string[]>();

  onAddItems(): void {
    const itemsToAdd = this.leftItemsList.filter(item => item.isChecked);
    this.rightItemsList = [...this.rightItemsList, ...itemsToAdd];
    this.leftItemsList = this.leftItemsList.filter(item => !item.isChecked);
    this.rightItemsList.forEach(item => (item.isChecked = false));
    this.onSortItems(this.leftItemsList);
    this.onSortItems(this.rightItemsList);

    this.dataListEmitter.emit(this.rightItemsList.map(item => item.name));
  }

  onRemoveItems(): void {
    const itemsToRemove = this.rightItemsList.filter(item => item.isChecked);
    this.leftItemsList = [...this.leftItemsList, ...itemsToRemove];
    this.rightItemsList = this.rightItemsList.filter(item => !item.isChecked);
    this.leftItemsList.forEach(item => (item.isChecked = false));

    this.onSortItems(this.leftItemsList);
    this.onSortItems(this.rightItemsList);

    this.dataListEmitter.emit(this.rightItemsList.map(item => item.name));
  }
}
