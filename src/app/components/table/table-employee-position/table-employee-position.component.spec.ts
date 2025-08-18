import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableEmployeePositionComponent } from './table-employee-position.component';

describe('TableEmployeePositionComponent', () => {
  let component: TableEmployeePositionComponent;
  let fixture: ComponentFixture<TableEmployeePositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableEmployeePositionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableEmployeePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
