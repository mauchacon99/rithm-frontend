import { Question } from './question';

export interface StationFrameWidget {
  /** Unique Id for each StationFrame. */
  rithmId: string;
  /** The id of the specific station. */
  stationRithmId: string;
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
  questions?: Question[];
  /** Type each input frame. */
  /** This is going to be updated with StationFrameType Enum. */
  type: string;
  /** The data contained in each frame. */
  data: string;
  /** Id of the item. */
  id: number;
}
