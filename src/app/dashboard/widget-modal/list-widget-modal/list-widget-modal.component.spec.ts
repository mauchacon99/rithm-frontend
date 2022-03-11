import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { StationWidgetTemplateModalComponent } from '../station-widget-template-modal/station-widget-template-modal.component';

import { ListWidgetModalComponent } from './list-widget-modal.component';

describe('ListWidgetModalComponent', () => {
  let component: ListWidgetModalComponent;
  let fixture: ComponentFixture<ListWidgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListWidgetModalComponent,
        MockComponent(StationWidgetTemplateModalComponent),
      ],
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
