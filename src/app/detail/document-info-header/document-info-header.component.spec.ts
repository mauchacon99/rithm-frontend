import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentInfoHeaderComponent } from './document-info-header.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { DocumentService } from 'src/app/core/document.service';
import { MockDocumentService } from 'src/mocks/mock-document-service';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService } from 'src/mocks/mock-error-service';

describe('DocumentInfoHeaderComponent', () => {
  let component: DocumentInfoHeaderComponent;
  let fixture: ComponentFixture<DocumentInfoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentInfoHeaderComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatInputModule
      ],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInfoHeaderComponent);
    component = fixture.componentInstance;
    component.documentInformation = {
      documentName: 'Metroid Dread',
      documentPriority: 5,
      documentRithmId: 'E204F369-386F-4E41',
      currentAssignedUser: 'NS',
      flowedTimeUTC: '1943827200000',
      lastUpdatedUTC: '1943827200000',
      stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      stationName: 'Development',
      stationPriority: 2,
      stationInstruction: 'This is an instruction',
      stationOwners: [],
      workers: [],
      questions: [],
      instructions: 'General instructions'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display/hide the document info drawer in station', () => {
    const drawerItem = 'documentInfo';
    const rithmId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
    const expectedData = {
      rithmId: rithmId
    };
    const toogleDrawerSpy = spyOn(TestBed.inject(SidenavDrawerService), 'toggleDrawer');
    component.toggleDrawer(drawerItem);
    expect(toogleDrawerSpy).toHaveBeenCalledOnceWith(drawerItem, expectedData);
  });

  it('should get the appended fields in the document name', () => {
    const stationId = '1234-1234-123';
    const getDataFieldsDocument = spyOn(TestBed.inject(DocumentService), 'getAppendedFieldsOnDocumentName').and.callThrough();

    component.getAppendedFieldsOnDocumentName(stationId);

    expect(getDataFieldsDocument).toHaveBeenCalledOnceWith(stationId);
  });
});
