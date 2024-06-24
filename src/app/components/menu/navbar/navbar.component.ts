import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NavbarListComponent } from '../navbar-list/navbar-list.component';

interface ISublink {
  idSublink: number;
  name: string;
  isSelected: boolean;
  routerLink: string;
}

interface ILink {
  idLink: number;
  name: string;
  sublinks: ISublink[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, NavbarListComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @ViewChildren('linkItem') linksItem!: QueryList<ElementRef>;
  @ViewChildren('linkIcon') linkIcon!: QueryList<ElementRef>;

  @Input() isSideBarActive = true;

  hideSideBar(): void {
    this.isSideBarActive = false;
  }

  showSideBar(): void {
    this.isSideBarActive = true;
  }

  public isMenuListMobileActive = false;
  public isColapsed = false;

  toogleLink(link: ILink): void {
    console.log(link);
    // this.linksItem.get(link.idLink).nativeElement.classList.toggle('is-colapsed');
    // if (
    //   this.linkIcon.get(link.idLink).nativeElement.firstChild.innerHTML == 'keyboard_arrow_down'
    // ) {
    //   this.linkIcon.get(link.idLink).nativeElement.firstChild.innerHTML = 'keyboard_arrow_up';
    // } else if (
    //   this.linkIcon.get(link.idLink).nativeElement.firstChild.innerHTML == 'keyboard_arrow_up'
    // ) {
    //   this.linkIcon.get(link.idLink).nativeElement.firstChild.innerHTML = 'keyboard_arrow_down';
    // }
  }
}
