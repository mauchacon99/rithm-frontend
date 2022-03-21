import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MockDashboardService } from 'src/mocks';

import { GroupWidgetTemplateModalComponent } from './group-widget-template-modal.component';

describe('GroupWidgetTemplateModalComponent', () => {
  let component: GroupWidgetTemplateModalComponent;
  let fixture: ComponentFixture<GroupWidgetTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupWidgetTemplateModalComponent],
      imports: [MatInputModule, NoopAnimationsModule],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupWidgetTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
