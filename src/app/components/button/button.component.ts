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
  @Input() label = '';
  @Input() btnClass = '';
  @Input() btnType = 'submit';
  @Input() btnIcon = '';
  @Input() showIcon = false;
  @Input() showLabel = true;
  @Input() isDisabled = false;
  @Input() isToggled = false;

  ngOnInit(): void {
    switch (this.btnType) {
      case 'submit': {
        this.btnClass = 'bg-logo-blue hover:bg-logo-blue-hover px-4 py-1.5 text-white';
        break;
      }
      case 'close': {
        this.btnClass = 'bg-black text-white hover:bg-gray-700 md:w-36 px-4 py-1.5';
        this.label = 'Fechar';
        break;
      }
      case 'success-save': {
        this.btnClass = 'bg-green-600 hover:bg-green-500 text-white md:w-36 px-4 py-1.5';
        this.showIcon = true;
        this.btnIcon = 'save';
        this.label = 'Salvar';
        break;
      }
      case 'success-delete': {
        this.btnClass = 'bg-red-400 hover:bg-red-300 text-white md:w-36 px-4 py-1.5';
        this.showIcon = true;
        this.btnIcon = 'save';
        this.label = 'Excluir';
        break;
      }
      case 'icon-send': {
        this.showIcon = true;
        this.btnClass =
          'bg-logo-blue hover:bg-logo-blue-hover text-white border border-gray-500 py-1.5 px-1';
        this.btnIcon = 'send';
        this.label = '';
        break;
      }
      case 'icon-search': {
        this.showIcon = true;
        this.btnClass =
          'bg-logo-blue hover:bg-logo-blue-hover text-white border border-gray-500 py-1.5 px-1';
        this.btnIcon = 'search';
        this.label = '';
        break;
      }
      case 'icon-add': {
        this.showIcon = true;
        this.btnClass =
          'bg-logo-blue hover:bg-logo-blue-hover text-white border border-gray-500 py-1.5 px-1';
        this.btnIcon = 'add';
        this.label = '';
        break;
      }
      case 'icon-menu': {
        this.showIcon = true;
        this.btnClass =
          'bg-transparent hover:bg-gray-800 hover:text-white border border-gray-500 py-1.5 px-1';
        this.btnIcon = 'menu';
        this.label = '';
        break;
      }
      case 'icon-edit': {
        this.showIcon = true;
        this.btnClass = 'bg-yellow-400 hover:bg-yellow-300 border border-gray-500 py-1.5 px-1';
        this.btnIcon = 'edit';
        this.label = '';
        break;
      }
      case 'icon-delete': {
        this.showIcon = true;
        this.btnClass = 'text-black bg-red-400 border border-gray-500 hover:bg-red-300 py-1.5 px-1';
        this.btnIcon = 'delete_outline';
        this.label = '';
        break;
      }
      case 'icon-details': {
        this.showIcon = true;
        this.btnClass =
          'bg-logo-blue hover:bg-logo-blue-hover text-white border border-gray-500 py-1.5 px-1';
        this.btnIcon = 'insert_drive_file';
        this.label = '';
        break;
      }
      default:
        this.btnClass = 'bg-logo-blue hover:bg-logo-blue-hover';
    }
  }
}
