import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { MockUserService } from 'src/app/core/user-service-mock';
import { UserService } from 'src/app/core/user.service';

import { TopNavComponent } from './top-nav.component';

describe('TopNavComponent', () => {
  let component: TopNavComponent;
  let fixture: ComponentFixture<TopNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopNavComponent ],
      imports: [
        MatMenuModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should display logo', () => {
    expect(component).toBeTruthy();
  });

  xit('should display notifications', () => {
    expect(component).toBeTruthy();
  });

  xit('should display a tab for every nav item', () => {
    expect(component).toBeTruthy();
  });

  xit('should display user profile', () => {
    expect(component).toBeTruthy();
  });
});
