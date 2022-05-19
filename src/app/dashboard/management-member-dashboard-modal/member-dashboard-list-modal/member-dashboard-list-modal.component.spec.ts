import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { UserAvatarComponent } from 'src/app/shared/user-avatar/user-avatar.component';
import { MemberDashboard } from 'src/models';

import { MemberDashboardListModalComponent } from './member-dashboard-list-modal.component';

describe('MemberDashboardListModalComponent', () => {
  let component: MemberDashboardListModalComponent;
  let fixture: ComponentFixture<MemberDashboardListModalComponent>;
  const formBuilder = new FormBuilder();
  const member: MemberDashboard = {
    rithmId: '123-456-789',
    profileImageRithmId: '123-456-789',
    firstName: 'Test 1',
    lastName: 'Eagle 1',
    email: 'test1@email.com',
    canView: true,
    isEditable: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MemberDashboardListModalComponent,
        MockComponent(UserAvatarComponent),
      ],
      providers: [{ provide: FormBuilder, useValue: formBuilder }],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatCheckboxModule,
        MatChipsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDashboardListModalComponent);
    component = fixture.componentInstance;
    component.member = member;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default value in isEditable when check is false', () => {
    component.form.patchValue({
      isEditable: true,
    });
    spyOnProperty(component, 'check').and.returnValue(false);
    fixture.detectChanges();
    component.onChange();
    expect(component.isEditable).toBeFalse();
    expect(component.form.controls['isEditable'].value).toBeFalse();
  });

  it('should change value in isEditable when clicked chip', () => {
    const index = 1;
    component.index = index;
    component.form.patchValue({
      isEditable: false,
    });
    spyOnProperty(component, 'check').and.returnValue(true);
    fixture.detectChanges();

    const chip = fixture.debugElement.nativeElement.querySelector(
      '#can-edit-' + index
    );
    expect(chip).toBeTruthy();
    chip.click();
    expect(component.isEditable).toBeTrue();
    expect(component.form.controls['isEditable'].value).toBeTrue();
  });
});
