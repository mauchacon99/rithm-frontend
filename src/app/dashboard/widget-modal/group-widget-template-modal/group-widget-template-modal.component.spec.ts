import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupWidgetTemplateModalComponent } from './group-widget-template-modal.component';

describe('GroupWidgetTemplateModalComponent', () => {
  let component: GroupWidgetTemplateModalComponent;
  let fixture: ComponentFixture<GroupWidgetTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupWidgetTemplateModalComponent ]
    })
    .compileComponents();
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
