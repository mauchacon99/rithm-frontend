/**
 * Represents info about the application state of Material `sidenav` and `drawer`.
 */
export enum SidenavDrawerStatus {
  /** The mobile sidenav is open. */
  sidenavOpen = 'sidenavOpen',

  /** The comment drawer is open for a document or station. */
  commentDrawerOpen = 'commentDrawerOpen',

  /** The history drawer is open for a document or station. */
  historyDrawerOpen = 'historyDrawerOpen',

  /** The map drawer is open. */
  mapDrawerOpen = 'mapDrawerOpen',

  /** All drawers and the sidenav are closed. */
  closed = 'closed'
}
