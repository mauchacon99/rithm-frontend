import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreBuiltWidgetTemplateModalComponent } from './pre-built-widget-template-modal.component';

describe('PreBuiltWidgetTemplateModalComponent', () => {
  let component: PreBuiltWidgetTemplateModalComponent;
  let fixture: ComponentFixture<PreBuiltWidgetTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreBuiltWidgetTemplateModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreBuiltWidgetTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
