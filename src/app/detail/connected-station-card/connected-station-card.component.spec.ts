import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedStationCardComponent } from './connected-station-card.component';

describe('StationCardComponent', () => {
  let component: ConnectedStationCardComponent;
  let fixture: ComponentFixture<ConnectedStationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectedStationCardComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedStationCardComponent);
    component = fixture.componentInstance;
    component.station = {
      name: 'New Station',
      rithmId: '123-896-876'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
