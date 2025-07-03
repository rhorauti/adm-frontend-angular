import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '@core/services/data.service';
import { NavbarComponent } from '@components/menu/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MatIconModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly dataService = inject(DataService);
  readonly router = inject(Router);
  public showNavBar = true;

  constructor() {
    this.dataService.emitEvent.subscribe(data => {
      this.showNavBar = data;
    });
  }

  ngOnInit(): void {
    this.showNavBar = false;
  }
}
