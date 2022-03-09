import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { MapService } from 'src/app/map/map.service';
import { MockMapService } from 'src/mocks';
import { StationInfoDrawerComponent } from '../station-info-drawer/station-info-drawer.component';

import { InfoDrawerComponent } from './info-drawer.component';

describe('InfoDrawerComponent', () => {
  let component: InfoDrawerComponent;
  let fixture: ComponentFixture<InfoDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InfoDrawerComponent,
        MockComponent(StationInfoDrawerComponent),
      ],
      providers: [{ provide: MapService, useClass: MockMapService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



});
