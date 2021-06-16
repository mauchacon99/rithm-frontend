import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterModalComponent } from './roster-modal.component';

describe('RosterModalComponent', () => {
  let component: RosterModalComponent;
  let fixture: ComponentFixture<RosterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RosterModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
