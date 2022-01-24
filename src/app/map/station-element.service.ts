import { Injectable } from '@angular/core';
import { StationMapElement } from 'src/helpers';
import {
  MapDragItem,
  MapItemStatus,
  MapMode,
  Point,
  StationElementHoverItem,
} from 'src/models';
import {
  BADGE_DEFAULT_COLOR,
  BADGE_HOVER_COLOR,
  BADGE_MARGIN,
  BADGE_RADIUS,
  BUTTON_DEFAULT_COLOR,
  BUTTON_HOVER_COLOR,
  BUTTON_RADIUS,
  BUTTON_X_MARGIN,
  BUTTON_Y_MARGIN,
  CONNECTION_DEFAULT_COLOR,
  DEFAULT_SCALE,
  ICON_FOLD,
  ICON_FULL_HEIGHT,
  ICON_FULL_WIDTH,
  ICON_MID_HEIGHT,
  ICON_MID_WIDTH,
  ICON_RADIUS,
  ICON_X_MARGIN,
  ICON_Y_MARGIN,
  NODE_DEFAULT_COLOR,
  NODE_HOVER_COLOR,
  NODE_RADIUS,
  NODE_Y_MARGIN,
  SCALE_RENDER_STATION_ELEMENTS,
  STATION_HEIGHT,
  STATION_PADDING,
  STATION_RADIUS,
  STATION_WIDTH,
  FONT_SIZE_MODIFIER,
} from './map-constants';
import { MapService } from './map.service';

/**
 * Service for rendering and other behavior for a station on the map.
 */
@Injectable({
  providedIn: 'root',
})
export class StationElementService {
  /** The default scale value for the station card. */
  private mapScale = DEFAULT_SCALE;

  /** The rendering ctx for the canvas element for the map. */
  private canvasContext?: CanvasRenderingContext2D;

  constructor(private mapService: MapService) {
    //set this.mapScale to match the behavior subject in mapService.
    this.mapService.mapScale$.subscribe((scale) => {
      this.mapScale = scale;
    });
  }

  /**
   * Draws a station on the map.
   *
   * @param station The station to draw on the map.
   * @param mapMode The current mode of the map.
   * @param cursor The location of the cursor.
   * @param dragItem The item being dragged on the map.
   */
  drawStation(
    station: StationMapElement,
    mapMode: MapMode,
    cursor: Point,
    dragItem: MapDragItem
  ): void {
    //Point the canvasContext to the global one in mapService.
    this.canvasContext = this.mapService.canvasContext;

    //Draw the card itself.
    this.drawStationCard(station, dragItem);

    //Render items on the station depending on the zoom level.
    if (this.mapScale >= SCALE_RENDER_STATION_ELEMENTS) {
      //Depending on if a station is new or not, render the document badge or new badge.
      station.status === MapItemStatus.Created
        ? this.drawNewBadge(station)
        : this.drawDocumentBadge(station, dragItem);
      //Render the stations name.
      this.drawStationName(station);

      //If the mapMode is not view mode, render the connection node, station button, and note icon if applicable.
      if (
        mapMode === MapMode.Build ||
        mapMode === MapMode.StationAdd ||
        mapMode === MapMode.StationGroupAdd
      ) {
        this.drawConnectionNode(station, dragItem, cursor);
        this.drawStationButton(station, dragItem);
        //Only render a note icon if the station has notes.
        if (station.notes) {
          this.drawStationNoteIcon(station);
        }
      }
    }
  }

  /**
   * Draws the station card on the map for a station.
   *
   * @param station The station for which to draw the card.
   * @param dragItem Checks which item is being dragged on the map.
   */
  private drawStationCard(
    station: StationMapElement,
    dragItem: MapDragItem
  ): void {
    if (!this.canvasContext) {
      throw new Error('Cannot draw the station card if context is not defined');
    }
    //We use ctx instead of this.canvasContext for the sake of brevity and readability.
    const ctx = this.canvasContext;

    const startingX = station.canvasPoint.x;
    const startingY = station.canvasPoint.y;

    const scaledStationRadius = STATION_RADIUS * this.mapScale;
    const scaledStationHeight = STATION_HEIGHT * this.mapScale;
    const scaledStationWidth = STATION_WIDTH * this.mapScale;

    const shadowEquation = (num: number) =>
      Math.floor(num * this.mapScale) > 0 ? Math.floor(num * this.mapScale) : 1;

    //Save previous context state before changing it to draw station card.
    ctx.save();
    //Set a shadow for the station card.
    ctx.shadowColor = '#ccc';
    ctx.shadowBlur = shadowEquation(6);
    ctx.shadowOffsetX = shadowEquation(3);
    ctx.shadowOffsetY = shadowEquation(3);
    //If this station is being dragged right now make the shadow bigger.
    if (
      station.hoverItem === StationElementHoverItem.Station &&
      dragItem === MapDragItem.Station &&
      station.dragging
    ) {
      ctx.shadowOffsetY = shadowEquation(20);
      ctx.shadowBlur = shadowEquation(40);
    }

    //This draws the station card as a rectangle with rounded edges.
    ctx.beginPath();
    ctx.moveTo(startingX + scaledStationRadius, startingY);
    ctx.lineTo(startingX + scaledStationWidth - scaledStationRadius, startingY);
    ctx.quadraticCurveTo(
      startingX + scaledStationWidth,
      startingY,
      startingX + scaledStationWidth,
      startingY + scaledStationRadius
    );
    ctx.lineTo(
      startingX + scaledStationWidth,
      startingY + scaledStationHeight - scaledStationRadius
    ); // line going to bottom right
    ctx.quadraticCurveTo(
      startingX + scaledStationWidth,
      startingY + scaledStationHeight,
      startingX + scaledStationWidth - scaledStationRadius,
      startingY + scaledStationHeight
    ); // bottom right curve to line going to bottom left
    ctx.lineTo(
      startingX + scaledStationRadius,
      startingY + scaledStationHeight
    ); // line going to bottom left
    ctx.quadraticCurveTo(
      startingX,
      startingY + scaledStationHeight,
      startingX,
      startingY + scaledStationHeight - scaledStationRadius
    ); // bottom left curve to line going to top left
    ctx.lineTo(startingX, startingY + scaledStationRadius); // line going to top left
    ctx.quadraticCurveTo(
      startingX,
      startingY,
      startingX + scaledStationRadius,
      startingY
    );  // top left curve to line going top right
    ctx.closePath();
    //The color of the station is different if it is being hovered over while a connection node is being dragged.
    ctx.fillStyle =
      station.hoverItem !== StationElementHoverItem.None &&
      (dragItem === MapDragItem.Node || dragItem === MapDragItem.Connection) &&
      !station.dragging
        ? '#ebebeb'
        : '#fff';
    //The outline of the station is different if it is being hovered over while a connection node is being dragged.
    ctx.strokeStyle =
      station.hoverItem !== StationElementHoverItem.None &&
      dragItem === MapDragItem.Node &&
      !station.dragging
        ? NODE_HOVER_COLOR
        : '#fff';
    ctx.stroke();
    ctx.fill();
    //After the station card is drawn, restore the context to its previously saved state.
    ctx.restore();
  }

  /**
   * Draws the station name at the top left of a station card.
   *
   * @param station The station for which to draw the station name.
   */
  private drawStationName(station: StationMapElement): void {
    if (!this.canvasContext) {
      throw new Error('Cannot reset the stroke if context is not defined');
    }
    //We use ctx instead of this.canvasContext for the sake of brevity and readability.
    const ctx = this.canvasContext;

    const scaledStationPadding = STATION_PADDING * this.mapScale;

    //Set the styling for the text.
    ctx.textAlign = 'left';
    ctx.fillStyle = 'black';
    const fontSize = Math.ceil(FONT_SIZE_MODIFIER * this.mapScale);
    //When a station has status set to updated, change the font style to reflect that.
    const isItalic =
      station.status === MapItemStatus.Updated ? 'italic' : 'normal';
    ctx.font = `${isItalic} ${fontSize}px Montserrat`;

    //We set up some blank arrays that we'll later fill with the station name.
    const sn = station.stationName.trim().split(' ');
    const firstLineArray: string[] = [];
    const secondLineArray: string[] = [];

    //When a station has status set to updated, add an asterisk to reflect that.
    if (station.status === MapItemStatus.Updated) {
      firstLineArray.push('*');
    }

    //Loop through the words of the station name.
    for (const word of sn) {
      //Make sure the first line of the station name doesn't exceed 12 chars.
      if (
        word.length <= 12 &&
        firstLineArray.join(' ').length <= 12 &&
        firstLineArray.join(' ').length + word.length <= 12 &&
        secondLineArray.length === 0
      ) {
        firstLineArray.push(word);
      } else {
        //When the first line is as long as it can get, put words on the second line.
        if (
          word.length <= 12 &&
          secondLineArray.join(' ').length <= 12 &&
          secondLineArray.join(' ').length + word.length <= 12
        ) {
          secondLineArray.push(word);
        //If a word is too long to fit on the second line.
        } else if (secondLineArray.join(' ').length + word.length >= 12) {
          //If a word is greater than 12 characters.
          if (word.length > 12) {
            //If there still isn't anything on the first line.
            if (firstLineArray.length === 0) {
              //Put part of the word on line one and part on line two.
              firstLineArray.push(word.substring(0, 10));
              secondLineArray.push(word.substring(10, 20));
            // If there is already a word on line one.
            } else if (firstLineArray.length > 0) {
              //add part of word to line two.
              secondLineArray.push(word.substring(0, 10));
              //if word is longer than 20 characters.
              if (word.length > 20) {
                //Add ellipsis.
                secondLineArray.push('...');
                break;
              }
            }
            //if word is longer than 20 characters.
            if (word.length > 20) {
              //Add ellipsis.
              secondLineArray.push('...');
              break;
            }
          //If there are multiple words in the name array.
          } else if (sn.length > 1) {
            //Add ellipsis.
            secondLineArray.push('...');
            break;
          }
        }
      }
    }

    //Fill first line with the contents of firstLineArray.
    ctx.fillText(
      firstLineArray.join(' '),
      station.canvasPoint.x + scaledStationPadding,
      station.canvasPoint.y + 12 * this.mapScale + scaledStationPadding,
      114 * this.mapScale
    );
    //If there are contents in secondLineArray, fill second line with them.
    if (secondLineArray.join(' ').length > 0) {
      ctx.fillText(
        secondLineArray.join(' '),
        station.canvasPoint.x + scaledStationPadding,
        station.canvasPoint.y + 32 * this.mapScale + scaledStationPadding,
        114 * this.mapScale
      );
    }
  }

  /**
   * Draws the document badge indicating the number of documents for the station at the top right of the station card.
   *
   * @param station The station for which to draw the badge.
   * @param dragItem Checks which item is being dragged on the map.
   */
  private drawDocumentBadge(
    station: StationMapElement,
    dragItem: MapDragItem
  ): void {
    if (!this.canvasContext) {
      throw new Error(
        'Cannot draw the document badge when canvas context is not set'
      );
    }
    //We use ctx instead of this.canvasContext for the sake of brevity and readability.
    const ctx = this.canvasContext;

    const startingX = station.canvasPoint.x;
    const startingY = station.canvasPoint.y;

    const scaledBadgeRadius = BADGE_RADIUS * this.mapScale;
    const scaledBadgeMargin = BADGE_MARGIN * this.mapScale;
    const scaledStationWidth = STATION_WIDTH * this.mapScale;

    ctx.beginPath();
    //Draw a circle for the badge.
    ctx.arc(
      startingX + scaledStationWidth - scaledBadgeMargin,
      startingY + scaledBadgeMargin,
      scaledBadgeRadius,
      0,
      2 * Math.PI
    );
    //Color the circle different if it's being hovered over. Don't color differently if dragging a node.
    ctx.fillStyle =
      station.hoverItem === StationElementHoverItem.Badge &&
      dragItem !== MapDragItem.Node &&
      !station.dragging
        ? BADGE_HOVER_COLOR
        : BADGE_DEFAULT_COLOR;
    ctx.fill();
    //Set the style of the font.
    const fontSize = Math.ceil(16 * this.mapScale);
    ctx.font = `600 ${fontSize}px Montserrat`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    //Display the number of documents in the station.
    ctx.fillText(
      station.noOfDocuments.toString(),
      startingX + scaledStationWidth - scaledBadgeMargin,
      startingY + scaledBadgeMargin + 6 * this.mapScale
    );
    ctx.closePath();
  }

  /**
   * Draws the "New" badge, indicating the station has been newly created, at the top right of the station card.
   *
   * @param station The station for which to draw the badge.
   */
  private drawNewBadge(station: StationMapElement): void {
    if (!this.canvasContext) {
      throw new Error(
        'Cannot draw the document badge when canvas context is not set'
      );
    }
    //We use ctx instead of this.canvasContext for the sake of brevity and readability.
    const ctx = this.canvasContext;

    const startingX = station.canvasPoint.x;
    const startingY = station.canvasPoint.y;

    const scaledBadgeMargin = BADGE_MARGIN * this.mapScale;
    const scaledStationWidth = STATION_WIDTH * this.mapScale;

    ctx.beginPath();
    const fontSize = Math.ceil(16 * this.mapScale);
    ctx.font = `600 ${fontSize}px Montserrat`;
    ctx.fillStyle = BADGE_DEFAULT_COLOR;
    ctx.textAlign = 'center';
    //Display "New" when the station hasn't been published yet.
    ctx.fillText(
      'New',
      startingX + scaledStationWidth - scaledBadgeMargin - 3,
      startingY + scaledBadgeMargin
    );
    ctx.closePath();
  }

  /**
   * Draws the interactive button on the bottom right of a station card.
   *
   * @param station The station for which to draw the button.
   * @param dragItem Checks which item is being dragged on the map.
   */
  private drawStationButton(
    station: StationMapElement,
    dragItem: MapDragItem
  ): void {
    if (!this.canvasContext) {
      throw new Error(
        'Cannot draw the station button when canvas context is not set'
      );
    }
    //We use ctx instead of this.canvasContext for the sake of brevity and readability.
    const ctx = this.canvasContext;

    const startingX = station.canvasPoint.x;
    const startingY = station.canvasPoint.y;

    const scaledButtonRadius = BUTTON_RADIUS * this.mapScale;
    const scaledButtonXMargin = BUTTON_X_MARGIN * this.mapScale;
    const scaledButtonYMargin = BUTTON_Y_MARGIN * this.mapScale;

    const buttonColor = BUTTON_DEFAULT_COLOR;

    ctx.beginPath();
    //Draw a series of 3 circles in a row.
    ctx.arc(
      startingX + scaledButtonXMargin,
      startingY + scaledButtonYMargin,
      scaledButtonRadius,
      0,
      2 * Math.PI
    );
    ctx.moveTo(
      startingX + scaledButtonXMargin - 1,
      startingY + scaledButtonYMargin
    );
    ctx.arc(
      startingX + scaledButtonXMargin - 2 - 2 * scaledButtonRadius,
      startingY + scaledButtonYMargin,
      scaledButtonRadius,
      0,
      2 * Math.PI
    );
    ctx.moveTo(
      startingX + scaledButtonXMargin - scaledButtonRadius - 2,
      startingY + scaledButtonYMargin
    );
    ctx.arc(
      startingX + scaledButtonXMargin - 2 * 2 - 4 * scaledButtonRadius,
      startingY + scaledButtonYMargin,
      scaledButtonRadius,
      0,
      2 * Math.PI
    );
    //Color the circles differently if hovering over them. Don't color differently if dragging a node.
    ctx.fillStyle =
      station.hoverItem === StationElementHoverItem.Button &&
      dragItem !== MapDragItem.Node &&
      !station.dragging
        ? BUTTON_HOVER_COLOR
        : buttonColor;
    ctx.fill();
    ctx.closePath();
  }

  /**
   * Draws the connection node on right side of station card.
   * Also draws a line to the cursor if dragItem is set to node.
   *
   * @param station The station for which to draw the connection node.
   * @param dragItem The item being dragged on the map.
   * @param cursor The point to draw a line to.
   */
  private drawConnectionNode(
    station: StationMapElement,
    dragItem: MapDragItem,
    cursor: Point
  ): void {
    if (!this.canvasContext) {
      throw new Error(
        'Cannot draw the connection node when canvas context is not set'
      );
    }
    //We use ctx instead of this.canvasContext for the sake of brevity and readability.
    const ctx = this.canvasContext;

    const startingX = station.canvasPoint.x;
    const startingY = station.canvasPoint.y;

    const scaledNodeRadius = NODE_RADIUS * this.mapScale;
    const scaledStationHeight = STATION_HEIGHT * this.mapScale;
    const scaledStationWidth = STATION_WIDTH * this.mapScale;
    const scaledNodeYMargin = NODE_Y_MARGIN * this.mapScale;

    ctx.beginPath();
    ctx.arc(
      startingX + scaledStationWidth,
      startingY + scaledStationHeight - scaledNodeYMargin,
      scaledNodeRadius,
      0,
      2 * Math.PI
    );
    ctx.fillStyle =
      ((dragItem === MapDragItem.Node || dragItem === MapDragItem.Connection) &&
        station.dragging) ||
      station.isAddingConnected
        ? CONNECTION_DEFAULT_COLOR
        : station.hoverItem === StationElementHoverItem.Node &&
          dragItem !== MapDragItem.Node
        ? NODE_HOVER_COLOR
        : NODE_DEFAULT_COLOR;
    ctx.fill();
    if (
      cursor.x !== -1 &&
      ((station.dragging &&
        (dragItem === MapDragItem.Node ||
          dragItem === MapDragItem.Connection)) ||
        station.isAddingConnected)
    ) {
      ctx.moveTo(
        startingX + scaledStationWidth,
        startingY + scaledStationHeight - scaledNodeYMargin
      );
      ctx.lineTo(cursor.x, cursor.y);
    }
    ctx.strokeStyle =
      ((dragItem === MapDragItem.Node || dragItem === MapDragItem.Connection) &&
        station.dragging) ||
      station.isAddingConnected
        ? CONNECTION_DEFAULT_COLOR
        : NODE_HOVER_COLOR;
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * Draws a note icon in build mode if notes are on the station.
   *
   * @param station The station for which to draw the note.
   */
  private drawStationNoteIcon(station: StationMapElement): void {
    if (!this.canvasContext) {
      throw new Error(
        'Cannot draw the connection node when canvas context is not set'
      );
    }
    //We use ctx instead of this.canvasContext for the sake of brevity and readability.
    const ctx = this.canvasContext;

    const startingX = station.canvasPoint.x;
    const startingY = station.canvasPoint.y;

    const scaledIconRadius = ICON_RADIUS * this.mapScale;
    const scaledIconFold = ICON_FOLD * this.mapScale;
    const scaledIconXMargin = ICON_X_MARGIN * this.mapScale;
    const scaledIconYMargin = ICON_Y_MARGIN * this.mapScale;
    const scaledIconMidWidth = ICON_MID_WIDTH * this.mapScale;
    const scaledIconFullWidth = ICON_FULL_WIDTH * this.mapScale;
    const scaledIconMidHeight = ICON_MID_HEIGHT * this.mapScale;
    const scaledIconFullHeight = ICON_FULL_HEIGHT * this.mapScale;

    const iconColor = BUTTON_DEFAULT_COLOR;

    ctx.beginPath(); //square with missing corner
    ctx.moveTo(
      startingX + scaledIconXMargin + scaledIconRadius,
      startingY + scaledIconYMargin
    );
    ctx.lineTo(
      startingX + scaledIconFullWidth - scaledIconRadius,
      startingY + scaledIconYMargin
    ); //across the top
    ctx.quadraticCurveTo(
      startingX + scaledIconFullWidth,
      startingY + scaledIconYMargin,
      startingX + scaledIconFullWidth,
      startingY + scaledIconYMargin + scaledIconRadius
    ); //top right curve
    ctx.lineTo(
      startingX + scaledIconFullWidth,
      startingY + scaledIconMidHeight
    ); //down the side to triangle no curve
    ctx.lineTo(
      startingX + scaledIconMidWidth + scaledIconRadius,
      startingY + scaledIconMidHeight
    ); //in to center
    ctx.quadraticCurveTo(
      startingX + scaledIconMidWidth,
      startingY + scaledIconMidHeight,
      startingX + scaledIconMidWidth,
      startingY + scaledIconMidHeight + scaledIconRadius
    ); //curve in center
    ctx.lineTo(
      startingX + scaledIconMidWidth,
      startingY + scaledIconFullHeight
    ); //from center down to bottom no curve
    ctx.lineTo(
      startingX + scaledIconXMargin + scaledIconRadius,
      startingY + scaledIconFullHeight
    ); //bottom line
    ctx.quadraticCurveTo(
      startingX + scaledIconXMargin,
      startingY + scaledIconFullHeight,
      startingX + scaledIconXMargin,
      startingY + scaledIconFullHeight - scaledIconRadius
    ); //bottom left curve
    ctx.lineTo(
      startingX + scaledIconXMargin,
      startingY + scaledIconYMargin + scaledIconRadius
    ); //left line
    ctx.quadraticCurveTo(
      startingX + scaledIconXMargin,
      startingY + scaledIconYMargin,
      startingX + scaledIconXMargin + scaledIconRadius,
      startingY + scaledIconYMargin
    );
    ctx.fillStyle = iconColor;
    ctx.fill();

    ctx.beginPath(); //triangle
    ctx.moveTo(
      startingX + scaledIconFullWidth,
      startingY + scaledIconMidHeight + scaledIconRadius
    );
    ctx.lineTo(
      startingX + scaledIconMidWidth + scaledIconRadius,
      startingY + scaledIconFullHeight
    ); // slanted line
    ctx.lineTo(
      startingX + scaledIconMidWidth + scaledIconRadius,
      startingY + scaledIconMidHeight + scaledIconRadius + scaledIconFold
    ); // line up to middle
    ctx.quadraticCurveTo(
      startingX + scaledIconMidWidth + scaledIconRadius,
      startingY + scaledIconMidHeight + scaledIconRadius,
      startingX + scaledIconMidWidth + scaledIconRadius + scaledIconFold,
      startingY + scaledIconMidHeight + scaledIconRadius
    );
    ctx.closePath();
    ctx.fillStyle = iconColor;
    ctx.fill();
  }
}
