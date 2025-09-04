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
      name: 'Suprimentos',
      isColapsed: false,
      sublinks: [
        {
          idSublink: 0,
          name: 'Empresas',

          routerLink: '/companies',
        },
      ],
    },
    {
      idLink: 1,
      name: 'RH',
      isColapsed: false,
      sublinks: [
        {
          idSublink: 0,
          name: 'Departamentos',

          routerLink: '/departments',
        },
        {
          idSublink: 1,
          name: 'Cargos',

          routerLink: '/employee-positions',
        },
        {
          idSublink: 2,
          name: 'Funcionários',

          routerLink: '/employees',
        },
      ],
    },
    {
      idLink: 2,
      name: 'Produção',
      isColapsed: false,
      sublinks: [
        {
          idSublink: 0,
          name: 'Linha de produção',

          routerLink: '/production-lines',
        },
      ],
    },
    {
      idLink: 3,
      name: 'Manutenção',
      isColapsed: false,
      sublinks: [
        {
          idSublink: 0,
          name: 'Tipo de atividade',
          routerLink: '/maintenance/task-types',
        },
        {
          idSublink: 1,
          name: 'Atividades',
          routerLink: '/maintenance/tasks',
        },
        {
          idSublink: 2,
          name: 'Relatório diário',
          routerLink: '/maintenance/daily-reports',
        },
        {
          idSublink: 3,
          name: 'Relatório Mensal',
          routerLink: '/maintenance/monthly-reports',
        },
      ],
    },
    // {
    //   idLink: 4,
    //   name: 'PCP',
    //   isColapsed: false,
    //   sublinks: [
    //     {
    //       idSublink: 0,
    //       name: 'Estoque',

    //       routerLink: '',
    //     },
    //   ],
    // },
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
