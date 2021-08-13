import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '../header/header.component';
import { PriorityQueueComponent } from '../priority-queue/priority-queue.component';
import { PreviouslyStartedDocumentsComponent } from '../previously-started-documents/previously-started-documents.component';
import { MyStationsComponent } from '../my-stations/my-stations.component';
import { StationService } from 'src/app/core/station.service';
import { MockStationService } from 'src/mocks';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        MockComponent(HeaderComponent),
        MockComponent(PriorityQueueComponent),
        MockComponent(PreviouslyStartedDocumentsComponent),
        MockComponent(MyStationsComponent)
      ],
      providers: [
        { provide: StationService, useClass: MockStationService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
