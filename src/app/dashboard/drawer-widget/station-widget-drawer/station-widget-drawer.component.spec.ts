import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationWidgetDrawerComponent } from './station-widget-drawer.component';

describe('StationWidgetDrawerComponent', () => {
  let component: StationWidgetDrawerComponent;
  let fixture: ComponentFixture<StationWidgetDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationWidgetDrawerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationWidgetDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
