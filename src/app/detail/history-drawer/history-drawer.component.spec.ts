import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDrawerComponent } from './history-drawer.component';

describe('HistoryDrawerComponent', () => {
  let component: HistoryDrawerComponent;
  let fixture: ComponentFixture<HistoryDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
