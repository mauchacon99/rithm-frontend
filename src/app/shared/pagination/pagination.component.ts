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
    if (pageNum > this.activeNum) {
      this.incrementPage();
    } else {
      this.decrementPage();
    }
    // this.activeNum = pageNum;
  }

  /**
   * Go back a page.
   */
  decrementPage(): void {
    this.activeNum -= 1;
    if (this.pagesArr.length > 5 && this.activeNum >= 3) {
      if (this.activeNum >= 3) {
        this.startingPageNum -= 1;
      }
      if (this.activeNum > 3) {
        this.endingPageNum -= 1;
      } else {
        this.endingPageNum = 5;
      }
    }
  }

  /**
   * Go forward a page.
   */
  incrementPage(): void {
    this.activeNum += 1;
    if (this.pagesArr.length > 5 && this.activeNum > 3) {
      if (this.activeNum <= this.pagesArr.length - 2) {
        this.startingPageNum += 1;
      }
      if (this.activeNum > this.pagesArr.length - 3) {
        this.endingPageNum = this.pagesArr.length;
      } else {
        this.endingPageNum += 1;
      }
    }
  }

}
