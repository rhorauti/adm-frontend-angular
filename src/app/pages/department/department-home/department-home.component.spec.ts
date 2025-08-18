import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentHomeComponent } from '@pages/department/department-list/department-list.component';

describe('DepartmentHomeComponent', () => {
  let component: DepartmentHomeComponent;
  let fixture: ComponentFixture<DepartmentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
