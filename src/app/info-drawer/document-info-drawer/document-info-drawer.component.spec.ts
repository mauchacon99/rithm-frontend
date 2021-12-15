import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockStationService, MockUserService, MockDocumentService } from 'src/mocks';
import { DocumentInfoDrawerComponent } from './document-info-drawer.component';
import { StationService } from 'src/app/core/station.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from 'src/app/core/user.service';
import { DocumentService } from 'src/app/core/document.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';


describe('DocumentInfoDrawerComponent', () => {
  let component: DocumentInfoDrawerComponent;
  let fixture: ComponentFixture<DocumentInfoDrawerComponent>;
  let sideNavService: SidenavDrawerService;
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
  const documentId = 'E204F369-386F-4E41';
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentInfoDrawerComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: FormGroup, useValue: formBuilder },
        { provide: UserService, useClass: MockUserService },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: SidenavDrawerService, useClass: SidenavDrawerService }
      ],
      imports: [
        MatCheckboxModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        MatSelectModule,
        FormsModule
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentInfoDrawerComponent);
    component = fixture.componentInstance;
    sideNavService = TestBed.inject(SidenavDrawerService);
    component.documentRithmId = documentId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the editable status of the document in the station', async () => {
    const newStatus = true;
    component.stationRithmId = stationId;
    const updateGenerationStatusSpy = spyOn(TestBed.inject(StationService), 'updateStatusDocumentEditable').and.callThrough();

    await component.updateStatusDocumentEditable(newStatus);

    expect(updateGenerationStatusSpy).toHaveBeenCalledOnceWith(stationId, newStatus);
  });

  it('should get the current editable status of the document', async () => {
    component.stationRithmId = stationId;
    const getGenerationStatusSpy = spyOn(TestBed.inject(StationService), 'getStatusDocumentEditable').and.callThrough();
    await component.getStatusDocumentEditable();

    expect(getGenerationStatusSpy).toHaveBeenCalledOnceWith(stationId);
  });

  it('should get document last updated date', () => {
    const getLastUpdatedSpy = spyOn(TestBed.inject(DocumentService), 'getLastUpdated').and.callThrough();

    sideNavService.drawerData$.next({
      isStation: false,
      documentRithmId: documentId
    });

    expect(getLastUpdatedSpy).toHaveBeenCalledOnceWith(documentId);
  });

  it('should get held time in station for document', () => {
    const getDocumentTimeInStationSpy = spyOn(TestBed.inject(DocumentService), 'getDocumentTimeInStation').and.callThrough();

    sideNavService.drawerData$.next({
      isStation: false,
      documentRithmId: documentId,
      stationRithmId: stationId
    });

    expect(getDocumentTimeInStationSpy).toHaveBeenCalledOnceWith(documentId, stationId);
  });

  it('should return the user assigned to the document', () => {
    const getAssignedUserSpy = spyOn(TestBed.inject(DocumentService), 'getAssignedUserToDocument').and.callThrough();
    component.stationRithmId = stationId;
    component['getAssignedUserToDocument'](documentId);

    expect(getAssignedUserSpy).toHaveBeenCalledOnceWith(documentId, stationId, true);
  });

  it('should delete a document', () => {
    const deleteDocumentSpy = spyOn(TestBed.inject(DocumentService), 'deleteDocument').and.callThrough();

    component['deleteDocument'](documentId);

    expect(deleteDocumentSpy).toHaveBeenCalledOnceWith(documentId);
  });

  it('should show loading-last-update while get data last updated', () => {
    sideNavService.drawerData$.next({
      isStation: false,
      documentRithmId: documentId
    });
    fixture.detectChanges();
    expect(component.lastUpdatedLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector('#loading-last-update');
    expect(loadingComponent).toBeTruthy();
  });
});
