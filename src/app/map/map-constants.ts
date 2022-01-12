import { Point } from 'src/models';

// TODO: refine this file; this is polluting the global namespace a little
export const DEFAULT_CANVAS_POINT: Point = { x: 0, y: 0 };
export const DEFAULT_MOUSE_POINT: Point = { x: -1, y: -1 };
export const FONT_SIZE_MODIFIER = 16;
export const TOUCH_EVENT_MARGIN = 5;

// Scale
export const DEFAULT_SCALE = 1;
export const ZOOM_VELOCITY = 0.99;
export const MAX_SCALE = DEFAULT_SCALE / Math.pow(ZOOM_VELOCITY, 50);
export const MIN_SCALE = DEFAULT_SCALE * Math.pow(ZOOM_VELOCITY, 190);
/** Needed to solve a bug related to map zoom. */
export const ABOVE_MAX = MAX_SCALE / ZOOM_VELOCITY;
export const BELOW_MIN = MIN_SCALE * ZOOM_VELOCITY;
/** The scale at which Station Elements are no longer rendered. */
export const SCALE_RENDER_STATION_ELEMENTS =
  DEFAULT_SCALE * Math.pow(ZOOM_VELOCITY, 100);
export const SCALE_REDUCED_RENDER =
  SCALE_RENDER_STATION_ELEMENTS / Math.pow(ZOOM_VELOCITY, 40);

// Pan
export const MAX_PAN_VELOCITY = 25;
export const PAN_TRIGGER_LIMIT = 10;
export const PAN_DECAY_RATE = 0.9;

// Center
/**
 * Needed to solve a bug related to setting the scale when centering the map.
 * The buffer sets the amount of space between the bounding box calculated when zooming in vs zooming out.
 */
export const CENTER_ZOOM_BUFFER = 10;

// Flow
export const FLOW_PADDING = 20;
export const FLOW_POINT_RADIUS = 15;
export const GROUP_NAME_PADDING = 6;
export const FLOW_NAME_HEIGHT = 20;

// Station
export const STATION_PADDING = 10;
export const STATION_HEIGHT = 110;
export const STATION_WIDTH = 160;
export const STATION_RADIUS = 10;

// Station badge
export const BADGE_RADIUS = 15;
export const BADGE_MARGIN = 20;
export const BADGE_DEFAULT_COLOR = '#667080';
export const BADGE_HOVER_COLOR = '#7D8593';

// Connection
export const CONNECTION_LINE_WIDTH = 2;
export const CONNECTION_LINE_WIDTH_ZOOM_OUT = 1;
export const CONNECTION_ARROW_LENGTH = 6;
export const CONNECTION_DEFAULT_COLOR = '#7a8699';
export const CONNECTION_NODE_OFFSET = 80;
export const CONNECTION_HEIGHT_REDUCER = 5;
export const MOUSE_MOVEMENT_OVER_CONNECTION = 5;

// Connection node
export const NODE_X_MARGIN = 0;
export const NODE_Y_MARGIN = 55;
export const NODE_RADIUS = 7;
export const NODE_HOVER_COLOR = '#ccc';
export const NODE_DEFAULT_COLOR = '#fff';

// Station Button
export const BUTTON_X_MARGIN = 150;
export const BUTTON_Y_MARGIN = 90;
export const BUTTON_RADIUS = 4;
export const BUTTON_DEFAULT_COLOR = '#667080';
export const BUTTON_HOVER_COLOR = '#7D8593';

// Note Icon
export const ICON_X_MARGIN = 8;
export const ICON_Y_MARGIN = 82;
export const ICON_MID_WIDTH = 18;
export const ICON_FULL_WIDTH = 28;
export const ICON_MID_HEIGHT = 92;
export const ICON_FULL_HEIGHT = 102;
export const ICON_RADIUS = 2;
export const ICON_FOLD = 1;
