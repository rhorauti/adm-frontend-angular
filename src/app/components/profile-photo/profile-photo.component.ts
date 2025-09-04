import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';
import { ModalStore } from '@store/modal/modal.store';

@Component({
  selector: 'app-profile-photo',
  imports: [MatIconModule, CommonModule, ButtonCloseComponent],
  templateUrl: './profile-photo.component.html',
  styleUrl: './profile-photo.component.scss',
})
export class ProfilePhotoComponent implements OnDestroy {
  @Input() divClass = 'w-32';
  @Input() imgPreviewUrl: string | null = null;
  @Input() isForm = true;
  readonly modalStore = inject(ModalStore);
  fileUrl: string | null = null;

  @Output() fileUrlEmitter = new EventEmitter<File>();

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
      this.fileUrlEmitter.emit(file);
    }
  };

  clearPhoto = (): void => {
    this.fileUrl = null;
    this.imgPreviewUrl = null;
  };

  ngOnDestroy(): void {
    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl);
    }
  }
}
