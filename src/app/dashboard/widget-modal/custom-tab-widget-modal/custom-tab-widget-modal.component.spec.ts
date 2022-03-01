import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTabWidgetModalComponent } from './custom-tab-widget-modal.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
describe('CustomTabWidgetModalComponent', () => {
  let component: CustomTabWidgetModalComponent;
  let fixture: ComponentFixture<CustomTabWidgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomTabWidgetModalComponent],
      imports:[MatButtonToggleModule]
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
});
