import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { QuestionFieldType } from 'src/models';
import { SettingDrawerComponent } from './setting-drawer.component';

describe('SettingDrawerComponent', () => {
  let component: SettingDrawerComponent;
  let fixture: ComponentFixture<SettingDrawerComponent>;
  let sideNavService: SidenavDrawerService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingDrawerComponent],
      providers: [
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingDrawerComponent);
    component = fixture.componentInstance;
    sideNavService = TestBed.inject(SidenavDrawerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test sideNavService', () => {
    const field = {
      prompt: 'Fake question 1',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.ShortText,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    };
    sideNavService.drawerData$.next(field);
    expect(component.fieldSetting).toBe(field);
  });
});
