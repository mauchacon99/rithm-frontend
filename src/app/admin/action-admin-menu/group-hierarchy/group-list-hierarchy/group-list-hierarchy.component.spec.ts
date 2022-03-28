import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';

import { GroupListHierarchyComponent } from './group-list-hierarchy.component';
import { MatSelectionListChange } from '@angular/material/list';

describe('GroupListHierarchyComponent', () => {
  let component: GroupListHierarchyComponent;
  let fixture: ComponentFixture<GroupListHierarchyComponent>;
  let stationService: StationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupListHierarchyComponent],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: StationService, useClass: MockStationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupListHierarchyComponent);
    component = fixture.componentInstance;
    stationService = TestBed.inject(StationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service that return station groups data', () => {
    const spyService = spyOn(
      stationService,
      'getStationGroups'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith('', 1);
  });

  it('should show error message when request station widget document  data', () => {
    spyOn(stationService, 'getStationGroups').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyService = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalled();
  });

  it('should emit selectedGroupRithmId', () => {
    const expectedRithmId = '123-456-789';
    const spyEmit = spyOn(
      component.selectedGroupRithmId,
      'emit'
    ).and.callThrough();
    const mockMatSelectionListChange = {
      source: {
        _value: [expectedRithmId],
      },
    };
    component.selectGroupRithmId(
      mockMatSelectionListChange as MatSelectionListChange
    );
    expect(spyEmit).toHaveBeenCalledOnceWith(expectedRithmId);
  });
});
