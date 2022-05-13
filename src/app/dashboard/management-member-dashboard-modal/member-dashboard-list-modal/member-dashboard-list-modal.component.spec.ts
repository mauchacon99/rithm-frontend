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

  it('should change status in isEdit', () => {
    component.isEditable = false;
    spyOnProperty(component, 'check').and.returnValue(true);
    fixture.detectChanges();
    component.onChange();
    expect(component.isEditable).toBeTrue();
    expect(component.form.controls['isEditable'].value).toBeTrue();
  });
});
