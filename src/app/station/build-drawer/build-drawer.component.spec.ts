import { SelectionModel } from '@angular/cdk/collections';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatListModule,
  MatListOption,
  MatSelectionList,
} from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatExpansionPanelHarness } from '@angular/material/expansion/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { BuildDrawerComponent } from './build-drawer.component';
import { MockComponent } from 'ng-mocks';
import { PreviousFieldsComponent } from 'src/app/shared/previous-fields/previous-fields.component';

describe('BuildDrawerComponent', () => {
  let component: BuildDrawerComponent;
  let fixture: ComponentFixture<BuildDrawerComponent>;
  let categoriesList: DebugElement;
  let categoryItem: DebugElement[];
  let categorySelected: MatListOption;
  let categoriesListSelected: SelectionModel<MatListOption>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatListModule,
        MatExpansionModule,
        DragDropModule,
        NoopAnimationsModule,
      ],
      declarations: [
        BuildDrawerComponent,
        MockComponent(PreviousFieldsComponent),
      ],
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
    loader = TestbedHarnessEnvironment.loader(fixture);
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
    expect(categoriesListSelected.selected).toHaveSize(1);
    fixture.detectChanges();

    const formInputs = fixture.nativeElement.querySelector(
      '#custom-fields-container'
    );
    expect(formInputs).toBeTruthy();
    expect(component.customFields).toHaveSize(15);
    const formInputCategoryList =
      fixture.debugElement.nativeElement.querySelectorAll(
        '[data-testid="custom-fields-item"]'
      );
    expect(formInputCategoryList).toHaveSize(15);
  });

  it('should not show list Form Input container when item selected on mat-select is different to Form Inputs', () => {
    component.categorySelected = 'Previous Fields';
    fixture.detectChanges();
    const formInputsPF = fixture.debugElement.nativeElement.querySelector(
      '#custom-fields-container'
    );
    expect(formInputsPF).toBeFalsy();
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

  describe('TestExpansionHarness', () => {
    beforeEach(() => {
      component.categorySelected = 'Previous Fields';
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should be able to load expansion panels', async () => {
      const panels = await loader.getAllHarnesses(MatExpansionPanelHarness);
      expect(panels.length).toBe(2);
    });

    it('should be able to toggle expansion state of panel', async () => {
      const panel = await loader.getHarness(MatExpansionPanelHarness);
      expect(await panel.isExpanded()).toBe(true);
    });
  });
});
