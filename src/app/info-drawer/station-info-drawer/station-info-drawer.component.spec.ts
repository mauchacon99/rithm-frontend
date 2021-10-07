import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationInfoDrawerComponent } from './station-info-drawer.component';

describe('StationInfoDrawerComponent', () => {
  let component: StationInfoDrawerComponent;
  let fixture: ComponentFixture<StationInfoDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationInfoDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
