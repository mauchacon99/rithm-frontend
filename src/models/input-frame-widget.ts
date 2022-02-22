import { Question } from './question';

export interface InputFrameWidget {
  /** Number of columns that item spans. */
  cols: number;
  /** Number of rows that item spans. */
  rows: number;
  /** The x position of the item in the grid. */
  x: number;
  /** The y position of the item in the grid. */
  y: number;
  /** Minimum rows height the item is going to have in the grid. */
  minItemRows?: number;
  /** Minimum cols width the item is going to have in the grid. */
  minItemCols?: number;
  /** Maximum rows height the item is going to have in the grid. */
  maxItemRows?: number;
  /** Maximum cols width the item is going to have in the grid. */
  maxItemCols?: number;
  /** The array of questions. */
  questions: Question[];
}
