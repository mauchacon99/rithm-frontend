import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ConnectedStationsModalComponent } from './connected-stations-modal.component';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService } from 'src/mocks/mock-error-service';
import { DocumentService } from 'src/app/core/document.service';
import { MockDocumentService } from 'src/mocks/mock-document-service';
import { throwError } from 'rxjs';

const DATA_TEST = {
  documentRithmId: 'E204F369-386F-4E41',
  stationRithmId: 'E204F369-386F-4E41',
};

describe('ConnectedStationsModalComponent', () => {
  let component: ConnectedStationsModalComponent;
  let fixture: ComponentFixture<ConnectedStationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectedStationsModalComponent],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: DATA_TEST },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedStationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.documentRithmId = DATA_TEST.documentRithmId;
    component.stationRithmId = DATA_TEST.stationRithmId;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should must call the method that returns the previous and next stations.', () => {
    const spyStations = spyOn(
      TestBed.inject(DocumentService),
      'getConnectedStationInfo'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyStations).toHaveBeenCalledOnceWith(
      component.documentRithmId,
      component.stationRithmId
    );
  });

  it('should show error message when request for next and previous stations fails.', () => {
    spyOn(
      TestBed.inject(DocumentService),
      'getConnectedStationInfo'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });
});
