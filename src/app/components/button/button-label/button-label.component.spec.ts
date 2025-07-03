import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonLabelComponent } from './button-label.component';

describe('ButtonLabelComponent', () => {
  let component: ButtonLabelComponent;
  let fixture: ComponentFixture<ButtonLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
