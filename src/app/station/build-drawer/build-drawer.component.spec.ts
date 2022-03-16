import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatListModule,
  MatListOption,
  MatSelectionList,
} from '@angular/material/list';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatExpansionPanelHarness } from '@angular/material/expansion/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { BuildDrawerComponent } from './build-drawer.component';
import { DebugElement } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

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
      imports: [MatListModule, MatExpansionModule, NoopAnimationsModule],
      declarations: [BuildDrawerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    categoriesList = fixture.debugElement.query(By.directive(MatSelectionList));
    categoryItem = fixture.debugElement.queryAll(By.directive(MatListOption));
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
    const categoryNewSelected =
      categoryItem[2].injector.get<MatListOption>(MatListOption);
    const categoriesNewListSelected =
      categoriesList.injector.get<MatSelectionList>(
        MatSelectionList
      ).selectedOptions;

    expect(categoriesNewListSelected.selected.length).toBe(1);
    expect(categoryItem[2].nativeElement.getAttribute('aria-selected')).toBe(
      'false'
    );

    categoryNewSelected.toggle();
    fixture.detectChanges();

    expect(categoryItem[2].nativeElement.getAttribute('aria-selected')).toBe(
      'true'
    );
    expect(categoriesNewListSelected.selected.length).toBe(1);
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
      categoriesList = fixture.debugElement.query(
        By.directive(MatSelectionList)
      );
      categorySelected =
        categoryItem[1].injector.get<MatListOption>(MatListOption);
      categorySelected.toggle();
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should be able to load expansion panels', async () => {
      expect(categorySelected).toBeTruthy();
      const panels = await loader.getAllHarnesses(MatExpansionPanelHarness);
      expect(panels.length).toBe(2);
    });

    it('should be able to toggle expansion state of panel', async () => {
      expect(categorySelected).toBeTruthy();
      const panel = await loader.getHarness(MatExpansionPanelHarness);
      expect(await panel.isExpanded()).toBe(true);
    });
  });
});
