import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoBoxListComponent } from './photo-box-list.component';

describe('PhotoBoxListComponent', () => {
  let component: PhotoBoxListComponent;
  let fixture: ComponentFixture<PhotoBoxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoBoxListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoBoxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
