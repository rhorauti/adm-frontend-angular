import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTypeHomeComponent } from './product-type-home.component';

describe('ProductTypeHomeComponent', () => {
  let component: ProductTypeHomeComponent;
  let fixture: ComponentFixture<ProductTypeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTypeHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTypeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
