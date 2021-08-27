import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MockComponent } from 'ng-mocks';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import { MockErrorService, MockPopupService, MockUserService } from 'src/mocks';
import { NotificationSettingsComponent } from '../notification-settings/notification-settings.component';
import { AccountSettingsComponent } from './account-settings.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserFormComponent } from 'src/app/shared/user-form/user-form.component';
import { ErrorService } from 'src/app/core/error.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TermsConditionsModalComponent } from 'src/app/shared/terms-conditions-modal/terms-conditions-modal.component';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;
  const formBuilder = new FormBuilder();

  let dialogSpy: jasmine.Spy;
  // eslint-disable-next-line rxjs/finnish
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  const dialogData = {
    panelClass: 'terms-condition',
    data: { title: 'Terms and Conditions', message: '', okButtonText: 'Ok', width: '90%', showAgreeButton: false }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountSettingsComponent,
        MockComponent(UserFormComponent),
        MockComponent(NotificationSettingsComponent)
      ],
      imports: [
        MatCardModule,
        MatDialogModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: UserService, useClass: MockUserService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: ErrorService, useClass: MockErrorService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open terms and conditions model', () => {
    component.viewTermsAndConditions();
    expect(dialogSpy).toHaveBeenCalledWith(TermsConditionsModalComponent, dialogData);
  });

});
