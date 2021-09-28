import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorService } from 'src/app/core/error.service';
import { OrganizationService } from 'src/app/core/organization.service';
import { UserService } from 'src/app/core/user.service';
import { MockErrorService, MockMapService, MockOrganizationService, MockUserService } from 'src/mocks';
import { MapMode } from 'src/models';
import { MapService } from '../map.service';

import { MapToolbarComponent } from './map-toolbar.component';

describe('MapToolbarComponent', () => {
  let component: MapToolbarComponent;
  let fixture: ComponentFixture<MapToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapToolbarComponent ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: OrganizationService, useClass: MockOrganizationService },
        { provide: MapService, useClass: MockMapService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle mapMode', () => {
    component.addStation();
    expect(component.stationAddActive).toBeTrue();
    expect(component.mapMode).toEqual(MapMode.stationAdd);
    component.addStation();
    expect(component.stationAddActive).toBeFalse();
    expect(component.mapMode).toEqual(MapMode.view);
  });
});
