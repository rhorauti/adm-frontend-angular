import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDepartmentComponent } from './table-department.component';

describe('TableDepartmentComponent', () => {
  let component: TableDepartmentComponent;
  let fixture: ComponentFixture<TableDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableDepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
