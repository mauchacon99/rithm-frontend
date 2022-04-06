/**
 * Represents the types widgets.
 */
export enum WidgetType {
  // Stations enum.
  /** Widget type station-table. */
  Station = 'station-table',
  /** Widget type station-table-banner-widget. */
  StationTableBanner = 'station-table-banner-widget',
  /** Widget type station-multiline. */
  StationMultiline = 'station-multiline',
  /** Widget type station-multiline-banner. */
  StationMultilineBanner = 'station-multiline-banner',

  // Document enum.
  /** Widget type document-list. */
  Document = 'document-list',
  /** Widget type document-list-banner-widget. */
  DocumentListBanner = 'document-list-banner-widget',
  /** Widget type container-profile-banner-widget. */
  ContainerProfileBanner = 'container-profile-banner-widget',

  // Group enum.
  /** Widget type station-group-search-widget. */
  StationGroupSearch = 'station-group-search-widget',
  /** Widget type station-group. */
  StationGroup = 'station-group',
}
