/**
 * Represent the types of input frames.
 */
export enum InputFrameType {
  /** Input's headline.*/
  Headline = 'h1',

  /** Input's title.*/
  Title = 'h2',

  /** Input's body text.*/
  Body = 'body',

  /** Input's image this could be Banner Image or Circular Image.*/
  Image = 'image',

  /** Input's graphs, this could be a Bar Graph, a Line Graph or a Pie Chart .*/
  Graphs = 'graphs',

  /** Input's table.*/
  Table = 'table',

  /** Input's list.*/
  List = 'list',
}
