import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardService } from '../dashboard.service';
import { DocumentService } from 'src/app/core/document.service';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MockDashboardService,
  MockUserService,
  MockDocumentService,
  MockPopupService,
} from 'src/mocks';
import { UserService } from 'src/app/core/user.service';
import { MatCardModule } from '@angular/material/card';
import { PopupService } from 'src/app/core/popup.service';
import { MockComponent } from 'ng-mocks';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, MockComponent(LoadingIndicatorComponent)],
      imports: [RouterTestingModule, MatCardModule],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: UserService, useClass: MockUserService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return dashboard header data for number of stations', () => {
    expect(component.numPrevDocs).toBeGreaterThanOrEqual(0);
  });

  it('should return dashboard header data for previous documents', () => {
    expect(component.numStations).toBeGreaterThanOrEqual(0);
  });
});
