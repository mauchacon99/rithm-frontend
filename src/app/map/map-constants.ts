import { Point } from 'src/models';

// TODO: refine this file; this is polluting the global namespace a little

export const DEFAULT_CANVAS_POINT: Point = { x: 0, y: 0 };
export const ZOOM_VELOCITY = 2;
export const MAX_SCALE = 2;
export const MIN_SCALE = .0625;
export const DEFAULT_SCALE = 1;

// Flow
export const FLOW_PADDING = 20;
export const FLOW_POINT_RADIUS = 15;

// Station
export const STATION_PADDING = 6; // TODO: Figure out correlation between this and BADGE_MARGIN
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
export const CONNECTION_ARROW_LENGTH = 6;

// Connection node
export const NODE_X_MARGIN = 0;
export const NODE_Y_MARGIN = 55;
export const NODE_RADIUS = 7;
export const NODE_HOVER_COLOR = '#ccc';
export const NODE_DEFAULT_COLOR = '#fff';