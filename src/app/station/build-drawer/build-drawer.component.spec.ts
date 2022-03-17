import { SelectionModel } from '@angular/cdk/collections';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatListModule,
  MatListOption,
  MatSelectionList,
} from '@angular/material/list';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { By } from '@angular/platform-browser';
import { BuildDrawerComponent } from './build-drawer.component';

describe('BuildDrawerComponent', () => {
  let component: BuildDrawerComponent;
  let fixture: ComponentFixture<BuildDrawerComponent>;
  let categoriesList: DebugElement;
  let categoryItem: DebugElement[];
  let categorySelected: MatListOption;
  let categoriesListSelected: SelectionModel<MatListOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatListModule,DragDropModule],
      declarations: [BuildDrawerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    categoriesList = fixture.debugElement.query(By.directive(MatSelectionList));
    categoryItem = fixture.debugElement.queryAll(By.directive(MatListOption));
    categorySelected =
      categoryItem[0]?.injector.get<MatListOption>(MatListOption);
    categoriesListSelected =
      categoriesList.injector.get<MatSelectionList>(
        MatSelectionList
      ).selectedOptions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create mat-selection-list', () => {
    expect(categoriesList).toBeTruthy();
  });

  it('should create mat-list-option', () => {
    expect(categoryItem.length).toEqual(component.buildCategories.length);
  });

  it('should make a possible selection to an item of list categories', () => {
    categorySelected =
      categoryItem[2].injector.get<MatListOption>(MatListOption);
    categoriesListSelected =
      categoriesList.injector.get<MatSelectionList>(
        MatSelectionList
      ).selectedOptions;

    expect(categoriesListSelected.selected.length).toBe(1);
    expect(categoryItem[2].nativeElement.getAttribute('aria-selected')).toBe(
      'false'
    );

    categorySelected.toggle();
    fixture.detectChanges();

    expect(categoryItem[2].nativeElement.getAttribute('aria-selected')).toBe(
      'true'
    );
    expect(categoriesListSelected.selected.length).toBe(1);
  });

  it('should show a list of custom fields when selecting FormsInputCategory', () => {
    categorySelected =
      categoryItem[0].injector.get<MatListOption>(MatListOption);
    categoriesListSelected =
      categoriesList.injector.get<MatSelectionList>(
        MatSelectionList
      ).selectedOptions;
    expect(categoriesListSelected.selected.length).toBe(1);
    fixture.detectChanges();

    const formInputs = fixture.nativeElement.querySelector(
      '#custom-fields-container'
    );
    expect(formInputs).toBeTruthy();
    expect(component.customFields.length).toBe(16);
    const formInputCategoryList =
      fixture.debugElement.nativeElement.querySelectorAll(
        '[data-testid="custom-fields-item"]'
      );
    expect(formInputCategoryList.length).toBe(16);
  });

  it('should not show list Form Input container when item selected on mat-select is different to Form Inputs', () => {
    component.categorySelected = 'Components';
    fixture.detectChanges();
    const formInputsC = fixture.debugElement.nativeElement.querySelector(
      '#custom-fields-container'
    );
    expect(formInputsC).toBeFalsy();

    component.categorySelected = 'Previous Fields';
    fixture.detectChanges();
    const formInputsPF = fixture.debugElement.nativeElement.querySelector(
      '#custom-fields-container'
    );
    expect(formInputsPF).toBeFalsy();

    component.categorySelected = 'Integrations';
    fixture.detectChanges();
    const formInputsI = fixture.debugElement.nativeElement.querySelector(
      '#custom-fields-container'
    );
    expect(formInputsI).toBeFalsy();
  });

  it('should close drawer when closeButton is pressed', () => {
    const btnCloseDrawer = fixture.debugElement.nativeElement.querySelector(
      '#button-close-drawer'
    );
    expect(btnCloseDrawer).toBeTruthy();

    const spyCloseDrawer = spyOn(
      component,
      'handleCloseDrawer'
    ).and.callThrough();

    btnCloseDrawer.click();
    expect(spyCloseDrawer).toHaveBeenCalled();
  });
});
