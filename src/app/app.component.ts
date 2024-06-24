import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/menu/navbar/navbar.component';
import { FilterComponent } from './components/filter/filter.component';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from './core/services/data.service';
// import { WINDOW } from './core/utils/globalWindow';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NavbarComponent,
    FilterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public showNavBar = false;

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {
    this.dataService.dataService.subscribe(data => {
      this.showNavBar = data;
    });
  }

  ngOnInit(): void {
    this.showNavBar = false;
  }
}
