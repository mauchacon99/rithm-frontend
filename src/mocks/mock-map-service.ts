import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ZOOM_VELOCITY } from 'src/app/map/map-constants';
import {
  BoundaryMapElement,
  CenterHelper,
  ConnectionMapElement,
  MapConnectionHelper,
  MapHelper,
  MapStationGroupHelper,
  MapStationHelper,
  StationGroupMapElement,
  StationMapElement,
  ZoomHelper,
} from 'src/helpers';
import {
  MapData,
  MapItemStatus,
  MapMode,
  Point,
  StationGroupMapData,
  StationMapData,
} from 'src/models';
import { v4 as uuidv4 } from 'uuid';

/**
 * Mocks methods of the `MapService`.
 */
export class MockMapService {
  /** This behavior subject will track the array of stations. */
  mapElements$ = new BehaviorSubject<StationMapData[]>([]);

  /** The station elements displayed on the map. */
  stationElements: StationMapElement[] = [];

  /** Data for connection line paths between stations. */
  connectionElements: ConnectionMapElement[] = [];

  /** The station group elements displayed on the map. */
  stationGroupMapData: StationGroupMapData[] = [
    {
      rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
      title: 'Rithm Group',
      organizationRithmId: '',
      stations: [],
      subStationGroups: ['ED6155C9-ABB7-458E-A250-9542B2535B1C'],
      status: MapItemStatus.Normal,
      isReadOnlyRootStationGroup: false,
      isChained: false,
    },
    {
      rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
      title: ' Sub RithmGroup',
      organizationRithmId: '',
      stations: [],
      subStationGroups: [],
      status: MapItemStatus.Normal,
      isReadOnlyRootStationGroup: false,
      isChained: false,
    },
  ];

  /** The station group elements displayed on the map. */
  stationGroupElements: StationGroupMapElement[] = [];

  /** Informs the map that which drawer is opened. */
  openedDrawerType$ = new BehaviorSubject('');

  /** The station element displayed on the map. */
  station = new StationMapElement({
    rithmId: uuidv4(),
    stationName: 'Untitled Station',
    mapPoint: {
      x: 12,
      y: 15,
    },
    noOfDocuments: 0,
    previousStations: [],
    nextStations: [],
    status: MapItemStatus.Created,
    notes: '',
  });

  /** The current mode of interaction on the map. */
  mapMode$ = new BehaviorSubject(MapMode.Build);

  /** Checks if there should be panning towards the center of the map. */
  centerPan$ = new BehaviorSubject(false);

  /** An object containing the data needed to properly display and interact with the map boundary box. */
  boundaryElement?: BoundaryMapElement;

  /** The Map Helper. */
  mapHelper = new MapHelper();

  /** The Map Connection Helper. */
  mapConnectionHelper = new MapConnectionHelper(this.mapHelper);

  /** The Map Station Helper. */
  mapStationHelper = new MapStationHelper(this.mapHelper);

  /** The Station Group Helper. */
  mapStationGroupHelper = new MapStationGroupHelper(this.mapHelper);

  /** The Zoom Helper. */
  zoomHelper = new ZoomHelper(this.mapHelper);

  /** The Map Center Helper. */
  centerHelper = new CenterHelper(
    this.mapHelper,
    this.mapStationHelper,
    this.mapStationGroupHelper,
    this.zoomHelper
  );

  /**
   * Creates a new `MockMapService`.
   *
   */
  constructor() {
    this.station.isAddingConnected = true;
    this.stationElements.push(this.station);
    this.stationGroupElements = this.stationGroupMapData.map(
      (e) => new StationGroupMapElement(e)
    );
  }

  /**
   * Getter The canvas context.
   *
   * @returns CanvasRenderingContext2D | undefined.
   */
  get canvasContext(): CanvasRenderingContext2D | undefined {
    return this.mapHelper.canvasContext;
  }

  /**
   * Registers the canvas rendering context from the component for use elsewhere.
   *
   * @param canvasContext The rendering context for the canvas element.
   */
  registerCanvasContext(canvasContext: CanvasRenderingContext2D): void {
    this.mapHelper.registerCanvasContext(canvasContext);
  }

  /**
   * Gets all map elements for a given organization.
   *
   * @returns Retrieves all map elements for a given organization.
   */
  getMapData(): Observable<MapData> {
    const data: MapData = {
      stations: [
        {
          rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
          stationName: 'Development',
          noOfDocuments: 5,
          mapPoint: {
            x: 12,
            y: 15,
          },
          previousStations: [],
          nextStations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0988'],
          status: MapItemStatus.Normal,
          notes: '',
        },
        {
          rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
          stationName: 'Step 1',
          noOfDocuments: 5,
          mapPoint: {
            x: 200,
            y: 80,
          },
          previousStations: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          nextStations: [],
          status: MapItemStatus.Normal,
          notes: '',
        },
        {
          rithmId: 'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
          stationName: 'Step 2',
          noOfDocuments: 5,
          mapPoint: {
            x: 500,
            y: 400,
          },
          previousStations: [],
          nextStations: [],
          status: MapItemStatus.Normal,
          notes: '',
        },
        {
          rithmId: 'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
          stationName: 'Step 3',
          noOfDocuments: 5,
          mapPoint: {
            x: 50,
            y: 240,
          },
          previousStations: [],
          nextStations: [],
          status: MapItemStatus.Normal,
          notes: '',
        },
      ],
      stationGroups: [
        {
          rithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
          organizationRithmId: 'ED6155C9-ABB7-458E-A250-9542B2535B1C',
          title: 'Group 1',
          stations: [
            'ED6148C9-ABB7-408E-A210-9242B2735B1C',
            'CCAEBE24-AF01-48AB-A7BB-279CC25B0988',
            'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
            'CCAEBE24-AF01-48AB-A7BB-279CC25B0990',
            'CCAEBE54-AF01-48AB-A7BB-279CC25B0990',
            'CCAEBE94-AF01-48AB-A7BB-279CC25B0989',
          ],
          subStationGroups: [],
          status: MapItemStatus.Normal,
          isReadOnlyRootStationGroup: false,
          isChained: false,
        },
        {
          rithmId: '',
          title: '',
          stations: [],
          subStationGroups: ['ED6155C9-ABB7-458E-A250-9542B2535B1C'],
          status: MapItemStatus.Normal,
          isReadOnlyRootStationGroup: true,
          isChained: false,
        },
      ],
    };
    return of(data).pipe(delay(1000));
  }

  /**
   * Create a new Station.
   *
   * @param coords The coordinates where the station will be placed.
   */
  // eslint-disable-next-line
  createNewStation(coords: Point): void {}

  /**
   * Updates station status to delete.
   *
   * @param station The station for which status has to be set to delete.
   */
  // eslint-disable-next-line
  deleteStation(station: StationMapElement): void {}

  /**
   * Enters build mode for the map.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  buildMap(): void {}

  /**
   * Cancels local map changes and returns to view mode.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cancelMapChanges(): void {}

  /**
   * Publishes local map changes to the server.
   *
   * @param mapData Data sending to the API.
   * @returns Observable of Comment.
   */
  publishMap(mapData: MapData): Observable<unknown> {
    if (!mapData) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Some error message',
            },
          })
      ).pipe(delay(1000));
    } else {
      return of().pipe(delay(1000));
    }
  }

  /**
   * Zooms the map by adjusting the map scale and position.
   *
   * @param zoomingIn Zooming in or out?
   * @param zoomOrigin The specific location on the canvas to zoom. Optional; defaults to the center of the canvas.
   * @param zoomAmount How much to zoom in/out.
   */
  zoom(
    /* eslint-disable */
    zoomingIn: boolean,
    zoomOrigin = this.mapHelper.getCanvasCenterPoint(),
    zoomAmount = ZOOM_VELOCITY
  ): void {}
  /* eslint-enable */

  /**
   * Disable publish button until some changes in map/station.
   *
   * @returns Returns true if no stations are updated and false if any station is updated.
   */
  get mapHasChanges(): boolean {
    return this.stationElements.some(
      (station) => station.status !== MapItemStatus.Normal
    );
  }

  /**
   * Reset disable and true status to false when a station-group is deselected.
   */
  resetSelectedStationGroupStationStatus(): void {
    this.stationGroupElements.map((stationGroup) => {
      stationGroup.selected = false;
      stationGroup.disabled = false;
      stationGroup.stations.map((station) => {
        const stationIndex = this.stationElements.findIndex(
          (st) => st.rithmId === station
        );
        this.stationElements[stationIndex].selected = false;
        this.stationElements[stationIndex].disabled = false;
      });
    });
  }

  /**
   * Delete the station group and find it's parent to move all it's stations and sub groups to parent station group.
   *
   * @param stationGroupId The incoming station group Id to be deleted.
   */
  removeStationGroup(stationGroupId: string): void {
    //Find the station group from this.stationGroupElements array.
    const stationGroup = this.stationGroupElements.find(
      (group) => group.rithmId === stationGroupId
    );
    if (!stationGroup) {
      throw new Error('Station group was not found.');
    }
    this.stationGroupElements.forEach((group) => {
      if (
        //Find parent station group of incoming station group.
        group.subStationGroups.includes(stationGroup.rithmId)
      ) {
        //Move all sub station groups of incoming station group to it's parent.
        group.subStationGroups = group.subStationGroups.concat(
          stationGroup.subStationGroups
        );
        //Move all stations of incoming station group to it's parent.
        group.stations = group.stations.concat(stationGroup.stations);
        //Mark parent station group of incoming station group as updated.
        group.markAsUpdated();
        //Remove all stations of deleting station group.
        stationGroup.stations = [];
        //Remove all sub station groups of deleting station group.
        stationGroup.subStationGroups = [];
        //Mark incoming station group as deleted.
        stationGroup.markAsDeleted();
        //Note a change in map data.
        this.mapHelper.mapDataReceived$.next(true);
      }
    });
  }

  /**
   * Set drawerOpened property of respective map element to false when any drawer is closed.
   *
   * @param drawerItem The opened drawer type.
   */
  handleDrawerClose(drawerItem: string): void {
    if (drawerItem === 'stationInfo') {
      if (this.stationElements.some((e) => e.drawerOpened)) {
        const openedStations = this.stationElements.filter(
          (e) => e.drawerOpened
        );
        openedStations.forEach((station) => {
          station.drawerOpened = false;
        });
        this.openedDrawerType$.next('');
        this.mapHelper.mapDataReceived$.next(true);
      }
    }
  }

  /**
   * Set station group status of parent and child station group and respective stations.
   *
   * @param stationGroup The incoming station-group data.
   */
  setStationGroupStatus(stationGroup: StationGroupMapElement): void {
    //Update parent station-group and respective stations status.
    this.mapStationGroupHelper.updateParentStationGroup(stationGroup.rithmId);
    //Update descendent station-group and respective stations status.
    this.mapStationGroupHelper.updateChildStationGroup(
      stationGroup,
      this.mapStationHelper
    );
    //Reset status of each station-group and station if nothing(station group or station) has been selected.
    if (
      !this.stationElements.some((st) => st.selected) &&
      !this.stationGroupElements.some((stGroup) => stGroup.selected)
    ) {
      this.resetSelectedStationGroupStationStatus();
    }
  }

  /**
   * Set disable status to true before updating station-group and station status so that only current stationGroup is enabled to de-select.
   */
  setStationGroupStationStatus(): void {
    this.stationGroupElements.map((stationGroup) => {
      stationGroup.disabled = true;
      stationGroup.stations.map((station) => {
        const stationIndex = this.stationElements.findIndex(
          (st) => st.rithmId === station
        );
        if (!this.stationElements[stationIndex].selected) {
          this.stationElements[stationIndex].disabled = true;
        }
      });
    });
  }

  /**
   * Updates pendingStationGroup with the current selected stations and groups.
   */
  updatePendingStationGroup(): void {
    this.mapStationGroupHelper.updatePendingStationGroup(this.mapStationHelper);
  }

  /**
   * Update the canvas points for each station.
   */
  updateStationCanvasPoints(): void {
    this.mapStationHelper.updateStationCanvasPoints(this.mapConnectionHelper);
  }

  /**
   * Based on incoming station selection, update the status of related stations and station group.
   *
   * @param station The incoming station.
   */
  setSelectedStation(station: StationMapElement): void {
    this.stationGroupElements.map((stationGroup) => {
      if (station.selected) {
        if (stationGroup.stations.includes(station.rithmId)) {
          stationGroup.stations.map((st) => {
            const stationIndex = this.stationElements.findIndex(
              (sta) => sta.rithmId === st
            );
            this.stationElements[stationIndex].disabled = false;
          });
          stationGroup.disabled = false;
          stationGroup.subStationGroups.forEach((subStationGroupId) => {
            const stationGroupIndex = this.stationGroupElements.findIndex(
              (group) => group.rithmId === subStationGroupId
            );
            this.stationGroupElements[stationGroupIndex].disabled = false;
          });
          return;
        }
      } else {
        //If removing a selected station need to find the group that pending group is inside.
        if (stationGroup.status === MapItemStatus.Pending) {
          //const to reference the parent of the pending group.
          const parentGroup = this.stationGroupElements.find(
            (parentStationGroup) => {
              return parentStationGroup.subStationGroups.includes(
                stationGroup.rithmId
              );
            }
          );
          if (parentGroup) {
            parentGroup.stations.map((st) => {
              const stationIndex = this.stationElements.findIndex(
                (sta) => sta.rithmId === st
              );
              this.stationElements[stationIndex].disabled = false;
            });
            parentGroup.disabled = false;
            parentGroup.subStationGroups.forEach((subStationGroupId) => {
              const stationGroupIndex = this.stationGroupElements.findIndex(
                (group) => group.rithmId === subStationGroupId
              );
              this.stationGroupElements[stationGroupIndex].disabled = false;
            });
            return;
          }
        }
      }
    });
    if (
      !this.stationElements.some((st) => st.selected) &&
      !this.stationGroupElements.some((stGroup) => stGroup.selected)
    ) {
      this.resetSelectedStationGroupStationStatus();
    }
  }
}
