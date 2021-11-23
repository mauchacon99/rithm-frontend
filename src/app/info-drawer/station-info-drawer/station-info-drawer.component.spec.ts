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
import { HttpClientModule } from '@angular/common/http';

describe('StationInfoDrawerComponent', () => {
  let component: StationInfoDrawerComponent;
  let fixture: ComponentFixture<StationInfoDrawerComponent>;
  const formBuilder = new FormBuilder();
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';

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
        MatRadioModule,
        HttpClientModule
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

  it('should get station last updated date', () => {
    const getLastUpdatedSpy = spyOn(TestBed.inject(StationService), 'getLastUpdated').and.callThrough();

    component.getLastUpdated(stationId);

    expect(getLastUpdatedSpy).toHaveBeenCalledOnceWith(stationId);
  });

  it('should delete a station', async () => {
    const deleteStationSpy = spyOn(TestBed.inject(StationService), 'deleteStation').and.callThrough();

    await component.deleteStation(stationId);

    expect(deleteStationSpy).toHaveBeenCalledOnceWith(stationId);
  });

  it('should update station document generation status', () => {
    const updateGenerationStatusSpy = spyOn(TestBed.inject(StationService), 'updateStationDocumentGenerationStatus').and.callThrough();

    const newStatus = DocumentGenerationStatus.Manual;

    component.updateStationDocumentGenerationStatus(stationId, newStatus);

    expect(updateGenerationStatusSpy).toHaveBeenCalledOnceWith(stationId, newStatus);
  });

  it('should update the component data', () => {
    const refreshDataComponent = spyOn(TestBed.inject(StationService), 'getStationInfo').and.callThrough();
    component.getStationInfo();
    expect(refreshDataComponent).toHaveBeenCalledOnceWith(stationId);
  });

  it('should show loading-indicators while get data component', () => {
    component.getStationInfo();
    fixture.detectChanges();
    expect(component.stationLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector('#loading-drawer-component');
    expect(loadingComponent).toBeTruthy();
  });

  it('should show loading-indicators while get lasted data update', () => {
    component.getLastUpdated(stationId);
    fixture.detectChanges();
    expect(component.stationLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector('#loading-drawer-component');
    expect(loadingComponent).toBeTruthy();
  });

  it('should show loading-indicators while get data the status station document', () => {
    component.getStationDocumentGenerationStatus(stationId);
    expect(component.docGenLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector('#loading-indicator-status');
    expect(loadingComponent).toBeTruthy();
  });

  it('should show loading-indicators while update data the status station document', () => {
    const newStatus = DocumentGenerationStatus.Manual;
    component.updateStationDocumentGenerationStatus(stationId, newStatus);
    expect(component.docGenLoading).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector('#loading-indicator-status');
    expect(loadingComponent).toBeTruthy();
  });

  it('should refresher data info drawer component after this execute event refresher the dialog', () => {
    const eventRefresher = true;
    const spyRefresh = spyOn(component, 'getStationInfo').and.callThrough();
    component.refreshInfoDrawer(eventRefresher);
    expect(spyRefresh).toHaveBeenCalledOnceWith();
  });

});
