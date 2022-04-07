import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { Question, QuestionFieldType } from 'src/models';
import { SettingDrawerComponent } from './setting-drawer.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StationService } from 'src/app/core/station.service';
import { MockStationService, MockPopupService } from 'src/mocks';
import { PopupService } from 'src/app/core/popup.service';

describe('SettingDrawerComponent', () => {
  let component: SettingDrawerComponent;
  let fixture: ComponentFixture<SettingDrawerComponent>;
  let sideNavService: SidenavDrawerService;
  let service: StationService;
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
    service = TestBed.inject(StationService);
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
    const field = {
      prompt: 'Fake question 1',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.ShortText,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    };
    sideNavService.drawerData$.next(field);
    expect(component.fieldSetting).toBe(field);
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

  it('should return false the method that modify isPrevious', () => {
    const spyProperty = spyOnProperty(
      component,
      'isPrevious',
      'get'
    ).and.returnValue(false);

    fixture.detectChanges();
    expect(spyProperty).toHaveBeenCalled();
  });

  it('should set isRequired as false due to isReadOnly is false (isPrevious only).', () => {
    component.fieldSetting.isReadOnly = false;
    const setReadOnlySpy = spyOn(
      component,
      'setReadOnlyFalse'
    ).and.callThrough();
    component.setReadOnlyFalse();
    expect(setReadOnlySpy).toHaveBeenCalledOnceWith();
  });
  
  it('should display a confirmation Popup for delete filed', async () => {
    const questions: Question[] = [
      {
        prompt: 'Fake question 1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Fake question 2',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
    ];
    const deleteConfirmPopup = {
      title: '',
      message: 'Are you sure you want to delete this field?',
      okButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      important: true,
    };
    const popUpConfirmSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();
    await component.deleteQuestion(questions[0]);
    expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(deleteConfirmPopup);
    service.deleteStationQuestion$.subscribe((response) => {
      expect(response).toEqual(questions[0]);
    });
  });
});
