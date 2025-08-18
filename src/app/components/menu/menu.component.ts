import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TooltipComponent } from '@components/tooltip/tooltip.component';
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
  selector: 'app-menu',
  imports: [CommonModule, MatIconModule, RouterModule, TooltipComponent, ButtonCloseComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
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
          name: 'Empresas',

          routerLink: '/companies',
        },
        {
          idSublink: 1,
          name: 'Produtos',

          routerLink: '/products',
        },
        {
          idSublink: 2,
          name: 'Funcionários',

          routerLink: '/employees',
        },
        {
          idSublink: 3,
          name: 'Departamentos',

          routerLink: '/departments',
        },
        {
          idSublink: 4,
          name: 'Cargos',

          routerLink: '/employee-positions',
        },
      ],
    },
    {
      idLink: 0,
      name: 'Suprimentos',
      isColapsed: false,
      sublinks: [
        {
          idSublink: 0,
          name: 'Estoque',
          routerLink: '/stock',
        },
      ],
    },
    {
      idLink: 1,
      name: 'Produção',
      isColapsed: false,
      sublinks: [
        {
          idSublink: 0,
          name: 'Planejamento',

          routerLink: 'stock',
        },
      ],
    },
    {
      idLink: 1,
      name: 'Manutenção',
      isColapsed: false,
      sublinks: [
        {
          idSublink: 0,
          name: 'Atividades',
          routerLink: '/maintenance/tasks',
        },
        {
          idSublink: 0,
          name: 'Relatório diário',
          routerLink: '/maintenance/daily-report',
        },
        {
          idSublink: 0,
          name: 'Relatório Mensal',
          routerLink: '/maintenance/monthly-report',
        },
      ],
    },
    {
      idLink: 2,
      name: 'Financeiro',
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
