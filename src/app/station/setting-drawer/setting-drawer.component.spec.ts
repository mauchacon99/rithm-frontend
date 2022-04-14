import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import {
  FrameType,
  Question,
  QuestionFieldType,
  SettingDrawerData,
} from 'src/models';
import { SettingDrawerComponent } from './setting-drawer.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { StationService } from 'src/app/core/station.service';
import { MockPopupService, MockStationService } from 'src/mocks';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PopupService } from 'src/app/core/popup.service';

describe('SettingDrawerComponent', () => {
  let component: SettingDrawerComponent;
  let fixture: ComponentFixture<SettingDrawerComponent>;
  let sideNavService: SidenavDrawerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingDrawerComponent],
      imports: [
        MatInputModule,
        NoopAnimationsModule,
        FormsModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule,
        RouterTestingModule.withRoutes([
          { path: 'station/:stationId', component: SettingDrawerComponent },
        ]),
      ],
      providers: [
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
        { provide: StationService, useClass: MockStationService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingDrawerComponent);
    component = fixture.componentInstance;
    sideNavService = TestBed.inject(SidenavDrawerService);
    component.fieldSetting = {
      prompt: 'Fake question 1',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.ShortText,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test sideNavService', () => {
    const field: Question = {
      prompt: 'Fake question 1',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.ShortText,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    };
    const dataDrawer: SettingDrawerData = {
      field: field,
      frame: FrameType.Body,
    };
    sideNavService.drawerData$.next(dataDrawer);
    expect(component.fieldSetting).toBe(dataDrawer.field);
    expect(component.fieldFrameType).toBe(dataDrawer.frame);
  });

  it('should subscribe drawerData', () => {
    const drawerSpy = spyOn(component, <never>'subscribeDrawerData$');
    component.ngOnInit();
    expect(drawerSpy).toHaveBeenCalled();
  });

  it('should call getParams to get the stationId', () => {
    TestBed.inject(Router).navigate([
      '/',
      'station',
      '2433D3E3-D3BA-4F18-A0D3-2121968EC7F5',
    ]);
    const spyService = spyOn(
      TestBed.inject(ActivatedRoute).params,
      'subscribe'
    );
    fixture.detectChanges();
    component['getStationId']();
    expect(spyService).toHaveBeenCalled();
  });
});
