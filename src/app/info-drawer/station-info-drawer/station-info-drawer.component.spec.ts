import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationInfoDrawerComponent } from './station-info-drawer.component';
import { UserService } from 'src/app/core/user.service';
import { MockUserService } from 'src/mocks';

describe('StationInfoDrawerComponent', () => {
  let component: StationInfoDrawerComponent;
  let fixture: ComponentFixture<StationInfoDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationInfoDrawerComponent ],
      providers:[
        { provide: UserService, useValue: MockUserService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInfoDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
