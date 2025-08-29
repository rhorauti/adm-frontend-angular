import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTypeHomeComponent } from './task-type-home.component';

describe('TaskTypeHomeComponent', () => {
  let component: TaskTypeHomeComponent;
  let fixture: ComponentFixture<TaskTypeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskTypeHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskTypeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
