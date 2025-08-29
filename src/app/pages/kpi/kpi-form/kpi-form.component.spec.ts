import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiFormComponent } from './kpi-form.component';

describe('KpiFormComponent', () => {
  let component: KpiFormComponent;
  let fixture: ComponentFixture<KpiFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
