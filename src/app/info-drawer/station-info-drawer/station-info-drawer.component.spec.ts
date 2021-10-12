import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationInfoDrawerComponent } from './station-info-drawer.component';
import { UserService } from 'src/app/core/user.service';
import { MockUserService } from 'src/mocks';
import { MockComponent } from 'ng-mocks';
import { RosterComponent } from 'src/app/shared/roster/roster.component';
import { MatButtonModule } from '@angular/material/button';

describe('StationInfoDrawerComponent', () => {
  let component: StationInfoDrawerComponent;
  let fixture: ComponentFixture<StationInfoDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationInfoDrawerComponent,
        MockComponent(RosterComponent)
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
      ],
      imports: [
        MatButtonModule
      ]
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
});
