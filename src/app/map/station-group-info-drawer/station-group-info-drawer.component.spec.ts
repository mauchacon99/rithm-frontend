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
    component.stationGroupRithmId = 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989';
    const index = service.stationGroupElements.findIndex(
      (stGroup) => stGroup.rithmId === component.stationGroupRithmId
    );
    component.setStationGroupChanges();
    expect(service.stationGroupElements[index].title).toEqual(
      component.groupName
    );
    service.stationGroupElementsChanged$.subscribe((res) =>
      expect(res).toBe(true)
    );
  });
});
