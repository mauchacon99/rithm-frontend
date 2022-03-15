import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionWidgetModalComponent } from './description-widget-modal.component';

describe('DescriptionWidgetModalComponent', () => {
  let component: DescriptionWidgetModalComponent;
  let fixture: ComponentFixture<DescriptionWidgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescriptionWidgetModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionWidgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
