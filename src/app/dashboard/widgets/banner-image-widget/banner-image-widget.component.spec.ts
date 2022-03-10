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

  it('should call FileReader when image is type file', () => {
    const spyReaderFile = spyOn(window, 'FileReader').and.callThrough();
    component.image = new File([new Blob()], 'image-test', {
      type: 'image/jpeg',
    });

    expect(spyReaderFile).toHaveBeenCalled();
  });

  it('should return a string when image is type string', () => {
    component.image = 'image-url';
    expect(typeof component['_image']).toEqual('string');
    expect(typeof component.image).toEqual('string');
  });

  it('should return null when image is type undefined or null', () => {
    component.image = null;
    expect(component['_image']).toBeNull();
    expect(component.image).toBeNull();
  });
});
