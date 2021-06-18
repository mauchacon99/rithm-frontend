import { Component, Input } from '@angular/core';

/**
 * Reusable component for pagination with clickable pages.
 */
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  /** Total number of pages. */
  @Input() numPages = 10;

  /** Array of page numbers. */
  pagesArr: number[];

  /** Set the page number. */
  activeNum = 1;

  /** Where to start the array of pages. */
  startingPageNum = 0;

  /** Where to end the array of pages. */
  endingPageNum = 5;

  constructor() {
    this.pagesArr = [];
    while(this.numPages--) {
      this.pagesArr[this.numPages] = this.numPages + 1;
    }
  }

  /**
   * Change the page.
   *
   * @param pageNum The page to go to.
   */
  changePage(pageNum: number): void {
    this.activeNum = pageNum;
  }

  /**
   * Go back a page.
   */
  decrementPage(): void {
    // TODO: Check if we're on the first page.
    this.activeNum -= 1;
  }

  /**
   * Go forward a page.
   */
  incrementPage(): void {
    // TODO: Check if we're already on the last page.
    this.activeNum += 1;
  }

}
