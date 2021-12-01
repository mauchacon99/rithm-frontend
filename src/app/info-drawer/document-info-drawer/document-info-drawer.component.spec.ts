import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockStationService } from 'src/mocks';
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
import { UserService } from '../../core/user.service';
import { MockUserService } from '../../../mocks/mock-user-service';


describe('DocumentInfoDrawerComponent', () => {
  let component: DocumentInfoDrawerComponent;
  let fixture: ComponentFixture<DocumentInfoDrawerComponent>;
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
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
        { provide: UserService, useClass: MockUserService }
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

  it('should return boolean to method userTypeOwnerOrAdmin', () => {
    const userType = { role: 'admin' };
    localStorage.setItem('refreshTokenGuid', 'ee5655c8-5896-4ba8-9420-c14f28bf5b1f');
    localStorage.setItem('user', JSON.stringify(userType));
    expect(component.userTypeOwnerOrAdmin).toBe(false);
  });
});
