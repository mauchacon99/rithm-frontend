import { MockComponent } from 'ng-mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleWidgetComponent } from './title-widget.component';
import { TextFieldComponent } from 'src/app/shared/fields/text-field/text-field.component';

describe('TitleWidgetComponent', () => {
  let component: TitleWidgetComponent;
  let fixture: ComponentFixture<TitleWidgetComponent>;
  const titleTextValue = 'Form Title';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitleWidgetComponent, MockComponent(TextFieldComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event openSettingDrawer', () => {
    component.widgetMode = 'setting';
    const spyEmit = spyOn(component.openSettingDrawer, 'emit');
    component.openFieldSettingDrawer(titleTextValue);
    expect(spyEmit).toHaveBeenCalledWith(titleTextValue);
  });
});
