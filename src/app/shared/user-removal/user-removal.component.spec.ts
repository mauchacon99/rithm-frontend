import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import { MockPopupService, MockUserService } from 'src/mocks';

import { UserRemovalComponent } from './user-removal.component';

describe('UserRemovalComponent', () => {
  let component: UserRemovalComponent;
  let fixture: ComponentFixture<UserRemovalComponent>;
  let formGroup: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRemovalComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRemovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    formGroup = component.deleteForm;
  });

  it('should create', () => {
    expect(formGroup).toBeTruthy();
    expect(component).toBeTruthy();
  });
});
