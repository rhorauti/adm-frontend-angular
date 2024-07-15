import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '@components/button/button.component';
import { AuthApi } from '@core/api/http/auth.api';
import { HttpRequestService } from '@core/api/http-request.service';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [CommonModule, ButtonComponent, MatIconModule],
  providers: [AuthApi, HttpRequestService],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.scss',
})
export class RedirectComponent implements OnInit {
  private router = inject(Router);
  private authApi = inject(AuthApi);
  private activatedRoute = inject(ActivatedRoute);

  @Input() iconBackgroundColor = 'bg-green-600';
  @Input() iconTextColor = 'text-white';
  @Input() icon = 'check';
  public message = '';

  async ngOnInit() {
    const token: string | null = this.activatedRoute.snapshot.queryParamMap.get('token');
    try {
      const response = await this.authApi.checkValidToken(token);
      this.message = response.message;
    } catch (e: any) {
      this.message = e.error.message;
      this.icon = 'close';
      this.iconBackgroundColor = 'bg-red-500';
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
