import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { ModalStore } from '@store/modal/modal.store';

@Component({
  selector: 'app-photo-box-list',
  imports: [MatIconModule, CommonModule, ButtonCloseComponent],
  templateUrl: './photo-box-list.component.html',
  styleUrl: './photo-box-list.component.scss',
})
export class PhotoBoxListComponent implements OnDestroy {
  readonly modalStore = inject(ModalStore);
  @Input() divClass = 'w-12';
  @Input() imgPreviewUrlList: string[] | null = null;
  fileList: File[] = [];

  @Output() fileListEmitter = new EventEmitter<File[]>();

  uploadFiles = (event: Event): void => {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length == 0) {
      return;
    }
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        return this.modalStore.onShowInfoModal(
          'Upload de arquivos',
          'O arquivo selecionado não é uma imagem.'
        );
      } else {
        this.fileList.push(file);
        const fileUrl = URL.createObjectURL(file);
        this.imgPreviewUrlList?.push(fileUrl);
        this.fileListEmitter.emit(this.fileList);
      }
    });
  };

  clearPhoto = (index: number): void => {
    this.fileList?.splice(index, 1);
    if (this.imgPreviewUrlList != null) {
      this.imgPreviewUrlList.splice(index, 1);
    }
    this.fileListEmitter.emit(this.fileList);
  };

  ngOnDestroy(): void {
    if (this.imgPreviewUrlList) {
      this.imgPreviewUrlList.forEach(imgUrl => {
        URL.revokeObjectURL(imgUrl);
      });
    }
  }
}
