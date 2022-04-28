import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerWidgetComponent } from './banner-widget.component';

describe('BannerWidgetComponent', () => {
  let component: BannerWidgetComponent;
  let fixture: ComponentFixture<BannerWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BannerWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event openSettingDrawer', () => {
    component.widgetMode = 'setting';
    const spyEmit = spyOn(component.openSettingDrawer, 'emit');
    const image = component.imageWidgetObject;
    component.handleOpenSettingDrawer();
    expect(spyEmit).toHaveBeenCalledWith(image);
  });
});
