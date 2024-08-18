import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent implements OnInit {
  @Input() label = 'Entrar';
  @Input() btnClass = '';
  @Input() btnType = 'submit';
  @Input() btnIcon = '';
  @Input() showIcon = false;
  @Input() showLabel = true;
  @Input() isDisabled = false;
  public hoverBackgroundColor = '';

  ngOnInit(): void {
    switch (this.btnType) {
      case 'submit': {
        this.btnClass = 'bg-logo-blue hover:bg-logo-blue-hover';
        break;
      }
      case 'close': {
        this.btnClass = 'bg-black hover:bg-gray-800 md:w-36';
        this.label = 'Fechar';
        break;
      }
      case 'cancel': {
        this.btnClass = 'bg-black text-white hover:bg-gray-700 md:w-36';
        this.showIcon = true;
        this.btnIcon = 'close';
        this.label = 'Fechar';
        break;
      }
      case 'clear': {
        this.btnClass = 'bg-black text-white hover:bg-gray-700 md:w-36';
        this.showIcon = true;
        this.btnIcon = 'update';
        this.label = 'Limpar';
        break;
      }
      case 'forward': {
        this.btnClass = 'bg-green-500 hover:bg-green-400 md:w-36';
        this.showIcon = true;
        this.btnIcon = 'arrow_forward';
        this.label = 'Prosseguir';
        break;
      }
      case 'success-save': {
        this.btnClass = 'bg-green-600 hover:bg-green-500';
        this.showIcon = true;
        this.btnIcon = 'save';
        this.label = 'Adicionar';
        break;
      }
      case 'success-edit': {
        this.btnClass = 'bg-green-600 hover:bg-green-500';
        this.showIcon = true;
        this.btnIcon = 'save';
        this.label = 'Alterar';
        break;
      }
      case 'success-delete': {
        this.btnClass = 'bg-red-400 hover:bg-red-300 text-white';
        this.showIcon = true;
        this.btnIcon = 'save';
        this.label = 'Excluir';
        break;
      }
      case 'transparent': {
        this.btnClass = 'text-white bg-transparent border border-gray-500 hover:bg-gray-800';
        break;
      }
      case 'warning': {
        this.btnClass = 'bg-yellow-400 hover:bg-yellow-300 h-6';
        this.btnIcon = 'edit';
        this.label = '';
        break;
      }
      case 'danger': {
        this.btnClass = 'text-black bg-red-400 border border-gray-500 hover:bg-red-300 h-6';
        this.hoverBackgroundColor = 'hover:bg-red-400';
        this.btnIcon = 'delete_outline';
        this.label = '';
        break;
      }
      default:
        this.btnClass = 'bg-logo-blue hover:bg-logo-blue-hover';
    }
  }
}
