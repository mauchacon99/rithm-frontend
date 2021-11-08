import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockStationService } from 'src/mocks';

import { DocumentInfoDrawerComponent } from './document-info-drawer.component';
import { StationService } from '../../core/station.service';

describe('DocumentInfoDrawerComponent', () => {
  let component: DocumentInfoDrawerComponent;
  let fixture: ComponentFixture<DocumentInfoDrawerComponent>;
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentInfoDrawerComponent],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInfoDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the editable status of the document in the station', async () => {
    const newStatus = true;
    const updateGenerationStatusSpy = spyOn(TestBed.inject(StationService), 'updateStatusDocumentEditable').and.callThrough();

    await component.updateStatusDocumentEditable(stationId, newStatus);

    expect(updateGenerationStatusSpy).toHaveBeenCalledOnceWith(stationId, newStatus);
  });

  it('should get the current editable status of the document', async () => {
    const getGenerationStatusSpy = spyOn(TestBed.inject(StationService), 'getStatusDocumentEditable').and.callThrough();

    await component.getStatusDocumentEditable(stationId);

    expect(getGenerationStatusSpy).toHaveBeenCalledOnceWith(stationId);
  });
});
