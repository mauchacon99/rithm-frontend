/**
 * Represents info about the application state of Material `sidenav` and `drawer`.
 */
export enum SidenavDrawerStatus {
  /** The mobile sidenav is open. */
  SidenavOpen = 'sidenavOpen',

  /** The comment drawer is open for a document or station. */
  CommentDrawerOpen = 'commentDrawerOpen',

  /** The history drawer is open for a document or station. */
  HistoryDrawerOpen = 'historyDrawerOpen',

  /** The map drawer is open. */
  MapDrawerOpen = 'mapDrawerOpen',

  /** All drawers and the sidenav are closed. */
  Closed = 'closed'
}
