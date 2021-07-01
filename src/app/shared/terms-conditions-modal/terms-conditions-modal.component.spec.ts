import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import { MockPopupService, MockUserService } from 'src/mocks';
import { DialogData } from 'src/models';

import { TermsConditionsComponentComponent } from './terms-conditions-modal.component';

describe('TermsConditionsComponentComponent', () => {
  let component: TermsConditionsComponentComponent;
  let fixture: ComponentFixture<TermsConditionsComponentComponent>;

  const DIALOG_TEST_DATA: DialogData = {
    title: 'Terms and Conditions',
    message: 'Returns terms and conditions',
    okButtonText: 'Agree',
    width: '90%'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermsConditionsComponentComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
        { provide: PopupService, useClass: MockPopupService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsConditionsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
