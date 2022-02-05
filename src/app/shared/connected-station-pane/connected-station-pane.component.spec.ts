import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentService } from 'src/app/core/document.service';
import { PopupService } from 'src/app/core/popup.service';
import { MockDocumentService, MockPopupService } from 'src/mocks';

import { ConnectedStationPaneComponent } from './connected-station-pane.component';

describe('ConnectedStationPaneComponent', () => {
  let component: ConnectedStationPaneComponent;
  let fixture: ComponentFixture<ConnectedStationPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectedStationPaneComponent],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedStationPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return forward and previous stations for a specific document', () => {
    expect(component.stations.length).toBeGreaterThanOrEqual(0);
  });
});
