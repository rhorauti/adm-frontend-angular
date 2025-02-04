import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent implements OnInit, OnChanges {
  @Input() label = 'Entrar';
  @Input() btnClass = '';
  @Input() btnType = 'submit';
  @Input() btnIcon = '';
  @Input() showIcon = false;
  @Input() showLabel = true;
  @Input() isDisabled = false;
  @Input() isToggled = false;
  public hoverBackgroundColor = '';

  ngOnInit(): void {
    switch (this.btnType) {
      case 'submit': {
        this.btnClass = 'bg-logo-blue hover:bg-logo-blue-hover px-4 py-1.5';
        break;
      }
      case 'close': {
        this.btnClass = 'bg-black hover:bg-gray-800 md:w-36 px-4 py-1.5';
        this.label = 'Fechar';
        break;
      }
      case 'cancel': {
        this.btnClass = 'bg-black text-white hover:bg-gray-700 md:w-36 px-4 py-1.5';
        this.showIcon = true;
        this.btnIcon = 'close';
        this.label = 'Fechar';
        break;
      }
      case 'clear': {
        this.btnClass = 'bg-black text-white hover:bg-gray-700 md:w-36 px-4 py-1.5';
        this.showIcon = true;
        this.btnIcon = 'update';
        this.label = 'Limpar';
        break;
      }
      case 'forward': {
        this.btnClass = 'bg-green-500 hover:bg-green-400 md:w-36 px-4 py-1.5';
        this.showIcon = true;
        this.btnIcon = 'arrow_forward';
        this.label = 'Prosseguir';
        break;
      }
      case 'success-save': {
        this.btnClass = 'bg-green-600 hover:bg-green-500 text-white md:w-36 px-4 py-1.5';
        this.showIcon = true;
        this.btnIcon = 'save';
        this.label = 'Adicionar';
        break;
      }
      case 'success-edit': {
        this.btnClass = 'bg-green-600 hover:bg-green-500 text-white md:w-36 px-4 py-1.5';
        this.showIcon = true;
        this.btnIcon = 'save';
        this.label = 'Alterar';
        break;
      }
      case 'success-delete': {
        this.btnClass = 'bg-red-400 hover:bg-red-300 text-white md:w-36 px-4 py-1.5';
        this.showIcon = true;
        this.btnIcon = 'save';
        this.label = 'Excluir';
        break;
      }
      case 'transparent': {
        this.btnClass =
          'text-white bg-transparent border border-gray-500 hover:bg-gray-800 px-4 py-1.5';
        break;
      }
      case 'icon-edit': {
        this.btnClass = 'bg-yellow-400 hover:bg-yellow-300 h-full px-1';
        this.btnIcon = 'edit';
        this.label = '';
        break;
      }
      case 'icon-delete': {
        this.btnClass = 'text-black bg-red-400 border border-gray-500 hover:bg-red-300 h-full px-1';
        this.hoverBackgroundColor = 'hover:bg-red-400';
        this.btnIcon = 'delete_outline';
        this.label = '';
        break;
      }
      case 'icon-arrow-down': {
        this.btnClass = 'text-black bg-white border border-gray-500 hover:bg-gray-200 px-1';
        this.btnIcon = 'arrow_downward';
        break;
      }
      case 'icon-arrow-up': {
        this.btnClass = 'text-black bg-white border border-gray-500 hover:bg-gray-200 px-1';
        this.btnIcon = 'arrow_upward';
        break;
      }
      default:
        this.btnClass = 'bg-logo-blue hover:bg-logo-blue-hover';
    }
  }

  ngOnChanges(): void {
    if (this.btnType.startsWith('icon-arrow')) {
      this.btnIcon = this.isToggled ? 'arrow_upward' : 'arrow_downward';
    } else {
      if (this.btnType == 'icon-edit') {
        this.btnIcon = 'edit';
      } else {
        this.btnIcon = 'delete_outline';
      }
    }
  }
}
