import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerRosterModalComponent } from './worker-roster-modal.component';

describe('WorkerRosterModalComponent', () => {
  let component: WorkerRosterModalComponent;
  let fixture: ComponentFixture<WorkerRosterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkerRosterModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerRosterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
