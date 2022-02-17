import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorWidgetComponent } from './error-widget.component';

describe('ErrorWidgetComponent', () => {
  let component: ErrorWidgetComponent;
  let fixture: ComponentFixture<ErrorWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit ', () => {
    spyOn(component.tryAgain, 'emit');
    const reloadRequest = spyOn(component, 'reloadRequest').and.callThrough();
    fixture.detectChanges();

    const tryAgain =
      fixture.debugElement.nativeElement.querySelector('#try-again');
    expect(tryAgain).toBeTruthy();
    tryAgain.click();

    expect(reloadRequest).toHaveBeenCalled();
    expect(component.tryAgain.emit).toHaveBeenCalledOnceWith();
  });
});
