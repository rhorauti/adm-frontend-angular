import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

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
  selector: 'app-navbar-list',
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './navbar-list.component.html',
  styleUrl: './navbar-list.component.scss',
})
export class NavbarListComponent {
  @ViewChildren('linkItem') linksItem!: QueryList<ElementRef>;
  @ViewChildren('linkIcon') linkIcon!: QueryList<ElementRef>;

  public links: ILink[] = [
    {
      idLink: 0,
      name: 'Cadastros',
      sublinks: [
        {
          idSublink: 0,
          name: 'Clientes',
          isSelected: false,
          routerLink: '/companies',
        },
        {
          idSublink: 1,
          name: 'Fornecedores',
          isSelected: false,
          routerLink: '/companies',
        },
        {
          idSublink: 2,
          name: 'MyCompany',
          isSelected: false,
          routerLink: '/companies',
        },
        {
          idSublink: 3,
          name: 'Produtos',
          isSelected: false,
          routerLink: '/products',
        },
        {
          idSublink: 4,
          name: 'Endereços',
          isSelected: false,
          routerLink: '/addresses',
        },
        { idSublink: 5, name: 'Funcionários', isSelected: false, routerLink: '/employees' },
      ],
    },
    {
      idLink: 1,
      name: 'Suprimentos',
      sublinks: [
        {
          idSublink: 0,
          name: 'Estoque',
          isSelected: false,
          routerLink: 'stock',
        },
      ],
    },
    {
      idLink: 1,
      name: 'Vendas',
      sublinks: [
        {
          idSublink: 0,
          name: 'Estoque',
          isSelected: false,
          routerLink: 'stock',
        },
      ],
    },
    {
      idLink: 1,
      name: 'Financeiro',
      sublinks: [
        {
          idSublink: 0,
          name: 'Estoque',
          isSelected: false,
          routerLink: 'stock',
        },
      ],
    },
    {
      idLink: 2,
      name: 'Relatórios',
      sublinks: [
        {
          idSublink: 0,
          name: 'Clientes',
          isSelected: false,
          routerLink: 'customers',
        },
        {
          idSublink: 1,
          name: 'Fornecedores',
          isSelected: false,
          routerLink: '/suppliers',
        },
        {
          idSublink: 1,
          name: 'Sitio Nakano',
          isSelected: false,
          routerLink: '/sitio-nakano',
        },
      ],
    },
  ];

  @Input() isMenuListMobileActive = false;
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

  clearSubLinkSelection(): void {
    this.links.forEach(link => link.sublinks.forEach(sublink => (sublink.isSelected = false)));
  }

  @Output() closeMenuListEmitter = new EventEmitter<boolean>();

  selectSubLink(sublink: ISublink): void {
    this.clearSubLinkSelection();
    sublink.isSelected = true;
    this.closeMenuListEmitter.emit();
  }
}
