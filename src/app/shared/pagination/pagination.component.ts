import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/**
 * Reusable component for pagination with clickable pages.
 */
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  /** Total number of documents. */
  @Input() numDocs!: number;

  /** Total number of pages. */
  private numPages = 0;

  /** Array of page numbers. */
  pagesArr!: number[];

  /** Array that displays the range of documents shown on the page. */
  rangeArr!: string[];

  /** Set the page number. */
  @Output() private currentPageNum = new EventEmitter<number>();

  /** Current active page. */
  activeNum = 1;

  /** Where to start the array of pages. */
  startingPageNum = 0;

  /** Where to end the array of pages. */
  endingPageNum = 5;

  /**
   * Calculate number of pages.
   * Create list of document ranges to be displayed.
   */
  ngOnInit(): void {
    this.emitPageNum(1);
    this.numPages = Math.ceil(this.numDocs / 10);
    this.pagesArr = [];
    this.rangeArr = [];

    let startingNum = 1;
    let endingNum = 10;
    const numPerPage = 10;

    for (let page = 0; page <= this.numPages - 1; page++){
      startingNum = 1;
      endingNum = 10;
      startingNum += numPerPage * page;
      endingNum += numPerPage * page;
      if (page !== this.numPages -1){
        this.rangeArr.push(`${startingNum}-${endingNum}`);
      } else {
        this.rangeArr.push(`${startingNum}-${this.numDocs}`);
      }
    }

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
    this.emitPageNum(this.activeNum);
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
    this.emitPageNum(this.activeNum);
  }

  /**
   * Send the new page number to the parent component.
   *
   * @param newPageNum What page number to emit.
   */
  emitPageNum(newPageNum: number): void {
    this.currentPageNum.emit(newPageNum);
  }

}
