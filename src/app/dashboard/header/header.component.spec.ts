import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardService } from '../dashboard.service';
import { HeaderComponent } from './header.component';
import { MockDashboardService } from '../dashboard-service-mock';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dashboard header data verify', () => {
    expect(component.numPrev).toBeGreaterThanOrEqual(0);
    expect(component.numStations).toBeGreaterThanOrEqual(0);
  });

});
