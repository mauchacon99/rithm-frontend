import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWidgetModalComponent } from './list-widget-modal.component';

describe('ListWidgetModalComponent', () => {
  let component: ListWidgetModalComponent;
  let fixture: ComponentFixture<ListWidgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListWidgetModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWidgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
