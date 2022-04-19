import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { throwError } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockDocumentService } from 'src/mocks';
import { LoadingWidgetComponent } from 'src/app/dashboard/widgets/loading-widget/loading-widget.component';

import { ContainerPreBuiltWidgetComponent } from './container-pre-built-widget.component';
import { ErrorWidgetComponent } from 'src/app/dashboard/widgets/error-widget/error-widget.component';

describe('ContainerPreBuiltWidgetComponent', () => {
  let component: ContainerPreBuiltWidgetComponent;
  let fixture: ComponentFixture<ContainerPreBuiltWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ContainerPreBuiltWidgetComponent,
        MockComponent(LoadingWidgetComponent),
        MockComponent(ErrorWidgetComponent),
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerPreBuiltWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getContainerWidgetPreBuilt', () => {
    const spyGetContainerWidgetPreBuilt = spyOn(
      TestBed.inject(DocumentService),
      'getContainerWidgetPreBuilt'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyGetContainerWidgetPreBuilt).toHaveBeenCalled();
  });

  it('should catch an error if the request getContainerWidgetPreBuilt fails', () => {
    const spyError = spyOn(
      TestBed.inject(DocumentService),
      'getContainerWidgetPreBuilt'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });

  it('should show loading while get containers', () => {
    const spyMethod = spyOn(
      component,
      'getContainerWidgetPreBuilt'
    ).and.callThrough();

    component.ngOnInit();
    expect(spyMethod).toHaveBeenCalled();

    const loading = fixture.nativeElement.querySelector(
      '#app-loading-indicator'
    );
    expect(loading).toBeTruthy();
  });

  it('should show message error and try again', () => {
    const spyMethod = spyOn(
      component,
      'getContainerWidgetPreBuilt'
    ).and.callThrough();

    const spyError = spyOn(
      TestBed.inject(DocumentService),
      'getContainerWidgetPreBuilt'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    fixture.detectChanges();
    const errorComponent =
      fixture.nativeElement.querySelector('#error-load-widget');
    expect(errorComponent).toBeTruthy();
    expect(spyError).toHaveBeenCalled();
    expect(spyMethod).toHaveBeenCalled();
  });
});
