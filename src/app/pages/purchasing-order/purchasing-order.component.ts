import { Component } from '@angular/core';
import { TableCompanyComponent } from '@components/table/table-company/table-company.component';
import { CommonModule } from '@angular/common';
import { ModalBaseComponent } from '../../components/modal/modal-base/modal-base.component';

@Component({
  selector: 'app-purchasing-order',
  standalone: true,
  imports: [TableCompanyComponent, CommonModule, ModalBaseComponent],
  templateUrl: './purchasing-order.component.html',
  styleUrl: './purchasing-order.component.scss',
})
export class PurchasingOrderComponent {
  showModalCompany = false;
}
