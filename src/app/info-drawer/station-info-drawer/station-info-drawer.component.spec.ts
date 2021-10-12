import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationInfoDrawerComponent } from './station-info-drawer.component';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';

describe('StationInfoDrawerComponent', () => {
  let component: StationInfoDrawerComponent;
  let fixture: ComponentFixture<StationInfoDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationInfoDrawerComponent ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoDrawerComponent);
    component = fixture.componentInstance;
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
