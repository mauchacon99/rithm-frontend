import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsMenuComponent } from './options-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MockDashboardService, MockPopupService } from 'src/mocks';
import { PopupService } from 'src/app/core/popup.service';

describe('OptionsMenuComponent', () => {
  let component: OptionsMenuComponent;
  let fixture: ComponentFixture<OptionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptionsMenuComponent],
      imports: [MatMenuModule],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service from generateNewDashboard', () => {
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'generateNewDashboard'
    ).and.callThrough();

    component.generateNewDashboard();
    expect(spyService).toHaveBeenCalled();
  });
});
