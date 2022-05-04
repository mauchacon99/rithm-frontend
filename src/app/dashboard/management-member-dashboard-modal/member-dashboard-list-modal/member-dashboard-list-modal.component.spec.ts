import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDashboardListModalComponent } from './member-dashboard-list-modal.component';

describe('MemberDashboardListModalComponent', () => {
  let component: MemberDashboardListModalComponent;
  let fixture: ComponentFixture<MemberDashboardListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberDashboardListModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDashboardListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
