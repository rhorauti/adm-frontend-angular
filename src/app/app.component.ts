import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuComponent } from '@components/menu/menu.component';
import { ModalAskComponent } from '@components/modal/modal-ask/modal-ask.component';
import { ModalInfoComponent } from '@components/modal/modal-info/modal-info.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { ModalStore } from '@store/modal/modal.store';
import { AuthStore } from '@store/auth/auth.store';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatIconModule,
    RouterOutlet,
    MenuComponent,
    ModalAskComponent,
    ModalInfoComponent,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly router = inject(Router);
  readonly modalStore = inject(ModalStore);
  readonly authStore = inject(AuthStore);
}
