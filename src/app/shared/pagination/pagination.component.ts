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
  @Input() numPages = 5;

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
   * Change the page by clicking the number.
   *
   * @param pageNum The page to go to.
   */
  clickPage(pageNum: number): void {
    this.activeNum = pageNum;

    if (this.activeNum >= this.pagesArr.length - 2 && this.pagesArr.length > 5) {
      this.startingPageNum = this.pagesArr.length - 5;
      this.endingPageNum = this.pagesArr.length;
    }
    if (this.activeNum <= 3) {
      this.startingPageNum = 0;
      this.endingPageNum = 5;
    }
    if (this.activeNum < this.pagesArr.length - 2 && this.activeNum > 3) {
      this.startingPageNum = this.activeNum - 3;
      this.endingPageNum = this.activeNum + 2;
    }

  }

  /**
   * Change page by clicking chevron icons.
   *
   * @param num Amount used to changed page.
   */
  changePage(num: number): void {
    this.activeNum += num;
    if (this.pagesArr.length > 5 && this.activeNum >= 3) {
      if (this.activeNum >= this.pagesArr.length - 2) {
        this.startingPageNum = this.pagesArr.length - 5;
        this.endingPageNum = this.pagesArr.length;
      }
      if (this.activeNum <= 3) {
        this.startingPageNum = 0;
        this.endingPageNum = 5;
      }
      if (this.activeNum < this.pagesArr.length - 2 && this.activeNum > 3) {
        this.startingPageNum += num;
        this.endingPageNum += num;
      }
    }
  }

}
