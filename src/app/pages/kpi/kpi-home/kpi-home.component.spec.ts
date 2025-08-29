import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiHomeComponent } from './kpi-home.component';

describe('KpiHomeComponent', () => {
  let component: KpiHomeComponent;
  let fixture: ComponentFixture<KpiHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
