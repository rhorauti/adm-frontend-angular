import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePositionFormComponent } from './employee-position-form.component';

describe('EmployeePositionFormComponent', () => {
  let component: EmployeePositionFormComponent;
  let fixture: ComponentFixture<EmployeePositionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePositionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePositionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
