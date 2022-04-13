import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDrawerComponent } from './image-drawer.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

describe('ImageDrawerComponent', () => {
  let component: ImageDrawerComponent;
  let fixture: ComponentFixture<ImageDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageDrawerComponent],
      imports: [MatSlideToggleModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
