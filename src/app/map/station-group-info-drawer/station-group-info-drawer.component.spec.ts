import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { MockErrorService, MockMapService, MockPopupService } from 'src/mocks';
import { MapService } from '../map.service';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StationGroupInfoDrawerComponent } from './station-group-info-drawer.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MapItemStatus, MapMode } from 'src/models';
import { StationGroupMapElement } from 'src/helpers';

describe('StationGroupInfoDrawerComponent', () => {
  let component: StationGroupInfoDrawerComponent;
  let fixture: ComponentFixture<StationGroupInfoDrawerComponent>;
  const formBuilder = new FormBuilder();
  let service: MapService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationGroupInfoDrawerComponent],
      imports: [
        MatButtonModule,
        MatInputModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: MapService, useClass: MockMapService },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
      ],
    }).compileComponents();
    service = TestBed.inject(MapService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationGroupInfoDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the changes made to the current station group', () => {
    const stationGroups = [
      {
        rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
        organizationRithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
        title: 'Group 1',
        stations: [
          'ED6148C9-ABB7-408E-A210-9242B2735B1C',
          'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
          'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          'CCAEBE24-AF01-48AB-A7BB-279CC25B0990',
          'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
          'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
        ],
        subStationGroups: [],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: false,
        isChained: false,
      },
      {
        rithmId: '',
        title: '',
        stations: [],
        subStationGroups: ['ED6155C9-ABB7-458E-A250-9542B2535B1C'],
        status: MapItemStatus.Normal,
        isReadOnlyRootStationGroup: true,
        isChained: false,
      },
    ];
    service.mapStationGroupHelper.stationGroupElements = stationGroups.map(
      (e) => new StationGroupMapElement(e)
    );
    component.stationGroupRithmId = 'ED6155C9-ABB7-458E-A250-9542B2535B1C';
    component.currentMode = MapMode.Build;
    const index = service.mapStationGroupHelper.stationGroupElements.findIndex(
      (stGroup) => stGroup.rithmId === component.stationGroupRithmId
    );
    component.setStationGroupChanges();
    expect(
      service.mapStationGroupHelper.stationGroupElements[index].title
    ).toEqual(component.groupName);
    service.mapStationGroupHelper.stationGroupElementsChanged$.subscribe(
      (res) => expect(res).toBe(true)
    );
  });

  it('should open a confirmation pop up on click of delete station group button and delete on confirmation', async () => {
    const spy = spyOn(TestBed.inject(SidenavDrawerService), 'toggleDrawer');
    const mapServiceSpy = spyOn(
      TestBed.inject(MapService).mapStationGroupHelper,
      'removeStationGroup'
    );
    const dataToConfirmPopup = {
      title: 'Remove Station Group',
      message: 'Are you sure you want to delete this station group?',
      okButtonText: 'Remove',
    };
    const popUpConfirmSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();
    await component.removeStationGroup();
    expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(dataToConfirmPopup);
    expect(mapServiceSpy).toHaveBeenCalledOnceWith(
      component.stationGroupRithmId
    );
    expect(spy).toHaveBeenCalledOnceWith('stationGroupInfo');
  });
});
