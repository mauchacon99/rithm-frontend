import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockDashboardService } from '../dashboard-service-mock';
import { DashboardService } from '../dashboard.service';
import { MyStationsComponent } from './my-stations.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

describe('MyStationsComponent', () => {
  let component: MyStationsComponent;
  let fixture: ComponentFixture<MyStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyStationsComponent],
      imports: [
        MatSnackBarModule,
        MatDialogModule
      ],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Dashboard stations data verify', () => {
    expect(component.totalStations.length).toBeGreaterThanOrEqual(0);
  });

});
