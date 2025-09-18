import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoBoxSingleComponent } from './photo-box-single.component';

describe('PhotoBoxSingleComponent', () => {
  let component: PhotoBoxSingleComponent;
  let fixture: ComponentFixture<PhotoBoxSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoBoxSingleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoBoxSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
