import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { UserService } from 'src/app/core/user.service';
import { MockUserService } from 'src/mocks';

import { ErrorWidgetComponent } from './error-widget.component';

describe('ErrorWidgetComponent', () => {
  let component: ErrorWidgetComponent;
  let fixture: ComponentFixture<ErrorWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorWidgetComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
      ],
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

  it('should emit try again', () => {
    component.permission = true;
    const emit = spyOn(component.tryAgain, 'emit');
    const reloadRequest = spyOn(component, 'reloadRequest').and.callThrough();
    fixture.detectChanges();

    const tryAgain =
      fixture.debugElement.nativeElement.querySelector('#try-again');
    expect(tryAgain).toBeTruthy();
    tryAgain.click();

    expect(reloadRequest).toHaveBeenCalled();
    expect(emit).toHaveBeenCalledOnceWith();
  });

  it('should call removeWidget and show button if have permission', () => {
    component.widgetDeleted = true;
    component.permission = true;
    fixture.detectChanges();
    const spyDeleteWidget = spyOn(
      component.deleteWidget,
      'emit'
    ).and.callThrough();

    const spyRemoveWidget = spyOn(component, 'removeWidget').and.callThrough();
    const buttonDelete =
      fixture.debugElement.nativeElement.querySelector('#delete-widget');
    expect(buttonDelete).toBeTruthy();
    buttonDelete.click();
    expect(spyDeleteWidget).toHaveBeenCalled();
    expect(spyRemoveWidget).toHaveBeenCalled();
  });

  it('should hidden button if do not have permission and not is admin', () => {
    component.widgetDeleted = true;
    component.permission = false;
    component.isAdmin = false;
    fixture.detectChanges();
    const buttonDelete =
      fixture.debugElement.nativeElement.querySelector('#delete-widget');
    expect(buttonDelete).toBeNull();
  });

  it('should show button if is admin', () => {
    component.widgetDeleted = true;
    component.permission = false;
    component.isAdmin = true;
    fixture.detectChanges();
    const buttonDelete =
      fixture.debugElement.nativeElement.querySelector('#delete-widget');
    expect(buttonDelete).toBeTruthy();
  });
});
