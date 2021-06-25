import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedStationPaneComponent } from './connected-station-pane.component';

describe('ConnectedStationPaneComponent', () => {
  let component: ConnectedStationPaneComponent;
  let fixture: ComponentFixture<ConnectedStationPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectedStationPaneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedStationPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
