import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

const MIN_NUM_RECORDS = 1;
const INIT_PAGE_NUM = 1;
const LAST_PAGE_NUM = 5;
const RESET_PAGE_NUM_LIMIT = 5;
const ACTIVE_NUM_LIMIT_RESET_PAGE_NUM = 3;
const LAST_BUT_ONE_PAGE_NUM = 2;
const SET_ENDING_PAGE_NUM = 2;

/**
 * Reusable component for pagination with clickable pages.
 */
@Component({
  selector: 'app-pagination[numItems][numPerPage][activeNum]',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  /** Total number of items. */
  @Input() numItems!: number;

  /** Number of items per page. Should match the api request. */
  @Input() numPerPage!: number;

  /** Total number of pages. */
  private numPages = 0;

  /** Array of page numbers. */
  pagesArr!: number[];

  /** Array that displays the range of documents shown on the page. */
  rangeArr!: string[];

  /** Set the page number. */
  @Output() private currentPageNum = new EventEmitter<number>();

  /** Current active page. */
  @Input() activeNum = 1;

  /** Where to start the array of pages. */
  startingPageNum = 0;

  /** Where to end the array of pages. */
  endingPageNum = 5;

  /** Increment page number by 1 to navigate to next page. */
  readonly nextPage = 1;

  /** Decrement page number by 1 to navigate to previous page. */
  readonly prevPage = -1;

  /**
   * Calculates number of pages.
   * Creates list of document ranges to be displayed.
   */
  ngOnInit(): void {
    this.numPages = Math.ceil(this.numItems / this.numPerPage);
    this.pagesArr = [];
    this.rangeArr = [];

    let startingNum = MIN_NUM_RECORDS;
    let endingNum = this.numPerPage;

    for (let page = 0; page <= this.numPages - 1; page++) {
      startingNum = MIN_NUM_RECORDS;
      endingNum = this.numPerPage;
      startingNum += this.numPerPage * page;
      endingNum += this.numPerPage * page;
      if (page !== this.numPages - 1) {
        this.rangeArr.push(`${startingNum}-${endingNum}`);
      } else {
        this.rangeArr.push(`${startingNum}-${this.numItems}`);
      }
    }

    while (this.numPages--) {
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

    if (
      this.activeNum >= this.pagesArr.length - LAST_BUT_ONE_PAGE_NUM &&
      this.pagesArr.length > RESET_PAGE_NUM_LIMIT
    ) {
      this.startingPageNum = this.pagesArr.length - RESET_PAGE_NUM_LIMIT;
      this.endingPageNum = this.pagesArr.length;
    }
    if (this.activeNum <= ACTIVE_NUM_LIMIT_RESET_PAGE_NUM) {
      this.startingPageNum = INIT_PAGE_NUM;
      this.endingPageNum = LAST_PAGE_NUM;
    }
    if (
      this.activeNum < this.pagesArr.length - LAST_BUT_ONE_PAGE_NUM &&
      this.activeNum > ACTIVE_NUM_LIMIT_RESET_PAGE_NUM
    ) {
      this.startingPageNum = this.activeNum - ACTIVE_NUM_LIMIT_RESET_PAGE_NUM;
      this.endingPageNum = this.activeNum + SET_ENDING_PAGE_NUM;
    }
    this.emitPageNum(this.activeNum);
  }

  /**
   * Change page by clicking chevron icons.
   *
   * @param num Amount used to changed page.
   */
  changePage(num: number): void {
    this.activeNum += num;
    if (
      this.pagesArr.length > RESET_PAGE_NUM_LIMIT &&
      this.activeNum >= ACTIVE_NUM_LIMIT_RESET_PAGE_NUM
    ) {
      if (this.activeNum >= this.pagesArr.length - LAST_BUT_ONE_PAGE_NUM) {
        this.startingPageNum = this.pagesArr.length - RESET_PAGE_NUM_LIMIT;
        this.endingPageNum = this.pagesArr.length;
      }
      if (this.activeNum <= ACTIVE_NUM_LIMIT_RESET_PAGE_NUM) {
        this.startingPageNum = INIT_PAGE_NUM;
        this.endingPageNum = LAST_PAGE_NUM;
      }
      if (
        this.activeNum < this.pagesArr.length - LAST_BUT_ONE_PAGE_NUM &&
        this.activeNum > ACTIVE_NUM_LIMIT_RESET_PAGE_NUM
      ) {
        this.startingPageNum += num;
        this.endingPageNum += num;
      }
    }
    this.emitPageNum(this.activeNum);
  }

  /**
   * Send the new page number to the parent component.
   *
   * @param newPageNum What page number to emit.
   */
  private emitPageNum(newPageNum: number): void {
    this.currentPageNum.emit(newPageNum);
  }
}
