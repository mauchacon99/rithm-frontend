import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockDashboardService, MockPopupService } from 'src/mocks';
import { DashboardService } from '../dashboard.service';
import { MyStationsComponent } from './my-stations.component';
import { PopupService } from 'src/app/core/popup.service';
import { MockComponent } from 'ng-mocks';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';

describe('MyStationsComponent', () => {
  let component: MyStationsComponent;
  let fixture: ComponentFixture<MyStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MyStationsComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have stations', () => {
    expect(component.stations.length).toBeGreaterThanOrEqual(0);
  });
});
