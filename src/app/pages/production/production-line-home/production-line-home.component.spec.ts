import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLineHomeComponent } from './production-line-home.component';

describe('ProductionLineHomeComponent', () => {
  let component: ProductionLineHomeComponent;
  let fixture: ComponentFixture<ProductionLineHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionLineHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionLineHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
