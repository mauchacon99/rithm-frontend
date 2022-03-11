import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MockComponent} from "ng-mocks";

import { ListWidgetModalComponent } from './list-widget-modal.component';
import {
  DocumentWidgetTemplateModalComponent
} from "src/app/dashboard/widget-modal/document-widget-template-modal/document-widget-template-modal.component";

describe('ListWidgetModalComponent', () => {
  let component: ListWidgetModalComponent;
  let fixture: ComponentFixture<ListWidgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListWidgetModalComponent,
      MockComponent(DocumentWidgetTemplateModalComponent)],
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
