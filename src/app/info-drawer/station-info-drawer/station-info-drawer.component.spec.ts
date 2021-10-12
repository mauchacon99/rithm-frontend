import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationInfoDrawerComponent } from './station-info-drawer.component';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService, MockUserService } from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from 'src/app/core/user.service';
import { MockComponent } from 'ng-mocks';
import { RosterComponent } from 'src/app/shared/roster/roster.component';


describe('StationInfoDrawerComponent', () => {
  let component: StationInfoDrawerComponent;
  let fixture: ComponentFixture<StationInfoDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationInfoDrawerComponent,
        MockComponent(RosterComponent)
      ],
       imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService }
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoDrawerComponent);
    component = fixture.componentInstance;
    component.stationInformation = {
      stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      name: 'Dry Goods & Liquids',
      instructions: '',
      nextStations: [],
      previousStations: [],
      supervisors: [],
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

  /**TODO : fix. */
  xit('should get station last updated date', async () => {
    const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
    const updatedDateSpy: jasmine.Spy = spyOn(TestBed.inject(StationService), 'getLastUpdated');
    await component.getLastUpdated(stationId);
    expect(updatedDateSpy).toHaveBeenCalled();
  });
});
