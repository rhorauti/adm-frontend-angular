import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { AuthStore } from '@store/auth/auth.store';
import { ButtonCloseComponent } from '@components/button/button-close/button-close.component';

interface ISublink {
  idSublink: number;
  name: string;
  routerLink: string;
}

interface ILink {
  idLink: number;
  name: string;
  isColapsed: boolean;
  sublinks: ISublink[];
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatIconModule, RouterModule, TooltipComponent, ButtonCloseComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly authStore = inject(AuthStore);
  public isNavBarActive = false;
  public links: ILink[] = [
    {
      idLink: 0,
      name: 'Cadastros',
      isColapsed: false,
      sublinks: [
        {
          idSublink: 0,
          name: 'Clientes',
          routerLink: '/companies',
        },
        {
          idSublink: 1,
          name: 'Fornecedores',
          routerLink: '/companies',
        },
        {
          idSublink: 2,
          name: 'MyCompany',
          routerLink: '/companies',
        },
        {
          idSublink: 3,
          name: 'Produtos',
          routerLink: '/products',
        },
        {
          idSublink: 4,
          name: 'Endereços',
          routerLink: '/addresses',
        },
        { idSublink: 5, name: 'Funcionários', routerLink: '/employees' },
      ],
    },
    {
      idLink: 1,
      name: 'Produção',
      isColapsed: false,
      sublinks: [
        {
          idSublink: 0,
          name: 'Estoque',

          routerLink: 'stock',
        },
      ],
    },
    {
      idLink: 1,
      name: 'Suprimentos',
      isColapsed: false,
      sublinks: [
        {
          idSublink: 0,
          name: 'Estoque',

          routerLink: 'stock',
        },
      ],
    },
    {
      idLink: 1,
      name: 'Financeiro',
      isColapsed: false,
      sublinks: [
        {
          idSublink: 0,
          name: 'Estoque',

          routerLink: 'stock',
        },
      ],
    },
    {
      idLink: 2,
      name: 'Relatórios',
      isColapsed: false,
      sublinks: [
        {
          idSublink: 0,
          name: 'Clientes',

          routerLink: 'customers',
        },
        {
          idSublink: 1,
          name: 'Fornecedores',

          routerLink: '/suppliers',
        },
        {
          idSublink: 1,
          name: 'Sitio Nakano',

          routerLink: '/sitio-nakano',
        },
      ],
    },
  ];

  toogleLink(idx: number): void {
    this.links[idx].isColapsed = !this.links[idx].isColapsed;
  }

  clearSubLinkSelection(): void {
    this.links.forEach(link => {
      link.isColapsed = false;
    });
  }

  onShowNavBar(isActive: boolean): void {
    this.isNavBarActive = isActive;
  }
}
