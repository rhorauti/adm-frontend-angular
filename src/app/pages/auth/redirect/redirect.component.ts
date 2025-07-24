import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthApi } from '@core/http/auth/auth.api';
import { ButtonLabelComponent } from '@components/button/button-label/button-label.component';
import { AuthStore } from '@store/auth/auth.store';
import { ModalStore } from '@store/modal/modal.store';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-redirect',
  imports: [CommonModule, MatIconModule, ButtonLabelComponent],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.scss',
})
export class RedirectComponent implements OnInit {
  private authApi = inject(AuthApi);
  private activatedRoute = inject(ActivatedRoute);
  readonly authStore = inject(AuthStore);
  readonly modalStore = inject(ModalStore);

  @Input() iconBackgroundColor = 'bg-green-600';
  @Input() iconTextColor = 'text-white';
  @Input() icon = 'check';
  public description = '';

  async ngOnInit() {
    const token: string | null = this.activatedRoute.snapshot.queryParamMap.get('token');
    try {
      const response = await this.authApi.checkValidToken(token);
      this.description = response.message;
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.description = error.message;
      this.icon = 'close';
      this.iconBackgroundColor = 'bg-red-500';
    }
  }
}
