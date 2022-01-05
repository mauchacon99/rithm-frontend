import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.numItems = 100;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment the page number from changePage method', () => {
    const currentPageNum = 1;
    component.changePage(currentPageNum);
    expect(component.activeNum).toEqual(2);
  });

  it('should decrement the page number from changePage method', () => {
    const currentPageNum = 1;
    component.changePage(currentPageNum);
    component.changePage(currentPageNum);
    expect(component.activeNum).toEqual(3);
    component.changePage(-1);
    expect(component.activeNum).toEqual(2);
  });

  it('should change the page number when using clickPage method', () => {
    component.clickPage(4);
    expect(component.activeNum).toEqual(4);
    expect(component.startingPageNum).toEqual(0);
    expect(component.endingPageNum).toEqual(5);
  });
});
