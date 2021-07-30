import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { UserFormComponent } from 'src/app/shared/user-form/user-form.component';

import { GeneralAccountSettingsComponent } from './general-account-settings.component';

describe('GeneralAccountSettingsComponent', () => {
  let component: GeneralAccountSettingsComponent;
  let fixture: ComponentFixture<GeneralAccountSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GeneralAccountSettingsComponent,
        MockComponent(UserFormComponent)
      ],
      imports: [
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
