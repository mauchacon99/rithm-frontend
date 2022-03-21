import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerImageWidgetComponent } from './banner-image-widget.component';

describe('BannerImageWidgetComponent', () => {
  let component: BannerImageWidgetComponent;
  let fixture: ComponentFixture<BannerImageWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BannerImageWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerImageWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
