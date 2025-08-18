import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceTaskHomeComponent } from './maintenance-task-home.component';

describe('MaintenanceTaskHomeComponent', () => {
  let component: MaintenanceTaskHomeComponent;
  let fixture: ComponentFixture<MaintenanceTaskHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceTaskHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceTaskHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
