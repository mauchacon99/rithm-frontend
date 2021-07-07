import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationCardComponent } from './station-card.component';

describe('StationCardComponent', () => {
  let component: StationCardComponent;
  let fixture: ComponentFixture<StationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationCardComponent);
    component = fixture.componentInstance;
    component.station = {
      stationName: 'New Station',
      totalDocuments: 5,
      isGenerator: true
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
