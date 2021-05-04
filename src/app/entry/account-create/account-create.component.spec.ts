import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { MockUserService } from 'src/app/core/user-service-mock';
import { UserService } from 'src/app/core/user.service';

import { AccountCreateComponent } from './account-create.component';

describe('AccountCreateComponent', () => {
  let component: AccountCreateComponent;
  let fixture: ComponentFixture<AccountCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountCreateComponent ],
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        MatDialogModule
      ],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
