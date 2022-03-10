import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatListModule,
  MatListOption,
  MatSelectionList,
} from '@angular/material/list';
import { By } from '@angular/platform-browser';
import { BuildDrawerComponent } from './build-drawer.component';

describe('BuildDrawerComponent', () => {
  let component: BuildDrawerComponent;
  let fixture: ComponentFixture<BuildDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatListModule],
      declarations: [BuildDrawerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create mat-selection-list', () => {
    const categoriesList = fixture.debugElement.query(
      By.directive(MatSelectionList)
    );
    expect(categoriesList).toBeTruthy();
  });

  it('should create mat-list-option', () => {
    const categoryItem = fixture.debugElement.queryAll(
      By.directive(MatListOption)
    );
    expect(categoryItem.length).toEqual(component.buildCategories.length);
  });

  it('should make a possible selection to an item of list categories', () => {
    const categoryItem = fixture.debugElement.queryAll(
      By.directive(MatListOption)
    );
    const categoriesList = fixture.debugElement.query(
      By.directive(MatSelectionList)
    );
    const categorySelected =
      categoryItem[2].injector.get<MatListOption>(MatListOption);
    const categoriesListSelected =
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
});
