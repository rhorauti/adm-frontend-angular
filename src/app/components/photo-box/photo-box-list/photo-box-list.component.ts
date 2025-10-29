import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { IPhoto } from '@core/interfaces/photo.interface';
import { ModalStore } from '@store/modal/modal.store';
import { ModalBaseComponent } from '@components/modal/modal-base/modal-base.component';

@Component({
  selector: 'app-photo-box-list',
  imports: [MatIconModule, CommonModule, ButtonCloseComponent, ModalBaseComponent],
  templateUrl: './photo-box-list.component.html',
  styleUrl: './photo-box-list.component.scss',
})
export class PhotoBoxListComponent implements OnDestroy {
  readonly modalStore = inject(ModalStore);
  @Input() divClass = 'w-12';
  @Input() imgPreviewList: IPhoto[] = [];
  @Input() isDisabled = false;
  isModalActive = false;
  modalImgSrc = '';

  @Output() fileListChangeEmitter = new EventEmitter<IPhoto[]>();

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
        const photo: IPhoto = { idPhoto: null, previewUrl: '', file: file };
        photo.previewUrl = URL.createObjectURL(photo.file as File);
        this.imgPreviewList.push(photo);
        this.fileListChangeEmitter.emit(this.imgPreviewList);
      }
    });
  };

  handleImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = '../../../../assets/images/sem-imagem.jpg';
  }

  onShowModal(img: IPhoto): void {
    this.modalImgSrc = img.previewUrl as string;
    this.isModalActive = true;
  }

  clearPhoto = (photo: IPhoto, event: MouseEvent): void => {
    event.stopPropagation();
    if (!this.imgPreviewList) return;
    const index = this.imgPreviewList?.findIndex(img => img.idPhoto == photo.idPhoto);
    if (index == -1) return;
    this.imgPreviewList.splice(index, 1);
    this.fileListChangeEmitter.emit([...this.imgPreviewList]);
  };

  ngOnDestroy(): void {
    if (this.imgPreviewList) {
      this.imgPreviewList.forEach(img => {
        URL.revokeObjectURL(img.previewUrl as string);
      });
    }
  }
}
