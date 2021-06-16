import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardService } from '../dashboard.service';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MockDashboardService, MockPopupService } from 'src/mocks';
import { PopupService } from 'src/app/core/popup.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        RouterTestingModule,
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: PopupService, useClass: MockPopupService }
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
