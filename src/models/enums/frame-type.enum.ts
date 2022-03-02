/**
 * Represent the types of input frames.
 */
export enum FrameType {
  /** Input's headline.*/
  Headline = 'h1',

  /** Input's title.*/
  Title = 'h2',

  /** Input's body text.*/
  Body = 'body',

  /** Input's image this could be Banner Image or Circular Image.*/
  Image = 'image',

  /** Input's graphs, this could be a Bar Graph, a Line Graph or a Pie Chart .*/
  Graph = 'graph',

  /** Input's table.*/
  Table = 'table',

  /** Input's list.*/
  Input = 'input',
}
