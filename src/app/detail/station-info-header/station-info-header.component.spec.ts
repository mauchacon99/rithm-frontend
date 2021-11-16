import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/core/user.service';
import { MockUserService } from 'src/mocks';

import { StationInfoHeaderComponent } from './station-info-header.component';

describe('StationInfoHeaderComponent', () => {
  let component: StationInfoHeaderComponent;
  let fixture: ComponentFixture<StationInfoHeaderComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationInfoHeaderComponent,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: UserService, useClass: MockUserService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

});
