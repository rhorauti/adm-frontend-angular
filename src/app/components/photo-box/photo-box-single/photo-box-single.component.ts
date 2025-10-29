import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { ModalStore } from '@store/modal/modal.store';

@Component({
  selector: 'app-photo-box-single',
  imports: [MatIconModule, CommonModule, ButtonCloseComponent],
  templateUrl: './photo-box-single.component.html',
  styleUrl: './photo-box-single.component.scss',
})
export class PhotoBoxSingleComponent implements OnDestroy {
  @Input() divClass = 'w-32';
  @Input() imgPreviewUrl: string | string[] | null = null;
  @Input() isForm = true;
  readonly modalStore = inject(ModalStore);
  fileUrl: string | null = null;

  @Output() fileChangeEmitter = new EventEmitter<File | null>();

  uploadFile = (event: Event): void => {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length == 0) {
      return;
    }
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      this.modalStore.onShowInfoModal(
        'Upload de arquivos',
        'O arquivo selecionado não é uma imagem.'
      );
    } else {
      this.fileUrl = URL.createObjectURL(file);
      this.imgPreviewUrl = this.fileUrl;
      this.fileChangeEmitter.emit(file);
    }
  };

  handleImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = '../../../../assets/images/sem-imagem.jpg';
  }

  clearPhoto = (): void => {
    this.fileUrl = null;
    this.imgPreviewUrl = null;
    this.fileChangeEmitter.emit(null);
  };

  ngOnDestroy(): void {
    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl);
    }
  }
}
