import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitHomeComponent } from './unit-home.component';

describe('UnitHomeComponent', () => {
  let component: UnitHomeComponent;
  let fixture: ComponentFixture<UnitHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
