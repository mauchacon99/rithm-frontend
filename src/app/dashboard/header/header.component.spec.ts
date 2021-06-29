import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardService } from '../dashboard.service';
import { DocumentService } from 'src/app/core/document.service';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MockDashboardService, MockUserService, MockDocumentService } from 'src/mocks';
import { UserService } from 'src/app/core/user.service';
<<<<<<< HEAD
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
=======
import { MatCardModule } from '@angular/material/card';
>>>>>>> origin/dev

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        RouterTestingModule,
        MatProgressSpinnerModule,
<<<<<<< HEAD
=======
        MatCardModule
>>>>>>> origin/dev
      ],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: UserService, useClass: MockUserService },
        { provide: PopupService, useClass: MockPopupService }
      ]
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
