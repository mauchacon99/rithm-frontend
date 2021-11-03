import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationInfoDrawerComponent } from './station-info-drawer.component';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockPopupService, MockStationService, MockUserService } from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from 'src/app/core/user.service';
import { MockComponent } from 'ng-mocks';
import { RosterComponent } from 'src/app/shared/roster/roster.component';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { PopupService } from 'src/app/core/popup.service';
import { DocumentGenerationStatus } from 'src/models';

describe('StationInfoDrawerComponent', () => {
  let component: StationInfoDrawerComponent;
  let fixture: ComponentFixture<StationInfoDrawerComponent>;
  const formBuilder = new FormBuilder();
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';

  let getLastUpdatedSpy: jasmine.Spy;
  let deleteStationSpy: jasmine.Spy;
  let updateGenerationStatusSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationInfoDrawerComponent,
        MockComponent(RosterComponent),
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule,
        MatButtonModule,
        MatRadioModule
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoDrawerComponent);
    component = fixture.componentInstance;
    component.stationInformation = {
      rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      name: 'Dry Goods & Liquids',
      instructions: '',
      nextStations: [],
      previousStations: [],
      stationOwners: [],
      workers: [],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 2
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get station last updated date', async () => {
    getLastUpdatedSpy = spyOn(TestBed.inject(StationService), 'getLastUpdated').and.callThrough();

    await component.getLastUpdated(stationId);

    expect(getLastUpdatedSpy).toHaveBeenCalled();
  });

  it('should delete a station', async () => {
    deleteStationSpy = spyOn(TestBed.inject(StationService), 'deleteStation').and.callThrough();

    await component.deleteStation(stationId);

    expect(deleteStationSpy).toHaveBeenCalled();
  });

  it('should update station document generation status', async () => {
    updateGenerationStatusSpy = spyOn(TestBed.inject(StationService), 'updateStationDocumentGenerationStatus').and.callThrough();

    const newStatus: DocumentGenerationStatus = DocumentGenerationStatus.Manual;

    await component.updateStationDocumentGenerationStatus(stationId, newStatus);

    expect(updateGenerationStatusSpy).toHaveBeenCalled();
  });
});
