import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTabWidgetModalComponent } from './custom-tab-widget-modal.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('CustomTabWidgetModalComponent', () => {
  let component: CustomTabWidgetModalComponent;
  let fixture: ComponentFixture<CustomTabWidgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomTabWidgetModalComponent],
      imports: [MatButtonToggleModule, MatTabsModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTabWidgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should selected index tabs', () => {
    const indexTab = 1;
    const spyTabs = spyOn(component, 'selectedTab').and.callThrough();
    const btnTab = fixture.nativeElement.querySelector('#tab-button-station');
    expect(btnTab).toBeTruthy();
    btnTab.click();
    expect(spyTabs).toHaveBeenCalledOnceWith(indexTab);
    expect(component.indexTab).toBe(indexTab);
  });
});
