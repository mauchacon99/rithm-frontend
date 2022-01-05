import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToolbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the inline toolbar visibility', () => {
    expect(component.isInlineToolbarOpen).toBeFalsy();
    component.toggleInlineToolbar();
    expect(component.isInlineToolbarOpen).toBeTruthy();
    component.toggleInlineToolbar();
    expect(component.isInlineToolbarOpen).toBeFalsy();
  });

  it('should close the toolbar when clicked outside of container', () => {
    expect(component.isInlineToolbarOpen).toBeFalsy();
    component.clickedOutside();
    expect(component.isInlineToolbarOpen).toBeFalsy();
    component.isInlineToolbarOpen = true;
    component.clickedOutside();
    expect(component.isInlineToolbarOpen).toBeFalsy();
  });
});
